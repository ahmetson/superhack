// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @custom:security-contact milayter@gmail.com
contract SuperWalletTest is ERC20, ERC20Burnable {
    constructor() ERC20("SuperWalletTest", "SWT") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }
}