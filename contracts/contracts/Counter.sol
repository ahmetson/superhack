// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Counter {
    uint public counter;

    event Count(address indexed player, uint count);

    constructor() {}

    function inc() public {
        counter++;

        emit Count(msg.sender, counter);
    }
}
