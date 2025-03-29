import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Web3 from 'web3';
import contractConfig from '../utils/contractConfig';
import { loadContractArtifacts } from '../utils/contractLoader';

const VotingStatusRoute = ({ children }) => {
  const [votingActive, setVotingActive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        if (!window.ethereum) {
          setVotingActive(false);
          setIsLoading(false);
          return;
        }

        // Request connection to Polygon Amoy testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: contractConfig.polygonAmoy.chainHexId }],
          });
        } catch (switchError) {
          console.error("Error switching to Polygon Amoy network:", switchError);
          setVotingActive(false);
          setIsLoading(false);
          return;
        }

        const web3 = new Web3(window.ethereum);
        
        // Load contract artifacts dynamically
        const MyContract = await loadContractArtifacts();
        
        const contract = new web3.eth.Contract(
          MyContract.abi,
          contractConfig.polygonAmoy.contractAddress
        );

        const [votingStarted, votingEndedStatus, votingEndTime] = await Promise.all([
          contract.methods.votingStarted().call(),
          contract.methods.votingEnded().call(),
          contract.methods.votingEndTime().call()
        ]);

        const currentTime = Math.floor(Date.now() / 1000);
        
        // Check if voting has ended either by flag or by time
        const hasEnded = votingEndedStatus || (votingStarted && currentTime >= Number(votingEndTime));
        
        // Check if voting is active - it must be started AND not ended
        const isActive = votingStarted && !hasEnded;
        
        // Set votingActive to true only if voting has started and not ended
        setVotingActive(isActive);
        
        console.log("VotingStatusRoute check:", {
          votingStarted,
          votingEndedStatus,
          timeRemaining: Number(votingEndTime) - currentTime,
          hasEnded,
          isActive
        });
      } catch (error) {
        console.error('Error checking voting status:', error);
        setVotingActive(false); // Default to inactive on error
      } finally {
        setIsLoading(false);
      }
    };

    checkVotingStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If voting is not active (either not started or has ended), redirect to declared results
  // Otherwise, show the actual results page
  if (!votingActive) {
    return <Navigate to="/declared-results" replace />;
  }

  return children;
};

export default VotingStatusRoute; 