// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IMailbox } from "../interfaces/IMailbox.sol";
import "./TransferHelper.sol";
import "hardhat/console.sol";

contract ERC20_H is ERC20 {
    IMailbox mailBox;
    address private owner;

    uint256 public tokenPrice;
    uint256 public maxTotalSupply;

    mapping( address => uint256 ) private whitelist;

    error UnauthorizedAccount(address _msgSender);
    error InsufficientFundsForTheClaim();
    error MaxTotalSupplyExceeded();

    modifier onlyOwner() {
        if (owner != msg.sender) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    constructor (string memory name_, string memory symbol_, uint256 _maxTotalSupply, address mailBox_) ERC20( name_, symbol_ ) {
        maxTotalSupply = _maxTotalSupply;
        mailBox = IMailbox(mailBox_);
        owner = msg.sender;
    }

    function _claim(uint256 amount) external payable {
        if(_totalSupply + amount > maxTotalSupply) {
            revert MaxTotalSupplyExceeded();
        }

        uint256 value = amount * tokenPrice;

        if(msg.value != value) {
            revert InsufficientFundsForTheClaim();
        }

        _mint(msg.sender, amount);
    }

    function withdrawETH() external onlyOwner {
        TransferHelper.safeTransferETH(msg.sender, address(this).balance);
    }

    function addWhitelisted(address[] memory addresses_) external onlyOwner {
        for( uint i; i < addresses_.length; i++ ) {
            whitelist[addresses_[i]] = 1;
        }
    }

    function removeWhitelisted(address[] memory addresses_) external onlyOwner {
        for( uint i; i < addresses_.length; i++ ) {
            whitelist[addresses_[i]] = 0;
        }
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _addr) internal pure returns (address) {
        return address(uint160(uint256(_addr)));
    }

    function uint_to_bytes(uint256 a, address b) internal pure returns (bytes memory) {
        return abi.encode(a, b);
    }

    function bytes_to_uint(bytes memory a) internal pure returns (uint256, address) {
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
        if(address(this).balance > 0) {
            payable(msg.sender).transfer(address(this).balance);
        }
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
        address _sender = bytes32ToAddress(sender);
        require(whitelist[_sender] == 1, "Not whitelisted");
        (uint256 amount, address recipient) = bytes_to_uint(body);
        _mint(recipient, amount);
    }

    function changeTokenPrice(uint256 _tokenPrice) external onlyOwner {
        tokenPrice = _tokenPrice;
    }
}
