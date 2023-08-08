//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// For cross domain messages' origin
import { ICrossDomainMessenger } from
"@eth-optimism/contracts/libraries/bridge/ICrossDomainMessenger.sol";

contract Greeter {
    string public greeting;
    address public l1cdm; // cross-domain-messenger

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