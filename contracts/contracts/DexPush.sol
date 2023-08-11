// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {HyperlaneConnectionClient} from "@hyperlane-xyz/core/contracts/HyperlaneConnectionClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

contract DexPush is HyperlaneConnectionClient  {
    // The link from this blockchain to another address
    mapping(address => mapping(uint32 => address)) public superAccounts;
    mapping(address => uint256) public pools;
    mapping(address => mapping(uint32 => address)) public superTokens;
    mapping(uint32 => bytes32) public superDex;

    bytes1 public addOp = 0x01;

    constructor(address mailbox) {
        __HyperlaneConnectionClient_initialize(mailbox);
    }

    // make it secure
    function setSuperAccount(address account, uint32 networkId, address networkAccount) external {
        superAccounts[account][networkId] = networkAccount;
    }

    function setSuperToken(address token, uint32 networkId, address networkToken) external {
        superTokens[token][networkId] = networkToken;
    }
    function setSuperDex(uint32 networkId, address networkDex) external {
        superDex[networkId] = TypeCasts.addressToBytes32(networkDex);
    }

    /**
     * @notice Transfer token from one chain to another using the dex pool.
     * @param destination the target chain id where the transaction should be executed
     * @param amount to transfer from this blockchain
     * @param token the token type
     */
    function transferToken(
        uint32 destination,
        uint256 amount,         // we take this amount
        address token,          // of the tokens from the user in this blockchain.
        address safeParamTo,             // safe sdk part to which smartcontract it needs to be send
        bytes calldata safeParamData,     // safe sdk the transaction parameters
        bytes calldata safeSignatures
     ) external {
        pools[token] += amount;

        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "failed to get tokens");

        // a smartcontract that keeps the pre-funded data. it's a safe wallet.
        // we send the data to there.
        address safeWallet = superAccounts[msg.sender][destination];
        address tokenOnRemote = superTokens[token][destination];

        // when DexPush.sol on the destination handles it, it will send to proxyAddr(safe wallet) `amount` of `token`.
        // then it will `executeTransaction`
        bytes memory wrappedData = abi.encodePacked(addOp, safeWallet, tokenOnRemote, amount, safeParamTo, safeParamData, safeSignatures);

        mailbox.dispatch(destination, superDex[destination], wrappedData);
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
        (bytes1 opType,
        address proxyAddr,
        address token,
        uint256 amount,
        address safeParamTo,
        bytes memory safeParamData,
        bytes memory safeSignatures) = abi.decode(_message, (bytes1, address, address, uint256, address, bytes, bytes));
        require(opType == addOp, "only add op, its for developers");

        require(IERC20(token).transfer(proxyAddr, amount), "failed to send tokens to safe");

        bytes memory payload = abi.encodeWithSignature("execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes",
            safeParamTo, 0, safeParamData, 1, 0, 0, 0, address(0), address(0), safeSignatures);
        (bool success, bytes memory returnData) = proxyAddr.call(payload);
        require(success);
    }

}