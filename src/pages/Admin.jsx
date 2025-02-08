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

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        if (!accounts || accounts.length === 0) {
          setMessage("Please connect your MetaMask account");
          return;
        }

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyContract.networks[networkId];

        if (!deployedNetwork) {
          setMessage("Contract not deployed on this network");
          return;
        }

        const contractInstance = new web3.eth.Contract(
          MyContract.abi,
          deployedNetwork.address
        );

        // Check if connected account is an admin using contract method
        const currentAccount = accounts[0];
        const adminStatus = await contractInstance.methods.isAdmin(currentAccount).call();
        
        if (!adminStatus) {
          setMessage("Unauthorized: Only admins can access this page");
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);
        setContract(contractInstance);

        // Get current voting status
        const votingStarted = await contractInstance.methods.votingStarted().call();
        const votingEnded = await contractInstance.methods.votingEnded().call();
        setVotingStatus({ started: votingStarted, ended: votingEnded });

        // Fetch remaining time if voting is active
        if (votingStarted && !votingEnded) {
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

  // Function to periodically update remaining time
  useEffect(() => {
    let interval;
    if (contract) {
      // Function to fetch and update voting status and time from contract
      const updateVotingStatus = async () => {
        try {
          const votingStarted = await contract.methods.votingStarted().call();
          const votingEnded = await contract.methods.votingEnded().call();
          const votingEndTime = await contract.methods.votingEndTime().call();
          const currentTime = Math.floor(Date.now() / 1000);
          const remainingSeconds = Number(votingEndTime) - currentTime;
          
          // Check if voting has ended either by time or by contract state
          const isEnded = votingEnded || remainingSeconds <= 0;
          
          setVotingStatus({ 
            started: votingStarted, 
            ended: isEnded 
          });
          
          // If voting has ended, ensure timer shows 0
          setRemainingTime(isEnded ? 0 : Math.max(0, remainingSeconds));

          // If voting has ended, clear the interval
          if (isEnded) {
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error updating voting status:", error);
        }
      };

      // Initial update
      updateVotingStatus();
      
      // Only start countdown if voting is active
      if (votingStatus.started && !votingStatus.ended) {
        interval = setInterval(() => {
          updateVotingStatus();
        }, 1000);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [contract, votingStatus.started, votingStatus.ended]);

  // Function to format time
  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startVoting = async () => {
    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.startVoting().send({ from: accounts[0] });
      setMessage("Voting started successfully!");
      setVotingStatus({ started: true, ended: false });

      // Set timer to end voting after 1 hour
      setTimeout(async () => {
        try {
          await contract.methods.endVoting().send({ from: accounts[0] });
          setVotingStatus({ started: false, ended: true });
          setMessage("Voting has ended automatically after 1 hour");
        } catch (error) {
          console.error("Error ending voting:", error);
          setMessage("Failed to end voting automatically");
        }
      }, 3600000); // 1 hour in milliseconds

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
      setCandidateName(""); // Clear input field
    } catch (error) {
      console.error("Error adding candidate:", error);
      setMessage("Failed to add candidate: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        <div className="admin-page">
          <h1>Admin Access Only</h1>
          <p className="message" style={{ color: 'red' }}>{message}</p>
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
          'not-started'
        }`}>
          <h2>
            {votingStatus.ended ? 'VOTING ENDED' :
             votingStatus.started ? 'VOTING IS ACTIVE' :
             'VOTING NOT STARTED'}
          </h2>
          <p className="voting-status-subtitle">
            {votingStatus.ended ? 'The voting period has concluded' :
             votingStatus.started ? `Time Remaining: ${formatTime(remainingTime)}` :
             'Waiting to start the voting period'}
          </p>
        </div>

        <div className="status-section">
          <h2>Detailed Status</h2>
          <p>
            <span className={votingStatus.started ? 'active' : 'inactive'}></span>
            Voting Started: {votingStatus.started ? "Yes" : "No"}
          </p>
          <p>
            <span className={votingStatus.ended ? 'active' : 'inactive'}></span>
            Voting Ended: {votingStatus.ended ? "Yes" : "No"}
          </p>
          {votingStatus.started && !votingStatus.ended && (
            <p className="remaining-time">
              <span className="time-label">Time Remaining:</span>
              <span className="time-value">{formatTime(remainingTime)}</span>
            </p>
          )}
        </div>

        <div className="actions-section">
          <div>
            <h2>Add Candidate</h2>
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
            <h2>Voting Control</h2>
            <button
              onClick={startVoting}
              disabled={votingStatus.started || votingStatus.ended || isLoading}
              className={isLoading ? 'loading' : ''}
            >
              Start Voting
            </button>
          </div>
        </div>

        <p className={`message ${message.includes('Failed') || message.includes('Error') ? 'error' : ''}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Admin; 