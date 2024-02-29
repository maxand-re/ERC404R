// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlastAI is ERC20, ERC20Burnable, Ownable {
  constructor(address initialOwner)
  ERC20("BlastAI", "BAI")
  Ownable(initialOwner)
  {
    _mint(msg.sender, 21000000 * 10 ** decimals());
  }
}
