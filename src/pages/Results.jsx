import React, { useEffect, useState } from "react";
import Web3 from "web3";
import MyContract from "../contracts/MyContract.json";

const Results = () => {
  const [winner, setWinner] = useState({ name: "", voteCount: 0 });

  useEffect(() => {
    const fetchWinner = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MyContract.networks[networkId];
      const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const result = await contract.methods.getWinner().call();
      setWinner({ name: result[0], voteCount: result[1] });
    };

    fetchWinner();
  }, []);

  return (
    <div>
      <h1>Voting Results</h1>
      <p>Winner: {winner.name}</p>
      <p>Vote Count: {winner.voteCount}</p>
    </div>
  );
};

export default Results;
