// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import { IMailbox } from "../interfaces/IMailbox.sol";

import "hardhat/console.sol";

contract ERC20_H is ERC20 {
    IMailbox mailBox;

    constructor (string memory name_, string memory symbol_, uint256 init_supply, address mailBox_) ERC20( name_, symbol_ ) {
        _mint(msg.sender, init_supply);
        mailBox = IMailbox(mailBox_);
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function uint_to_bytes(uint256 a, address b) internal view returns (bytes memory) {
        return abi.encode(a, b);
    }

    function bytes_to_uint(bytes memory a) internal view returns (uint256, address) {
        (uint256 b, address c ) = abi.decode(a, (uint256, address));
        return (b, c);
    }

    function remoteTransfer(uint32 destination, address recipient_, uint256 amount) external payable {
        require(balanceOf(msg.sender) >= amount, "Not enough balance of token");
        bytes32 _recipient = addressToBytes32(recipient_);
        bytes memory body = uint_to_bytes(amount, msg.sender);
        uint256 fee = mailBox.quoteDispatch(destination, _recipient, body);
        console.log("fee is: ", fee);
        require(msg.value >= fee);
        _burn(msg.sender, amount);
        mailBox.dispatch{value: fee}(destination, _recipient, body);
        payable(msg.sender).transfer(address(this).balance);
    }

    function handle(
        // Domain of origin chain
        uint32 origin,
        // Address of sender on origin chain
        bytes32 sender,
        // Raw bytes content of message body
        bytes calldata body
    ) external {
        require(address(mailBox) == msg.sender);
        (uint256 amount, address recipient) = bytes_to_uint(body);
        _mint(recipient, amount);
    }
}