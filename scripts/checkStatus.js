import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const web3 = new Web3('https://rpc-amoy.polygon.technology');
  const contractPath = path.resolve(__dirname, '../artifacts/contracts/MyContract.sol/MyContract.json');
  const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  
  const contractAddress = "0x229bDE80F288C3a12a15e639238c359482636397";
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