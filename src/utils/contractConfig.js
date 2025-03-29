/**
 * Contract Configuration for ChainElect
 * This file centralizes all blockchain connection settings
 */

const config = {
  // Polygon Amoy Testnet Configuration
  polygonAmoy: {
    chainId: 80002, // Decimal format
    chainHexId: '0x13882', // Hex format with 0x prefix needed for MetaMask
    chainName: 'Polygon Amoy Testnet',
    currencyName: 'MATIC',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://polygon-amoy.infura.io/v3/f8512e13316b4cc3a525b05ecd142444',
    blockExplorer: 'https://www.oklink.com/amoy',
    contractAddress: process.env.VITE_CONTRACT_ADDRESS || '0xDb051b2df4109aD75a9436E99E5D89b94FC4f634',
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