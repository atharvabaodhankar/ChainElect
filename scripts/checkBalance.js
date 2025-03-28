const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Checking balance for address:", deployer.address);
  
  const balanceWei = await ethers.provider.getBalance(deployer.address);
  const balanceEth = ethers.formatEther(balanceWei);
  
  console.log(`Balance: ${balanceEth} MATIC`);
  
  if (parseFloat(balanceEth) < 0.1) {
    console.warn("\nWARNING: Your balance might be too low for deployment!");
    console.warn("Please get some MATIC from Polygon Amoy faucet:");
    console.warn("https://amoy.polygon.technology/faucet");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 