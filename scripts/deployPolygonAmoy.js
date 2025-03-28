const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MyContract to Polygon Amoy...");

  // Get the contract factory
  const MyContract = await ethers.getContractFactory("MyContract");
  
  // Deploy the contract
  const myContract = await MyContract.deploy();
  await myContract.waitForDeployment();
  
  const contractAddress = await myContract.getAddress();
  console.log(`MyContract deployed to: ${contractAddress}`);
  
  // Add the deployer as admin
  const [deployer] = await ethers.getSigners();
  console.log(`Transaction sent from: ${deployer.address}`);
  
  // Add initial candidates for testing
  console.log("Adding initial candidates...");
  await myContract.addCandidate("Alice Johnson");
  await myContract.addCandidate("Bob Smith");
  await myContract.addCandidate("Carol White");
  
  console.log("Initial setup complete");
  console.log("Contract address:", contractAddress);
  console.log("Owner:", deployer.address);
  
  // IMPORTANT: Save this information for frontend integration
  console.log("\nIMPORTANT: Update your frontend configuration with the contract address");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 