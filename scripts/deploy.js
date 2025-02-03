import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const web3 = new Web3('http://127.0.0.1:8545'); // Ensure this matches your local node URL
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];

  const contractPath = path.resolve(__dirname, '../artifacts/contracts/MyContract.sol/MyContract.json');
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

  const MyContract = new web3.eth.Contract(contractJson.abi);

  const myContract = await MyContract.deploy({
    data: contractJson.bytecode,
  }).send({
    from: owner,
    gas: 5000000, // Set a gas limit
    gasPrice: '30000000000' // Set a gas price
  });

  console.log("MyContract deployed to:", myContract.options.address);

  // Add candidates
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });