// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * 🌐 Website: https://dogen.live/
 * 🐦 Twitter: https://twitter.com/DOGEN_DEGEN
 * 💬 Telegram: https://t.me/dogen_degenchain
 */
contract Dogen is ERC20, Ownable, ERC20Permit {

  uint internal constant PRECISION = 1000;

  mapping(address => bool) public isExcludedFromLimit;

  bool public isLimitEnabled = false;
  uint public limitAmount = 20;

  event SetExcludedFromLimit(address who, bool isExcludedFromFee);

  constructor() ERC20("DOGEN", "DOGEN") ERC20Permit("DOGEN") {
    isExcludedFromLimit[msg.sender] = true;
    emit SetExcludedFromLimit(msg.sender, true);

    _mint(msg.sender, 10_000_000 * 10 ** decimals());
  }

  function enableLimit(bool _value, uint _to) external onlyOwner {
    isLimitEnabled = _value;
    limitAmount = _to;
  }

  function setIsExcludedFromLimit(address _who, bool _value) external onlyOwner {
    isExcludedFromLimit[_who] = _value;
    emit SetExcludedFromLimit(_who, _value);
  }

  function _transfer(address from, address to, uint256 amount) internal override {
    if (isLimitEnabled && !isExcludedFromLimit[to]) {
      require((balanceOf(to) +  amount) <= (totalSupply() * limitAmount / PRECISION), "Limit exceeded");
    }

    super._transfer(from, to, amount);
  }
}
