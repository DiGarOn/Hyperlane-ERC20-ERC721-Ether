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
      },
      optimism: {
        url: "https://optimism-rpc.publicnode.com",
        accounts: ["<youre private code here>"],
      },
      base: {
        url: "https://base.meowrpc.com",
        accounts: ["<youre private code here>"],
      },
      celo: {
        url: "https://1rpc.io/celo",
        accounts: ["<youre private code here>"],
      },
      avalanche: {
        url: "https://avalanche-c-chain-rpc.publicnode.com",
        accounts: ["<youre private code here>"],
      },
      polygon_zkEVM: {
        url: "https://1rpc.io/polygon/zkevm",
        accounts: ["<youre private code here>"],
      },
      bsc: {
        url: "https://1rpc.io/bnb",
        accounts: ["<youre private code here>"],
      },
      moonbeam: {
        url: "https://moonbeam-rpc.publicnode.com",
        accounts: ["<youre private code here>"],
      },
      gnosis: {
        url: "https://gnosis.drpc.org",
        accounts: ["<youre private code here>"],
      },
      arbitrum: {
        url: "https://arbitrum-one-rpc.publicnode.com",
        accounts: ["<youre private code here>"],
      },
      polygon: {
        url: "https://polygon-rpc.com",
        accounts: ["<youre private code here>"],
      },
      scroll: {
        url: "https://scroll.drpc.org",
        accounts: ["<youre private code here>"],
      },
      ethereum: {
        url: "https://ethereum-rpc.publicnode.com",
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
