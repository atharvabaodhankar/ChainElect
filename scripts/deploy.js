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
    from: owner
  });

  console.log("MyContract deployed to:", myContract.options.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });