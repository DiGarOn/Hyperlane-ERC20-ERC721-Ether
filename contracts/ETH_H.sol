// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IMailbox } from "../interfaces/IMailbox.sol";

import "hardhat/console.sol";

contract ETH_H {
    IMailbox mailBox;

    event Transfered(uint256 amount);

    constructor (address mailBox_) payable {
        mailBox = IMailbox(mailBox_);
    }

    receive() external payable {}

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

    function calcFee(uint32 destination, address recipient_, uint256 amount) external view returns (uint256) {
        bytes32 _recipient = addressToBytes32(recipient_);
        bytes memory body = uint_to_bytes(amount, msg.sender);
        uint256 fee = mailBox.quoteDispatch(destination, _recipient, body);
        return fee;
    }

    function remoteTransfer(uint32 destination, address recipient_, uint256 amount) external payable {
        bytes32 _recipient = addressToBytes32(recipient_);
        bytes memory body = uint_to_bytes(amount, msg.sender);
        uint256 fee = mailBox.quoteDispatch(destination, _recipient, body);
        console.log("fee is: ", fee);
        require(msg.value >= fee + amount);
        emit Transfered(amount);
        mailBox.dispatch{value: fee}(destination, _recipient, body);
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
        require(address(this).balance >= amount);
        payable(recipient).transfer(amount);
    }
}