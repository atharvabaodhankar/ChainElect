import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Web3 from "web3";
import MyContract from "../../artifacts/contracts/MyContract.sol/MyContract.json";
import { supabase } from "../utils/supabaseClient";

const Admin = () => {
  const [message, setMessage] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [votingDuration, setVotingDuration] = useState(60); // default 60 minutes
  const [newAdminAddress, setNewAdminAddress] = useState(""); // New state for admin address
  const [adminList, setAdminList] = useState([]); // State for storing admins list
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
        
        // Get current network ID
        const networkId = await web3.eth.net.getId();
        
        // Get contract address for current network
        const deployedNetwork = MyContract.networks[networkId];
        if (!deployedNetwork) {
          setMessage(`Contract not deployed on network ${networkId}. Please make sure you're connected to the correct network.`);
          return;
        }

        const contractAddress = deployedNetwork.address;
        if (!contractAddress) {
          setMessage("Contract address not found. Please make sure the contract is deployed.");
          return;
        }

        // Create contract instance
        const contractInstance = new web3.eth.Contract(
          MyContract.abi,
          contractAddress
        );

        // Get current account
        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
          setMessage("Please connect your MetaMask account");
          return;
        }

        const currentAccount = accounts[0];
        
        // Check if current account is admin
        const adminStatus = await contractInstance.methods.isAdmin(currentAccount).call();
        
        if (!adminStatus) {
          setMessage("Unauthorized: Only admins can access this page");
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);
        setContract(contractInstance);

        // Get voting status
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

        // Load admin list
        await loadAdminList(contractInstance);

      } catch (error) {
        console.error("Initialization error:", error);
        if (error.message.includes("Internal JSON-RPC error")) {
          setMessage("Please make sure you're connected to the correct network in MetaMask and the contract is deployed.");
        } else {
          setMessage("Failed to initialize: " + error.message);
        }
      }
    };

    initializeContract();
  }, []);

  // Function to load admin list
  const loadAdminList = async (contractInstance) => {
    try {
      // Use the current contract instance if one isn't provided
      const contractToUse = contractInstance || contract;
      if (!contractToUse) return;
      
      const admins = await contractToUse.methods.getAllAdmins().call();
      setAdminList(admins);
    } catch (error) {
      console.error("Error loading admin list:", error);
      setMessage("Failed to load admin list: " + error.message);
    }
  };

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

  const addAdmin = async () => {
    if (!newAdminAddress.trim()) {
      setMessage("Please enter an admin address");
      return;
    }

    if (!Web3.utils.isAddress(newAdminAddress)) {
      setMessage("Please enter a valid Ethereum address");
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.addAdmin(newAdminAddress).send({ from: accounts[0] });
      setMessage(`Admin "${newAdminAddress}" added successfully!`);
      setNewAdminAddress("");
      
      // Refresh admin list
      await loadAdminList(contract);
    } catch (error) {
      console.error("Error adding admin:", error);
      setMessage("Failed to add admin: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to store results in Supabase
  const storeResults = async () => {
    try {
      const candidateCount = await contract.methods.getCandidatesCount().call();
      const candidatesData = [];
      
      for (let i = 1; i <= candidateCount; i++) {
        const candidate = await contract.methods.getCandidate(i).call();
        candidatesData.push({
          name: candidate[0],
          votes: Number(candidate[1])
        });
      }
      
      // Sort candidates by vote count
      candidatesData.sort((a, b) => Number(b.votes) - Number(a.votes));
      
      // Only store in Supabase if there are votes
      if (candidatesData.some(c => Number(c.votes) > 0)) {
        const { error } = await supabase
          .from('voting_results')
          .insert([
            {
              winner_name: candidatesData[0].name,
              winner_votes: Number(candidatesData[0].votes),
              candidates: candidatesData.map(c => ({
                name: c.name,
                votes: Number(c.votes)
              })),
              created_at: new Date().toISOString()
            }
          ]);

        if (error) {
          console.error("Supabase error:", error);
          throw new Error("Failed to store results in database");
        }
        
        setMessage("Voting has ended and results have been stored!");
      }
    } catch (error) {
      console.error("Error storing results:", error);
      setMessage("Failed to store voting results: " + error.message);
    }
  };

  // Modify the useEffect for timer to include result storage
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
            // Store results when voting ends naturally
            await storeResults();
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

  // Modify resetVotingState to use the new storeResults function
  const resetVotingState = async () => {
    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Store current results before resetting
      await storeResults();

      // Now reset the voting state
      await contract.methods.resetVotingState().send({ from: accounts[0] });
      
      setVotingStatus({ started: false, ended: false });
      setMessage("Voting state has been reset successfully and results have been stored!");
    } catch (error) {
      console.error("Error resetting voting state:", error);
      setMessage("Failed to reset voting state: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setDuration = async () => {
    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await contract.methods.setVotingDuration(votingDuration).send({ from: accounts[0] });
      setMessage(`Voting duration set to ${votingDuration} minutes successfully!`);
    } catch (error) {
      console.error("Error setting duration:", error);
      setMessage("Failed to set voting duration: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Helper to format Ethereum address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
            <h2>Admin Management</h2>
            <div className="admin-list">
              <h3>Current Admins:
                <button 
                  className="refresh-button" 
                  onClick={() => loadAdminList()} 
                  title="Refresh Admin List"
                  disabled={isLoading}
                >
                  ↻
                </button>
              </h3>
              <ul className="admin-addresses">
                {adminList.map((admin, index) => (
                  <li key={index} className="admin-address">
                    <span title={admin}>{formatAddress(admin)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <input
              type="text"
              value={newAdminAddress}
              onChange={(e) => setNewAdminAddress(e.target.value)}
              placeholder="Enter admin wallet address"
              disabled={isLoading}
            />
            <button 
              onClick={addAdmin} 
              disabled={isLoading}
              className={isLoading ? 'loading' : ''}
            >
              Add Admin
            </button>
          </div>

          <div>
            <h2>Voting Duration</h2>
            <div className="duration-control">
              <div className="duration-input-group">
                <input
                  type="number"
                  min="1"
                  value={votingDuration}
                  onChange={(e) => setVotingDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  placeholder="Enter duration"
                  disabled={votingStatus.started || isLoading}
                />
                <span className="duration-label">minutes</span>
              </div>
              <button
                onClick={setDuration}
                disabled={votingStatus.started || isLoading}
                className={isLoading ? 'loading' : ''}
              >
                Set Duration
              </button>
            </div>
            <p className="duration-helper">Set the voting duration in minutes (minimum 1 minute)</p>
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
              disabled={!votingStatus.started && !votingStatus.ended || isLoading}
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