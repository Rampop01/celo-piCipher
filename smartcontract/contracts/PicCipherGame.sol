// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PicCipherGame {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
}
