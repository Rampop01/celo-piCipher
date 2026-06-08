require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: '../.env.local' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
    },
  },
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    celo: {
      url: "https://rpc.ankr.com/celo",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.CELOSCAN_API_KEY || "YOUR_CELOSCAN_API_KEY",
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api",
          browserURL: "https://celoscan.io/",
        },
      },
    ],
  },
  sourcify: {
    enabled: true
  }
};
