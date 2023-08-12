// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {HyperlaneConnectionClient} from "@hyperlane-xyz/core/contracts/HyperlaneConnectionClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import "./Dex.sol";

/**
A token manager that seats in the SuperWallet chain. For securing the transactions made by SuperWallet users.
*/
contract DexPush is HyperlaneConnectionClient, Dex  {
    struct SuperTransfer {
        uint32 destination;
        uint256 amount;
        uint32 tokenId;          // of the tokens from the user in this blockchain.
        address safeParamTo;             // safe sdk part to which smartcontract it needs to be send
        bytes safeParamData;     // safe sdk the transaction parameters
        bytes safeSignatures;
    }

    struct SuperAdd {
        uint32 destination;
        uint32 source;
        uint amount0;   // index 0 is from the source
        uint amount1;   // index 1 is from the destination
        uint supply0;
    }

    // The link from this blockchain to another address
    // swtAccount => destination => user's address there
    mapping(address => mapping(uint32 => address)) public superAccounts;
    mapping(address => uint256) public pools;
    // tokenId => hyperlaneChainId => token address
    mapping(uint32 => mapping(uint32 => address)) public superTokens;
    // address of the dex pull in the remote account
    // destination id => DexPull address
    mapping(uint32 => bytes32) public superDex;
    // user => source => transfer
    mapping(address => mapping(uint32 => SuperTransfer)) public superTransfers;
    // reverse of superAccounts to find the user by it's name on another chain
    // network => networkAcc => swtAcc;
    mapping(uint32 => mapping(address => address)) public sourceToSwt;

    bytes1 public transferOp = 0x01;
    bytes1 public addOp = 0x02;
    bytes1 public swapOp = 0x03;

    constructor() {}

    function initialize(address mailbox) external initializer {
        __HyperlaneConnectionClient_initialize(mailbox);
    }

    // must be restricted.
    function setSuperAccount(address account, uint32 networkId, address networkAccount) external {
        superAccounts[account][networkId] = networkAccount;
        sourceToSwt[networkId][networkAccount] = account;
    }

    // must be restricted.
    function setSuperToken(uint32 tokenId, uint32 networkId, address networkToken) external {
        superTokens[tokenId][networkId] = networkToken;
    }

    // must be restricted.
    function setSuperDex(uint32 networkId, address networkDex) external {
        superDex[networkId] = TypeCasts.addressToBytes32(networkDex);
    }

    /**
     * Start the transaction.
     *
     * Destination is the chain where the receipt will receive tokens.
     *
     * If the amount is 0, it will not wait for the message, instead it will send directly.
     *
     * @notice Transfer token from one chain to another using the dex pool.
     * @param destination the target chain id where the transaction should be executed
     * @param amount to transfer from this blockchain
     * @param tokenId the token type
     */
    function transferToken(
        uint32 source,              // we should receive message from this blockchain about token deduction
        uint32 tokenId,          // of the tokens from the user in this blockchain.
        uint32 destination,         // we should send message to here about token transfer
        uint256 amount,
        address safeParamTo,             // safe sdk part to which smartcontract it needs to be send
        bytes calldata safeParamData,     // safe sdk the transaction parameters
        bytes calldata safeSignatures
     ) external {
        require(superTransfers[msg.sender][source].destination > 0, "previous tx is pending");

        SuperTransfer memory superTransfer = SuperTransfer(destination, amount, tokenId, safeParamTo, safeParamData, safeSignatures);
        if (amount > 0) {
            // user => source => transfer
            superTransfers[msg.sender][source] = superTransfer;
        } else {
            _transferToDestination(msg.sender, superTransfer);
        }
    }


    function _transferToDestination(address swtAcc, SuperTransfer memory superTransfer) internal {
        // a smartcontract that keeps the pre-funded data. it's a safe wallet.
        // we send the data to there.
        address safeWallet = superAccounts[swtAcc][superTransfer.destination];
        address tokenOnRemote = superTokens[superTransfer.tokenId][superTransfer.destination];

        // when DexPush.sol on the destination handles it, it will send to proxyAddr(safe wallet) `amount` of `token`.
        // then it will `executeTransaction`
        bytes memory wrappedData = abi.encodePacked(
            transferOp,
            safeWallet,
            tokenOnRemote,
            superTransfer.amount,
            superTransfer.safeParamTo,
            superTransfer.safeParamData,
            superTransfer.safeSignatures);

        mailbox.dispatch(superTransfer.destination, superDex[superTransfer.destination], wrappedData);
    }

    // it doesn't track the deflationary tokens YET
    function _addLiquidity(uint d0, uint d1, address swtAcc, uint32 tokenId, uint32 destination) private {
        uint shares = 0;
        if (totalSupply > 0) {
            shares = ((d0 + d1) * totalSupply) / (reserve0 + reserve1);
        } else {
            shares = d0 + d1;
        }

        require(shares > 0, "shares = 0");
        _mint(swtAcc, shares);
        _update(reserve0 + d0, reserve1 + d1);

        // a smartcontract that keeps the pre-funded data. it's a safe wallet.
        // we send the data to there.
        address safeWallet = superAccounts[swtAcc][destination];
        address tokenOnRemote = superTokens[tokenId][destination];

        // transfer to the destination to withdraw some token
        bytes memory wrappedData = abi.encodePacked(
            addOp,
            safeWallet,
            tokenOnRemote,
            d1);

        mailbox.dispatch(destination, superDex[destination], wrappedData);
    }

    function _swap(uint32 _origin, bytes memory _message) private {
        (,
            address sourceSender,
            uint32 destTokenId,
            uint32 destination,
            uint amountIn,
            bool isToken0) = abi.decode(_message, (bytes1, address, uint32, uint32, uint, bool));

        (uint resIn, uint resOut) = isToken0 ?
            (reserve0, reserve1) :
            (reserve1, reserve0);


        uint amountOut = (amountIn * 997) / 1000;

        isToken0 ?
            _update(resIn + amountIn, resOut - amountOut) :
            _update(resOut - amountOut, resIn + amountIn);

        address swtAcc = sourceToSwt[_origin][sourceSender];
        address safeWallet = superAccounts[swtAcc][destination];
        address tokenOnRemote = superTokens[destTokenId][destination];

        // transfer to the destination to withdraw some token
        bytes memory wrappedData = abi.encodePacked(
            swapOp,
            safeWallet,
            tokenOnRemote,
            amountOut);

        mailbox.dispatch(destination, superDex[destination], wrappedData);
    }

    // ============ On receive functions ============

    /**
   * @notice Emits a HelloWorld event upon receipt of an interchain message
   * @param _origin The chain ID from which the message was sent
   * @param _message The contents of the message
   */
    function handle(
        uint32 _origin,
        bytes32 , // the smartcontract that sent the message
        bytes memory _message
    ) external onlyMailbox {
        bytes1 opType = _message[0];

        // transferOp, sourceSender, token, amount
        if (opType == transferOp) {
            (, address sourceSender) = abi.decode(_message, (bytes1, address));
            address swtAcc = sourceToSwt[_origin][sourceSender];
            SuperTransfer memory superTransfer = superTransfers[swtAcc][_origin];

            require(superTransfer.destination > 0, "not cross-chain transfer");
            _transferToDestination(swtAcc, superTransfer);

            delete superTransfers[swtAcc][_origin];
        } else if (opType == addOp) {
            (,address sourceSender,
            uint32 tokenId,     // destination token id
            uint32 destination,
            uint amount0,
            uint amount1) = abi.decode(_message, (bytes1, address, uint32, uint32, uint, uint));

            _addLiquidity(amount0, amount1, sourceToSwt[_origin][sourceSender], tokenId, destination);
        } else if (opType == swapOp) {
            _swap(_origin, _message);
        }
    }

}