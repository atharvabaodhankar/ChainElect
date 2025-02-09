import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const web3 = new Web3('http://127.0.0.1:8545');
  const contractPath = path.resolve(__dirname, '../artifacts/contracts/MyContract.sol/MyContract.json');
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  
  const contractAddress = contractJson.networks["31337"].address;
  const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

  console.log('Checking voting status...');
  const votingStarted = await contract.methods.votingStarted().call();
  const votingEnded = await contract.methods.votingEnded().call();
  const votingEndTime = await contract.methods.votingEndTime().call();
  const currentTime = Math.floor(Date.now() / 1000);

  console.log('Voting Started:', votingStarted);
  console.log('Voting Ended:', votingEnded);
  console.log('Voting End Time:', votingEndTime);
  console.log('Current Time:', currentTime);
  console.log('Time Remaining:', votingEndTime - currentTime, 'seconds');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 