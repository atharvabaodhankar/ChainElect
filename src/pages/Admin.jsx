import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Web3 from "web3";
import MyContract from "../../artifacts/contracts/MyContract.sol/MyContract.json";

const Admin = () => {
  const [message, setMessage] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [votingStatus, setVotingStatus] = useState({
    started: false,
    ended: false
  });
  const [remainingTime, setRemainingTime] = useState(0);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (!window.ethereum) {
          setMessage("Please install MetaMask");
          return;
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create Web3 instance with MetaMask provider
        const web3 = new Web3(window.ethereum);
        
        // Check if we're on the correct network (Polygon Amoy)
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x13882') { // Polygon Amoy chain ID (80002)
          setMessage("Please switch to Polygon Amoy network in MetaMask");
          return;
        }

        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
          setMessage("Please connect your MetaMask account");
          return;
        }

        const contractAddress = "0x229bDE80F288C3a12a15e639238c359482636397";
        const contractInstance = new web3.eth.Contract(
          MyContract.abi,
          contractAddress
        );

        const currentAccount = accounts[0];
        const adminStatus = await contractInstance.methods.isAdmin(currentAccount).call();
        
        if (!adminStatus) {
          setMessage("Unauthorized: Only admins can access this page");
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);
        setContract(contractInstance);

        const [votingStarted, votingEnded, endTime] = await Promise.all([
          contractInstance.methods.votingStarted().call(),
          contractInstance.methods.votingEnded().call(),
          contractInstance.methods.votingEndTime().call()
        ]);

        const currentTime = Math.floor(Date.now() / 1000);
        const hasEnded = votingEnded || (votingStarted && currentTime >= endTime);

        setVotingStatus({ 
          started: votingStarted, 
          ended: hasEnded 
        });

        if (votingStarted && !hasEnded) {
          const remaining = await contractInstance.methods.getRemainingTime().call();
          setRemainingTime(Number(remaining));
        }

      } catch (error) {
        console.error("Initialization error:", error);
        setMessage("Failed to initialize: " + error.message);
      }
    };

    initializeContract();
  }, []);

  const startVoting = async () => {
    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.startVoting().send({ from: accounts[0] });
      
      setVotingStatus({ started: true, ended: false });
      setMessage("Voting started successfully!");

      const endTime = await contract.methods.votingEndTime().call();
      const currentTime = Math.floor(Date.now() / 1000);
      setRemainingTime(Number(endTime) - currentTime);

    } catch (error) {
      console.error("Error starting voting:", error);
      setMessage("Failed to start voting: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addCandidate = async () => {
    if (!candidateName.trim()) {
      setMessage("Please enter a candidate name");
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.addCandidate(candidateName).send({ from: accounts[0] });
      setMessage(`Candidate "${candidateName}" added successfully!`);
      setCandidateName("");
    } catch (error) {
      console.error("Error adding candidate:", error);
      setMessage("Failed to add candidate: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetVotingState = async () => {
    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get current gas price
      const gasPrice = await window.ethereum.request({ method: 'eth_gasPrice' });
      
      // Estimate gas for the transaction
      const gasEstimate = await contract.methods.resetVotingState().estimateGas({ 
        from: accounts[0] 
      });

      // Add 20% buffer to gas estimate
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);

      await contract.methods.resetVotingState().send({ 
        from: accounts[0],
        gas: gasLimit,
        gasPrice: gasPrice
      });
      
      setVotingStatus({ started: false, ended: false });
      setMessage("Voting state has been reset successfully!");
    } catch (error) {
      console.error("Error resetting voting state:", error);
      if (error.message.includes("insufficient funds")) {
        setMessage("Insufficient funds for transaction. Please add MATIC to your wallet.");
      } else if (error.message.includes("nonce")) {
        setMessage("Transaction failed. Please try again.");
      } else {
        setMessage("Failed to reset voting state: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (contract && votingStatus.started && !votingStatus.ended) {
      interval = setInterval(async () => {
        try {
          const [votingStarted, votingEnded, endTime] = await Promise.all([
            contract.methods.votingStarted().call(),
            contract.methods.votingEnded().call(),
            contract.methods.votingEndTime().call()
          ]);

          const currentTime = Math.floor(Date.now() / 1000);
          const hasEnded = votingEnded || (votingStarted && currentTime >= endTime);
          
          if (hasEnded) {
            setVotingStatus({ started: votingStarted, ended: true });
            setRemainingTime(0);
            clearInterval(interval);
          } else if (votingStarted) {
            setRemainingTime(Math.max(0, Number(endTime) - currentTime));
          }
        } catch (error) {
          console.error("Error updating voting status:", error);
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [contract, votingStatus.started, votingStatus.ended]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isAdmin) {
    return (
      <div>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        <div className="admin-page">
          <div className="voting-status-banner ended">
            <h2>Access Denied</h2>
            <p className="voting-status-subtitle">Only administrators can access this page</p>
          </div>
          <p className="message error">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        
        <div className={`voting-status-banner ${
          votingStatus.ended ? 'ended' : 
          votingStatus.started ? 'active' : 
          ''
        }`}>
          <h2>
            {votingStatus.ended ? 'Voting Has Ended' :
             votingStatus.started ? 'Voting In Progress' :
             'Voting Not Started'}
          </h2>
          {votingStatus.started && !votingStatus.ended && (
            <p className="voting-status-subtitle">
              Time Remaining: {formatTime(remainingTime)}
            </p>
          )}
        </div>

        <div className="status-section">
          <h2>Current Status</h2>
          <p>
            <span className={votingStatus.started ? 'active' : 'inactive'}></span>
            Voting Status: {votingStatus.started ? "Active" : "Not Started"}
          </p>
          <p>
            <span className={votingStatus.ended ? 'active' : 'inactive'}></span>
            Election Status: {votingStatus.ended ? "Concluded" : "In Progress"}
          </p>
          {votingStatus.started && !votingStatus.ended && (
            <div className="remaining-time">
              <span className="time-label">Time Remaining:</span>
              <span className="time-value">{formatTime(remainingTime)}</span>
            </div>
          )}
        </div>

        <div className="actions-section">
          <div>
            <h2>Add New Candidate</h2>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
              disabled={votingStatus.started || isLoading}
            />
            <button 
              onClick={addCandidate} 
              disabled={votingStatus.started || isLoading}
              className={isLoading ? 'loading' : ''}
            >
              Add Candidate
            </button>
          </div>

          <div>
            <h2>Election Control</h2>
            <button
              onClick={startVoting}
              disabled={votingStatus.started || votingStatus.ended || isLoading}
              className={isLoading ? 'loading' : ''}
            >
              Start Election
            </button>
            <button
              onClick={resetVotingState}
              disabled={isLoading}
              className={`reset-button ${isLoading ? 'loading' : ''}`}
            >
              Reset Election
            </button>
          </div>
        </div>

        {message && (
          <p className={`message ${message.includes('Failed') || message.includes('Error') ? 'error' : ''}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Admin; 