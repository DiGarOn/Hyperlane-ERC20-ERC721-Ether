const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("ERC20_H"); //Replace with name of your smart contract

  // const contract = await Token.deploy("token_", "ST", 1000000000000000n, "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766"); // sepolia
  // const contract = await Token.deploy("token_", "ST", 1000000000000000n, "0xF9F6F5646F478d5ab4e20B0F910C92F1CCC9Cc6D"); // bnbtest
  // const contract = await Token.attach("0x1c0e9E0C70d7F2F9d3c4Ee4FcDb8b1E53BEa1704"); // sepolia
  const contract = Token.attach("0x0Fe0Cef42a6023ed8b06985bcf9385d2AF0F56e0"); // bnbtest
  console.log("Contract address:", contract.target);
  // await contract.connect(deployer).remoteTransfer(97,"0x0Fe0Cef42a6023ed8b06985bcf9385d2AF0F56e0", 1000, {value: ethers.parseEther("0.005")});
  // await contract.connect(deployer).remoteTransfer(11155111,"0x1c0e9E0C70d7F2F9d3c4Ee4FcDb8b1E53BEa1704", 1000, {value: ethers.parseEther("0.005")});
  console.log(await contract.connect(deployer).balanceOf(deployer.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
