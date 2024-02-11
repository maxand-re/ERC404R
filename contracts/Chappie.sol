//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./lib/ERC404.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Chappie is Ownable, ERC404 {
    string public baseTokenURI;

    constructor(
        address _owner
    ) ERC404("Chappie", "CHP", 18) Ownable(_owner) {
        _mintERC20(_owner, 4004 * units, false);
        _setWhitelist(_owner, true);
    }

    function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return string.concat(baseTokenURI, Strings.toString(id));
    }

    function setWhitelist(address account_, bool value_) external onlyOwner {
        _setWhitelist(account_, value_);
    }
}