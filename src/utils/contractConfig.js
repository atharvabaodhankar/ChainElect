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
    contractAddress: "0xdbbFB787ee25aC1d3E85f5a1CE7556195dbA6286",
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