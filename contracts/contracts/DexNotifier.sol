//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// For cross domain messages' origin
import { ICrossDomainMessenger } from
"@eth-optimism/contracts/libraries/bridge/ICrossDomainMessenger.sol";

/**
 * @title DexNotifier
 * @author MedetAhmetson
 * @notice SuperWallet's internal dex.
 */

contract DexNotifier {
    string public greeting;
    address public l1cdm; // cross-domain-messenger

    // The link from this blockchain to another address
    mapping(address => mapping(uint256 => address)) public supperAccounts;
    mapping(address => uint256) public pools;

    event SetGreeting(
        address sender,     // msg.sender
        address origin,     // tx.origin
        address xorigin,    // cross domain origin, if any
        address user,       // user address, if given
        string greeting     // The greeting
    );


    constructor(address crossChainManager) {
        l1cdm = crossChainManager;
        greeting = "not called yet";
    }

    /**
     * @notice Transfer token from one chain to another using the dex pool.
     * @param chainId the target chain id where the transaction should be executed
     * @param amount to transfer from this blockchain
     * @param token the token type
     */
    function transferToken(
        uint256 chainId, 
        uint256 amount, 
        address token,
        address to,
        bytes calldata data,
     ) external {
        pools[token] = amount;
        address proxyAddr = supperAccounts[msg.sender][chainId];

        
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting, address _user) public {
        greeting = _greeting;
        emit SetGreeting(msg.sender, tx.origin, getXorig(), _user, _greeting);
    }


    // Get the cross domain origin, if any
    function getXorig() private view returns (address) {
        // Get the cross domain messenger's address each time.
        // This is less resource intensive than writing to storage.
        address cdmAddr = address(0);

        // Goerli
        if (block.chainid == 11155111)
            cdmAddr = l1cdm;
        else if (block.chainid == 42069)
            cdmAddr = 0x4200000000000000000000000000000000000007;
        else revert("unsupported chain id");

        // If this isn't a cross domain message
        if (msg.sender != cdmAddr)
            return address(0);

        // If it is a cross domain message, find out where it is from
        return ICrossDomainMessenger(cdmAddr).xDomainMessageSender();
    }    // getXorig()
}   // contract Greeter