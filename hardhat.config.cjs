require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.28",
};
