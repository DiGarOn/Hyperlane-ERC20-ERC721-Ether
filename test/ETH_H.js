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

// chainIds:
    const optimism_chainId = 10
    const base_chainId = 8453
    const polygon_chainId = 137
    const scroll_chainId = 534352

// Деплой: Параметры: (адрес MailBox для нужной сети, id сети)
  const contract = await Token.deploy(polygon, polygon_chainId, {value: ethers.parseEther("0.005")});

// после деплоя для работы с контрактом
  // const contract = await Token.attach("<token address>");

  console.log("Contract address:", contract.target);

// добавляем адреса токенов в whitelist для безопасного взаимодействия
  // await contract.connect(deployer).addWhitelisted(["<contract address>"]);

//   // пример вызова без работы с полигоном. Параметры: id сети, адрес контракта в нужной сети, количество для перевода, любые значнения, я поставил 0
//   await contract.connect(deployer).remoteTransfer(scroll_chainId,"0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC", 1000, 0, "0", {value: ethers.parseEther("0.005")}); // sepolia

// // пример создания подписи (она может быть выложена на сайт вместе с соотношением matic/eth)
  const maticToEth = 222522764413594n; // соотношение
  const hash = ethers.solidityPackedKeccak256(
    ["uint256"],
    [maticToEth]
  );

  const messageHashBin = ethers.getBytes(hash);
  const signature = await deployer.signMessage(messageHashBin); // важно, что подпись происходит ончейн!
  console.log(signature)
// // пример вызова функции при работе с полигоном (отправка с или на полигон)
// // параметры: id сети, адрес контракта в сети, объем, соотношение, подпись
  await contract.connect(deployer).remoteTransfer(polygon_chainId,"0xBD6cCCBb8E4D6457e58953D1b3f1aA4D8f2522cC", 1000, maticToEth, signature, {value: ethers.parseEther("0.005")}); // sepolia

//   console.log(await provider.getBalance("0x095454F216EC9485da86D49aDffAcFD0Fa3e5BE5"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
