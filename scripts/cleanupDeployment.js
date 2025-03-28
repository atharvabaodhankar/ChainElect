const fs = require('fs');
const path = require('path');

/**
 * This script cleans up sensitive information after deployment
 */
async function main() {
  try {
    // Delete the private key file
    const privateKeyPath = path.join(__dirname, '../.tmp/privateKey.js');
    if (fs.existsSync(privateKeyPath)) {
      fs.unlinkSync(privateKeyPath);
      console.log('✅ Private key file deleted successfully');
    }
    
    // Write contract config to be updated in frontend
    const configPath = path.join(__dirname, '../deployment-info.txt');
    const contractConfig = `
    Polygon Amoy Deployment Information
    ==================================
    Contract Address: 0x1b2603c6AB4e4328b1F0143e3B1721bB582Ce64b
    Network: Polygon Amoy Testnet (Chain ID: 80002)
    RPC URL: https://rpc-amoy.polygon.technology
    Block Explorer: https://www.oklink.com/amoy
    
    Make sure to update contractConfig.js in the frontend to use this address.
    `;
    
    fs.writeFileSync(configPath, contractConfig);
    console.log('✅ Deployment information saved to deployment-info.txt');
    
    console.log('\n🚀 Deployment cleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 