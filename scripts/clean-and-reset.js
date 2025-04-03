// Script to completely clean all candidates and add new Indian names
const hre = require("hardhat");

async function main() {
  console.log("Completely resetting election with new Indian candidates...");
  
  // Get the contract
  const contractAddress = "0x7040554cB52b34Dcf8836ddD503F318b1dd67eE4";
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const contract = MyContract.attach(contractAddress);
  
  // Get the deployer (owner) address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Contract owner:", deployer.address);
  
  // First, reset the voting state
  console.log("Resetting voting state...");
  await contract.resetVotingState();
  console.log("Voting state reset successfully");
  
  // Get current number of candidates
  let candidatesCount = await contract.getCandidatesCount();
  console.log(`Current candidate count: ${candidatesCount}`);
  
  // Since we can't easily delete all candidates at once in the current contract,
  // we'll need to re-deploy the contract to start fresh
  console.log("Deploying a new clean contract...");
  
  // Deploy a new contract
  const MyContractFactory = await hre.ethers.getContractFactory("MyContract");
  const newContract = await MyContractFactory.deploy();
  await newContract.waitForDeployment();
  
  const newContractAddress = await newContract.getAddress();
  console.log(`New contract deployed at: ${newContractAddress}`);
  
  // List of Indian candidate names
  const indianCandidates = [
    "Rahul Sharma",
    "Priya Patel",
    "Vikram Singh",
    "Ananya Mehta",
    "Arjun Kapoor"
  ];
  
  // Add the new candidates to the clean contract
  console.log("Adding Indian candidates to new contract...");
  for (const candidateName of indianCandidates) {
    await newContract.addCandidate(candidateName);
    console.log(`Added candidate: ${candidateName}`);
  }
  
  // Add the existing admins to the new contract
  const adminAddresses = [
    "0x4731e70230076C72eC8c208bBDb2062AFc865D5B",
    "0xFb4a87E97aD30f72ce69E5b8D8fBA38d2452FE52",
    "0x1b2603c6AB4e4328b1F0143e3B1721bB582Ce64b",
    "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097"
  ];
  
  console.log("Adding admins to new contract...");
  for (const adminAddress of adminAddresses) {
    try {
      await newContract.addAdmin(adminAddress);
      console.log(`Added admin: ${adminAddress}`);
    } catch (error) {
      console.log(`Error adding admin ${adminAddress}: ${error.message}`);
    }
  }
  
  // Verify final state
  candidatesCount = await newContract.getCandidatesCount();
  console.log(`New contract candidates count: ${candidatesCount}`);
  
  console.log("\n!!! IMPORTANT ACTION REQUIRED !!!");
  console.log("-----------------------------------------");
  console.log(`You MUST update the contract address in src/utils/contractConfig.js`);
  console.log(`New contract address: ${newContractAddress}`);
  console.log("-----------------------------------------");
  
  return newContractAddress;
}

// Execute the reset
main()
  .then((newAddress) => {
    console.log("Clean reset completed successfully!");
    console.log(`Please update your contract address to: ${newAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during reset:", error);
    process.exit(1);
  }); 