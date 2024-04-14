const { ethers } = require("hardhat");

async function main() {
  const provider = ethers.getDefaultProvider();
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("ETH_H"); //Replace with name of your smart contract

// MailBoxes:
  const optimism = "0xd4C1905BB1D26BC93DAC913e13CaCC278CdCC80D"
  const base = "0xeA87ae93Fa0019a82A727bfd3eBd1cFCa8f64f1D"
  const polygon = "0x5d934f4e2f797775e53561bB72aca21ba36B96BB"
  const scroll = "0x2f2aFaE1139Ce54feFC03593FeE8AB2aDF4a85A7"

// Деплой: Параметры: (адрес MailBox для нужной сети, id сети)
  const contract = await Token.deploy(polygon, 137, {value: ethers.parseEther("0.005")}); // sepolia
//   const contract = await Token.deploy("0xF9F6F5646F478d5ab4e20B0F910C92F1CCC9Cc6D", {value: ethers.parseEther("0.005")}); // bnbtest
//   const contract = await Token.attach("0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC"); // sepolia
//   const contract = Token.attach("0xca191222Ae8A6cc19D245E4829501D39aa9Cc228"); // bnbtest
  console.log("Contract address:", contract.target);
//   await contract.connect(deployer).remoteTransfer(97,"0xca191222Ae8A6cc19D245E4829501D39aa9Cc228", 1000, {value: ethers.parseEther("0.005")}); // to bnb

// пример вызова без работы с полигоном. Параметры: id сети, адрес контракта в нужной сети, количество для перевода, любые значнения, я поставил 0
  await contract.connect(deployer).remoteTransfer(11155111,"0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC", 1000, 0, 0, "0", {value: ethers.parseEther("0.005")}); // sepolia

// пример создания подписи (она может быть выложена на сайт вместе с соотношением matic/eth)
  const maticToEth = 222522764413594n; // соотношение
  const hash = ethers.utils.solidityKeccak256(
    ["uint256"],
    [maticToEth]
  );

  const messageHashBin = ethers.utils.arrayify(hash);
  const signature = await deployer.signMessage(messageHashBin); // важно, что подпись происходит ончейн!

// пример вызова функции при работе с полигоном (отправка с или на полигон)
// параметры: id сети, адрес контракта в сети, объем, соотношение, подпись
  await contract.connect(deployer).remoteTransfer(137,"0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC", 1000, maticToEth, signature, {value: ethers.parseEther("0.005")}); // sepolia

  console.log(await provider.getBalance("0x095454F216EC9485da86D49aDffAcFD0Fa3e5BE5"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
