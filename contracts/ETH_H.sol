// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IMailbox } from "../interfaces/IMailbox.sol";

import "hardhat/console.sol";

contract ETH_H {
    IMailbox public mailBox;
    uint32 public chainId;
    address public owner;

    event Transfered(uint256 amount);

    constructor (address mailBox_, uint32 chainId_) payable {
        mailBox = IMailbox(mailBox_);
        chainId = chainId_;
        owner = msg.sender;
    }

    receive() external payable {}

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function uint_to_bytes(uint256 a, address b) internal pure returns (bytes memory) {
        return abi.encode(a, b);
    }

    function bytes_to_uint(bytes memory a) internal pure returns (uint256, address) {
        (uint256 b, address c ) = abi.decode(a, (uint256, address));
        return (b, c);
    }

    function calcFee(uint32 destination, address recipient_, uint256 amount) external view returns (uint256) {
        bytes32 _recipient = addressToBytes32(recipient_);
        bytes memory body = uint_to_bytes(amount, msg.sender);
        uint256 fee = mailBox.quoteDispatch(destination, _recipient, body);
        return fee;
    }

    function withPrefix(bytes32 _hash) private pure returns(bytes32) {
        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                _hash
            )
        );
    }

    function recoverSigner(bytes32 message, bytes memory signature) private pure returns(address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory signature) private pure returns(uint8 v, bytes32 r, bytes32 s) {
        require(signature.length == 65);

        assembly {
            r := mload(add(signature, 32))

            s := mload(add(signature, 64))

            v := byte(0, mload(add(signature, 96)))
        }

        return(v, r, s);
    }

    function remoteTransfer(uint32 destination, address recipient_, uint256 amount, uint256 maticToEth, bytes memory signature) external payable {
        uint256 amount_to_receive;
        if( destination == 137 ||  chainId == 137) {
            bytes32 message = withPrefix(keccak256(abi.encodePacked(
                maticToEth
            )));
            require(
                recoverSigner(message, signature) == owner, "invalid sig!"
            );

            if( destination != 137 ) { // send from poligon
                amount_to_receive = amount * maticToEth;
            } else { // send to poligon
                amount_to_receive = amount * 10**18 / maticToEth;
            }
        } else {
            amount_to_receive = amount;
        }

        bytes32 _recipient = addressToBytes32(recipient_);
        bytes memory body = uint_to_bytes(amount_to_receive, msg.sender);
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