// Script to initialize the newly deployed contract
const hre = require("hardhat");

async function main() {
  console.log("Initializing contract on Polygon Amoy...");
  
  // Get the contract
  const contractAddress = "0x7040554cB52b34Dcf8836ddD503F318b1dd67eE4";
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const contract = MyContract.attach(contractAddress);
  
  // Get the deployer (owner) address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Contract owner:", deployer.address);
  
  // List of admin addresses to add
  const adminAddresses = [
    "0xFb4a87E97aD30f72ce69E5b8D8fBA38d2452FE52",
    "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097"
  ];
  
  // Add admins
  console.log("Adding admins...");
  for (const adminAddress of adminAddresses) {
    try {
      // Check if already admin
      const isAlreadyAdmin = await contract.isAdmin(adminAddress);
      if (!isAlreadyAdmin) {
        await contract.addAdmin(adminAddress);
        console.log(`Added admin: ${adminAddress}`);
      } else {
        console.log(`Address ${adminAddress} is already an admin`);
      }
    } catch (error) {
      console.error(`Error adding admin ${adminAddress}:`, error.message);
    }
  }
  
  // Add some initial candidates
  console.log("Adding initial candidates...");
  await contract.addCandidate("Alice Johnson");
  console.log("Added candidate: Alice Johnson");
  
  await contract.addCandidate("Bob Smith");
  console.log("Added candidate: Bob Smith");
  
  await contract.addCandidate("Charlie Brown");
  console.log("Added candidate: Charlie Brown");
  
  // Verify that the candidates were added
  const candidatesCount = await contract.getCandidatesCount();
  console.log(`Candidates count: ${candidatesCount}`);
  
  // Check if the deployer is already an admin
  const isAdmin = await contract.isAdmin(deployer.address);
  console.log(`Is deployer admin: ${isAdmin}`);
  
  console.log("\nContract initialization completed!");
  console.log("-----------------------------------------");
  console.log("Your contract is now ready to use with the new features!");
  console.log("-----------------------------------------");
}

// Execute the initialization
main()
  .then(() => {
    console.log("Initialization completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during initialization:", error);
    process.exit(1);
  }); 