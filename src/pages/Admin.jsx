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
             votingStatus.started ? 'Voters can cast their votes now' :
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