// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {HyperlaneConnectionClient} from "@hyperlane-xyz/core/contracts/HyperlaneConnectionClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

/**
A token manager that seats in the SuperWallet chain. For securing the transactions made by SuperWallet.
*/
contract DexPush is HyperlaneConnectionClient  {
    struct SuperTransfer {
        uint32 destination;
        uint256 amount;
        uint32 tokenId;          // of the tokens from the user in this blockchain.
        address safeParamTo;             // safe sdk part to which smartcontract it needs to be send
        bytes safeParamData;     // safe sdk the transaction parameters
        bytes safeSignatures;
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

    constructor(address mailbox) {
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


    // ============ On receive functions ============

    /**
   * @notice Emits a HelloWorld event upon receipt of an interchain message
   * @param _origin The chain ID from which the message was sent
   * @param _sender The address that sent the message
   * @param _message The contents of the message
   */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) external onlyMailbox {
        // transferOp, sourceSender, token, amount
        (bytes1 opType, address sourceSender) = abi.decode(_message, (bytes1, address));
        if (opType == transferOp) {
            address swtAcc = sourceToSwt[_origin][sourceSender];
            SuperTransfer memory superTransfer = superTransfers[swtAcc][_origin];

            require(superTransfer.destination > 0, "not cross-chain transfer");
            _transferToDestination(swtAcc, superTransfer);

            delete superTransfers[swtAcc][_origin];
        }
    }

}