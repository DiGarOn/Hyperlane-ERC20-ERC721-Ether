const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("ERC721_H"); //Replace with name of your smart contract

  // const contract = await Token.deploy("token_", "ST", 1000, "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766"); // sepolia
  // const contract = await Token.deploy("token_", "ST", 1000000000000000n, "0xF9F6F5646F478d5ab4e20B0F910C92F1CCC9Cc6D"); // bnbtest
  // const contract = await Token.attach("0x2Cd5eb222852936237A5716f7474B7acA9C2F72B"); // sepolia
  const contract = Token.attach("0xC05FA16AeF1f71a95939F120f4dC1E1581858300"); // bnbtest
  console.log("Contract address:", contract.target);
  // await contract.connect(deployer).remoteTransfer(97,"0xC05FA16AeF1f71a95939F120f4dC1E1581858300", 1000, {value: ethers.parseEther("0.005")});
  console.log(await contract.connect(deployer).balanceOf(deployer.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
