import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Specify your admin MetaMask addresses here
const ADMIN_ADDRESSES = [
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Replace with your first admin MetaMask address
  "0x2345678901234567890123456789012345678901", // Replace with your second admin MetaMask address
  "0x3456789012345678901234567890123456789012"  // Replace with your third admin MetaMask address
];

async function main() {
  const web3 = new Web3('http://127.0.0.1:8545');
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];

  const contractPath = path.resolve(__dirname, '../artifacts/contracts/MyContract.sol/MyContract.json');
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

  const MyContract = new web3.eth.Contract(contractJson.abi);

  console.log('Deploying contract...');
  const myContract = await MyContract.deploy({
    data: contractJson.bytecode,
  }).send({
    from: owner,
    gas: 5000000,
    gasPrice: '30000000000'
  });

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

  // Save the deployed address to MyContract.json
  contractJson.networks = {
    "31337": {
      "address": myContract.options.address
    }
  };
  fs.writeFileSync(contractPath, JSON.stringify(contractJson, null, 2));
  console.log("Contract address saved to artifact file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });