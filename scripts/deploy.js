import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Specify your admin MetaMask addresses here
const ADMIN_ADDRESSES = [
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Replace with your first admin MetaMask address
  "0x2345678901234567890123456789012345678901", // Replace with your second admin MetaMask address
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097"  // Replace with your third admin MetaMask address(Athu)
];

async function main() {
  // Use Sepolia in production, localhost for development
  const isProduction = process.env.NODE_ENV === 'production';
  const rpcUrl = isProduction 
    ? process.env.INFURA_SEPOLIA_URL 
    : 'http://127.0.0.1:8545';
  
  console.log(`Deploying to: ${isProduction ? 'Sepolia Testnet' : 'Local Network'}`);
  
  const web3 = new Web3(rpcUrl);
  
  // Set up account from private key in production
  let owner;
  if (isProduction) {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required for Sepolia deployment');
    }
    
    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    web3.eth.accounts.wallet.add(account);
    owner = account.address;
    console.log(`Using account: ${owner}`);
  } else {
    // For local development, use the first account
    const accounts = await web3.eth.getAccounts();
    owner = accounts[0];
  }

  const contractPath = path.resolve(__dirname, '../artifacts/contracts/MyContract.sol/MyContract.json');
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

  const MyContract = new web3.eth.Contract(contractJson.abi);

  console.log('Deploying contract...');
  const deployOptions = {
    from: owner,
    gas: 5000000,
    gasPrice: '30000000000'
  };
  
  const myContract = await MyContract.deploy({
    data: contractJson.bytecode,
  }).send(deployOptions);

  console.log("MyContract deployed to:", myContract.options.address);

  // Add specified admin addresses
  console.log('Adding admin addresses...');
  for (const adminAddress of ADMIN_ADDRESSES) {
    if (web3.utils.isAddress(adminAddress)) {
      await myContract.methods.addAdmin(adminAddress).send({ from: owner });
      console.log(`Added admin: ${adminAddress}`);
    } else {
      console.warn(`Invalid address format for: ${adminAddress}`);
    }
  }

  // Add candidates
  console.log('Adding initial candidates...');
  await myContract.methods.addCandidate("Alice Johnson").send({ from: owner });
  await myContract.methods.addCandidate("Bob Smith").send({ from: owner });
  await myContract.methods.addCandidate("Charlie Brown").send({ from: owner });
  await myContract.methods.addCandidate("Diana Prince").send({ from: owner });
  console.log("Candidates added successfully!");

  // Reset voting state
  console.log('Resetting voting state...');
  await myContract.methods.resetVotingState().send({ from: owner });
  console.log("Voting state reset successfully!");

  // Save the deployed address to MyContract.json
  const networkId = isProduction ? "11155111" : "31337"; // 11155111 is Sepolia network ID
  contractJson.networks = {
    [networkId]: {
      "address": myContract.options.address
    }
  };
  fs.writeFileSync(contractPath, JSON.stringify(contractJson, null, 2));
  console.log(`Contract address saved to artifact file for network ${networkId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });