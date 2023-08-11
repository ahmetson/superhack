// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IMessageRecipient} from "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";
import {IInterchainSecurityModule, ISpecifiesInterchainSecurityModule} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";

contract DexNotifier is Ownable, IMessageRecipient, ISpecifiesInterchainSecurityModule {
    IInterchainSecurityModule public interchainSecurityModule;

    // The link from this blockchain to another address
    mapping(address => mapping(uint32 => address)) public superAccounts;
    mapping(address => uint256) public pools;
    mapping(address => mapping(uint32 => address)) public superTokens;

    bytes1 public addOp = 0x01;

    constructor(address mailbox) {
//        __Router_initialize(mailbox);
    }

//    add super accounts as a manager
//    add super tokens as a manager
//    deploy this script on SWT and on sepolia.


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

        // when DexNotifier on the destination handles it, it will send to proxyAddr(safe wallet) `amount` of `token`.
        // then it will `executeTransaction`
        bytes memory wrappedData = abi.encodePacked(addOp, safeWallet, tokenOnRemote, amount, safeParamTo, safeParamData, safeSignatures);

//        _dispatch(destination, wrappedData);
    }

    function setInterchainSecurityModule(address _ism) external onlyOwner {
        interchainSecurityModule = IInterchainSecurityModule(_ism);
    }

    // ============ On receive functions ============

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external override {
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