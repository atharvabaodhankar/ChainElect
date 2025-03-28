/**
 * Contract Configuration for ChainElect
 * This file centralizes all blockchain connection settings
 */

const config = {
  // Polygon Amoy Testnet Configuration
  polygonAmoy: {
    networkId: 80002,
    chainName: "Polygon Amoy Testnet",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    contractAddress: "0x1b2603c6AB4e4328b1F0143e3B1721bB582Ce64b",
    blockExplorer: "https://www.oklink.com/amoy",
    currencySymbol: "MATIC",
    currencyName: "Polygon",
    chainHexId: "0x13882", // Hex of 80002
    // Transaction configuration to avoid RPC errors
    transactionConfig: {
      gasPrice: '40000000000', // 40 gwei
      gasLimit: 3000000,
      maxPriorityFeePerGas: '35000000000', // 35 gwei
      maxFeePerGas: '50000000000', // 50 gwei
    }
  }
};

export default config; 