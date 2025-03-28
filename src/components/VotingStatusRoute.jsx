import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Web3 from 'web3';
import MyContract from '../../artifacts/contracts/MyContract.sol/MyContract.json';

const VotingStatusRoute = ({ children }) => {
  const [isVotingActive, setIsVotingActive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        if (!window.ethereum) {
          setIsVotingActive(false);
          setIsLoading(false);
          return;
        }

        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyContract.networks[networkId];
        
        if (!deployedNetwork) {
          setIsVotingActive(false);
          setIsLoading(false);
          return;
        }

        const contract = new web3.eth.Contract(
          MyContract.abi,
          deployedNetwork.address
        );

        const [votingStarted, votingEnded, votingEndTime] = await Promise.all([
          contract.methods.votingStarted().call(),
          contract.methods.votingEnded().call(),
          contract.methods.votingEndTime().call()
        ]);

        const currentTime = Math.floor(Date.now() / 1000);
        const hasEnded = votingEnded || (votingStarted && currentTime >= Number(votingEndTime));
        
        setIsVotingActive(hasEnded);
      } catch (error) {
        console.error('Error checking voting status:', error);
        setIsVotingActive(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkVotingStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isVotingActive) {
    return <Navigate to="/declared-results" replace />;
  }

  return children;
};

export default VotingStatusRoute; 