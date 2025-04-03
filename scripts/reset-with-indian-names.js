// Script to reset the election and add Indian candidate names
const hre = require("hardhat");

async function main() {
  console.log("Resetting election and adding Indian candidates...");
  
  // Get the contract
  const contractAddress = "0x7040554cB52b34Dcf8836ddD503F318b1dd67eE4";
  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const contract = MyContract.attach(contractAddress);
  
  // Get the deployer (owner) address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Contract owner:", deployer.address);
  
  // Reset the voting state first to clear everything
  console.log("Resetting voting state...");
  await contract.resetVotingState();
  console.log("Voting state reset successfully");
  
  // List of Indian candidate names
  const indianCandidates = [
    "Rahul Sharma",
    "Priya Patel",
    "Vikram Singh",
    "Ananya Mehta",
    "Arjun Kapoor"
  ];
  
  // Add the new candidates
  console.log("Adding Indian candidates...");
  for (const candidateName of indianCandidates) {
    await contract.addCandidate(candidateName);
    console.log(`Added candidate: ${candidateName}`);
  }
  
  // Verify that the candidates were added
  const candidatesCount = await contract.getCandidatesCount();
  console.log(`Total candidates count: ${candidatesCount}`);
  
  console.log("\nElection reset completed!");
  console.log("-----------------------------------------");
  console.log("The election now has new Indian candidate names");
  console.log("Go to the Admin page to start the election");
  console.log("-----------------------------------------");
}

// Execute the reset
main()
  .then(() => {
    console.log("Reset completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during reset:", error);
    process.exit(1);
  }); 