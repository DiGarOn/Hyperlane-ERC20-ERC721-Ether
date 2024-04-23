// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IMailbox } from "../interfaces/IMailbox.sol";
import "./TransferHelper.sol";
import "hardhat/console.sol";

contract ERC721_H is ERC721 {
    IMailbox mailBox;
    address private owner;

    uint256 public maxTotalSupply;
    uint256 public totalSupply;
    uint256 public nftPrice;

    mapping( address => uint256 ) private whitelist;

    error UnauthorizedAccount(address _msgSender);
    error InsufficientFunds();

    modifier onlyOwner() {
        if (owner != msg.sender) {
            revert UnauthorizedAccount(msg.sender);
        }
        _;
    }

    constructor (string memory name_, string memory symbol_, uint256 _maxTotalSupply, address mailBox_) ERC721( name_, symbol_ ) {
        maxTotalSupply = _maxTotalSupply;
        totalSupply = maxTotalSupply - 100000;
        mailBox = IMailbox(mailBox_);
        owner = msg.sender;
    }

    function mint() external payable {
        require(totalSupply + 1 <= maxTotalSupply, "total supply overflow");

        if(msg.value != nftPrice) {
            revert InsufficientFunds();
        }

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function updateNftPrice(uint256 price) external onlyOwner {
        nftPrice = price;
    }

    function withdrawETH() external onlyOwner {
        TransferHelper.safeTransferETH(msg.sender, address(this).balance);
    }

    function addWhitelisted(address[] memory addresses_) external onlyOwner {
        for( uint i = 0; i < addresses_.length; i++ ) {
            whitelist[addresses_[i]] = 1;
        }
    }

    function removeWhitelisted(address[] memory addresses_) external onlyOwner {
        for( uint i = 0; i < addresses_.length; i++ ) {
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

    function remoteTransfer(uint32 destination, address recipient_, uint256 tokenId) external payable {
        require(_ownerOf(tokenId) == msg.sender, "Not owner");
        bytes32 _recipient = addressToBytes32(recipient_);
        bytes memory body = uint_to_bytes(tokenId, msg.sender);
        uint256 fee = mailBox.quoteDispatch(destination, _recipient, body);
        console.log("fee is: ", fee);
        require(msg.value >= fee);
        _burn(tokenId);
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
        (uint256 tokenId, address recipient) = bytes_to_uint(body);
        _mint(recipient, tokenId);
    }
}
