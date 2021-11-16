require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
const config = require('dotenv').config;

config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.3"
      },
      {
        version: "0.6.12"
      }
    ]
  },
  paths: {
    artifacts: './build'
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    fuji: {
      chainId: 43113,
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    apiURL: "https://api-testnet.snowtrace.io/api",
    browserURL: "https://testnet.snowtrace.io/"
  },
};
