const { ethers } = require("hardhat");

async function main() {
  const provider = ethers.getDefaultProvider();
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("ETH_H"); //Replace with name of your smart contract

//   const contract = await Token.deploy("0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766", {value: ethers.parseEther("0.005")}); // sepolia
//   const contract = await Token.deploy("0xF9F6F5646F478d5ab4e20B0F910C92F1CCC9Cc6D", {value: ethers.parseEther("0.005")}); // bnbtest
//   const contract = await Token.attach("0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC"); // sepolia
  const contract = Token.attach("0xca191222Ae8A6cc19D245E4829501D39aa9Cc228"); // bnbtest
  console.log("Contract address:", contract.target);
//   await contract.connect(deployer).remoteTransfer(97,"0xca191222Ae8A6cc19D245E4829501D39aa9Cc228", 1000, {value: ethers.parseEther("0.005")}); // to bnb
  await contract.connect(deployer).remoteTransfer(11155111,"0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC", 1000, 0, 0, "0", {value: ethers.parseEther("0.005")}); // sepolia

  const maticToEth = 222522764413594n;
  const hash = ethers.utils.solidityKeccak256(
    ["uint256"],
    [maticToEth]
  );

  const messageHashBin = ethers.utils.arrayify(hash);
  const signature = await deployer.signMessage(messageHashBin);
  await contract.connect(deployer).remoteTransfer(137,"0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC", 1000, maticToEth, signature, {value: ethers.parseEther("0.005")}); // sepolia

  console.log(await provider.getBalance("0x095454F216EC9485da86D49aDffAcFD0Fa3e5BE5"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
