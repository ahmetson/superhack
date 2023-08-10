//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

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

}   // contract Greeter