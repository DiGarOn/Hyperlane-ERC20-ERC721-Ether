require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.24",
  networks: {
    hardhat: {
        forking: {
            // url: "https://rpc.ankr.com/eth",
            // blockNumber: 19376367,
            url: "https://ethereum-sepolia-rpc.publicnode.com"
        },
        // gasPrice: 95904110618
      },
      sepolia: {
        url: "https://ethereum-sepolia-rpc.publicnode.com",
        accounts: ["<youre private code here>"],
      },
      bnbtest: {
        url: "https://bsc-testnet-rpc.publicnode.com",
        accounts: ["<youre private code here>"],
      }
    },
    solidity: {
      compilers: [
          {
              version: '0.8.24',
              settings: {
                  optimizer: {
                      enabled: true,
                      runs: 1000000,
                  },
              },
          },
      ],
  }
};
