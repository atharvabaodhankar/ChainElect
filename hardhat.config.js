require("@nomicfoundation/hardhat-toolbox");

// Read the private key from environment variable for security
const PRIVATE_KEY = "fc137c80abb76afd118028b1ea489501f0f13f493966fc31e937ad18550a5870";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 80002,
      gasPrice: 35000000000, // 35 gwei
      maxPriorityFeePerGas: 30000000000, // 30 gwei
    }
  }
};
