// Deployment script for Polygon Amoy
const hre = require("hardhat");

async function main() {
  console.log("Deploying contract to Polygon Amoy...");
  
  // Get the contract factory
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  
  // Deploy the contract
  const myContract = await MyContract.deploy();
  
  // Wait for deployment to finish
  await myContract.waitForDeployment();
  
  // Get the contract address
  const address = await myContract.getAddress();
  console.log("MyContract deployed to:", address);
  
  // Get the deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployed by:", deployer.address);
  
  // Let's add a confirmation message for the user
  console.log("\n-----------------------------------------");
  console.log("IMPORTANT: Update your contract address in src/utils/contractConfig.js");
  console.log(`New contract address: ${address}`);
  console.log("-----------------------------------------\n");
  
  return address;
}

// Execute the deployment
main()
  .then((address) => {
    console.log("Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  }); 