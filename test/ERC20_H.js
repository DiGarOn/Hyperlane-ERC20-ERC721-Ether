const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("ERC20_H"); //Replace with name of your smart contract

// MailBoxes:
  const optimism = "0xd4C1905BB1D26BC93DAC913e13CaCC278CdCC80D"
  const base = "0xeA87ae93Fa0019a82A727bfd3eBd1cFCa8f64f1D"
  const celo = "0x50da3B3907A08a24fe4999F4Dcf337E8dC7954bb"
  const avalanche = "0xFf06aFcaABaDDd1fb08371f9ccA15D73D51FeBD6"
  const polygon_zkEVM = "0x3a464f746D23Ab22155710f44dB16dcA53e0775E"
  const bsc = "0x2971b9Aec44bE4eb673DF1B88cDB57b96eefe8a4"
  const moonbeam = "0x094d03E751f49908080EFf000Dd6FD177fd44CC3"
  const gnosis = "0xaD09d78f4c6b9dA2Ae82b1D34107802d380Bb74f"
  const arbitrum = "0x979Ca5202784112f4738403dBec5D0F3B9daabB9"
  const polygon = "0x5d934f4e2f797775e53561bB72aca21ba36B96BB"
  const scroll = "0x2f2aFaE1139Ce54feFC03593FeE8AB2aDF4a85A7"
  const ethereum = "0xc005dc82818d67AF737725bD4bf75435d065D239"

// Деплой: Параметры: (название токена, символ токена, первонаальный минт владельцу, адрес MailBox для нужной сети)
  const contract = await Token.deploy("token_", "ST", 1000000000000000n, optimism); // или любой дрйго адрес из указанных выше

  // const contract = await Token.deploy("token_", "ST", 1000000000000000n, "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766"); // sepolia
  // const contract = await Token.deploy("token_", "ST", 1000000000000000n, "0xF9F6F5646F478d5ab4e20B0F910C92F1CCC9Cc6D"); // bnbtest
  // const contract = await Token.attach("0x1c0e9E0C70d7F2F9d3c4Ee4FcDb8b1E53BEa1704"); // sepolia
  // const contract = Token.attach("0x0Fe0Cef42a6023ed8b06985bcf9385d2AF0F56e0"); // bnbtest
  console.log("Contract address:", contract.target);

// Пример вызова: (2й параметр - адрес этого токена в нужной сети, в данной ситуации в 97)
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
