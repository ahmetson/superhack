// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {HyperlaneConnectionClient} from "@hyperlane-xyz/core/contracts/HyperlaneConnectionClient.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

/**
DexPull is the part of the dex that seats on the blockchains.

It receives the message from a user to deduct the balance and that balance is send to the destination.
It receives the message from mailbox, in that case it will execute the transaction.

Deploy it with the SuperWallet Chain and DexPush parameters.
*/
contract DexPull is HyperlaneConnectionClient  {
    // The link from this blockchain to another address
    mapping(address => mapping(uint32 => address)) public superAccounts;
    mapping(address => uint256) public pools;
    mapping(address => mapping(uint32 => address)) public superTokens;

    bytes1 public transOp = 0x01;
    uint32 public dexPushDest;
    bytes32 public dexPush;

    // Mailbox is responsible for transmitting the messages
    // Mailbox transmits the messages to the dexPush
    constructor(address mailbox, address dexAddr, uint32 dexDest) {
        __HyperlaneConnectionClient_initialize(mailbox);
        dexPush = TypeCasts.addressToBytes32(dexAddr);
        dexPushDest = dexDest;
    }

    /**
     * DexPull acts as source.
     * @notice Transfer token from one chain to another using the dex pool (middle chain).
     * @param amount to transfer from this blockchain
     * @param token the token type
     */
    function transferToken(
        uint256 amount,         // we take this amount
        address token          // of the tokens from the user in this blockchain.
    ) external {
        pools[token] += amount;

        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "failed to get tokens");

        // send it to the dex push.
        // dex push should have the parameters of the request to send in destination.
        bytes memory wrappedData = abi.encodePacked(transOp, msg.sender);

        // Notify the SuperWallet that tokens were deducted
        mailbox.dispatch(dexPushDest, dexPush, wrappedData);
    }

    // ============ On receive functions ============

    // The DexPull acts as the destination
    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external onlyMailbox {
        (bytes1 opType,
            address user,
            address token,
            uint256 amount,
            address safeParamTo,
            bytes memory safeParamData,
            bytes memory safeSignatures) = abi.decode(_message, (bytes1, address, address, uint256, address, bytes, bytes));

        if (opType == transOp) {
            continueTransfer(user, token, amount, safeParamTo, safeParamData, safeSignatures);
        }
    }

    // send tokens to the receipt in this chain.
    function continueTransfer(address user, address token, uint256 amount, address safeParamTo, bytes memory safeParamData, bytes memory safeSignatures) internal {
        if (amount > 0) {
            require(IERC20(token).transfer(user, amount), "failed to send tokens to safe");
        }

        bytes memory payload = abi.encodeWithSignature("execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes",
            safeParamTo, 0, safeParamData, 1, 0, 0, 0, address(0), address(0), safeSignatures);
        (bool success, bytes memory returnData) = user.call(payload);
        require(success);
    }
}