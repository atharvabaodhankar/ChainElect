import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Conn_web from "../components/Conn_web";
import Web3 from "web3";
import MyContract from "../../artifacts/contracts/MyContract.sol/MyContract.json";
import tickGif from "../assets/tick.gif";

const Voters = () => {
  const [candidates, setCandidates] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState('0');
  const [showPopup, setShowPopup] = useState(false);

  // Function to format time
  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);
        const deployedNetwork = MyContract.networks[networkId];
        if (!deployedNetwork) {
          console.error("Contract not deployed on the current network");
          return;
        }
        const contract = new web3.eth.Contract(
          MyContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Check voting status
        const votingStarted = await contract.methods.votingStarted().call();
        const votingEnded = await contract.methods.votingEnded().call();
        
        // Get both the end time and current remaining time
        const votingEndTime = await contract.methods.votingEndTime().call();
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const remainingSeconds = Number(votingEndTime) - currentTime;
        
        console.log("Voting end time:", votingEndTime);
        console.log("Current time:", currentTime);
        console.log("Calculated remaining time:", remainingSeconds);
        
        setRemainingTime(remainingSeconds);

        if (!votingStarted) {
          setMessage("Voting has not started yet. Please wait for the admin to start the voting.");
          return;
        }

        if (votingEnded || remainingSeconds <= 0) {
          setMessage("Voting has ended. Please check the results page.");
          navigate("/results");
          return;
        }

        const candidatesCount = await contract.methods.getCandidatesCount().call();
        console.log("Candidates Count:", candidatesCount);
        const candidatesArray = [];

        for (let i = 0; i < candidatesCount; i++) {
          const candidate = await contract.methods.getCandidate(i + 1).call();
          console.log("Fetched Candidate:", candidate);
          candidatesArray.push({ id: i + 1, name: candidate[0], votes: candidate[1] });
        }

        setCandidates(candidatesArray);
        setContract(contract);
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
      } catch (error) {
        console.error("Error fetching candidates: ", error);
        setErrorMessage("Failed to fetch candidates.");
      }
    };

    fetchCandidates();
  }, [navigate]);

  // Update timer effect
  useEffect(() => {
    let interval;
    let contractSync;
    
    if (contract && remainingTime > 0) {
      // Function to check voting status and update timer
      const updateVotingStatus = async () => {
        try {
          const votingStarted = await contract.methods.votingStarted().call();
          const votingEnded = await contract.methods.votingEnded().call();
          const votingEndTime = await contract.methods.votingEndTime().call();
          const currentTime = Math.floor(Date.now() / 1000);
          const remainingSeconds = Number(votingEndTime) - currentTime;
          
          // Check if voting has ended either by time or contract state
          if (votingEnded || remainingSeconds <= 0) {
            clearInterval(interval);
            clearInterval(contractSync);
            setMessage("Voting has ended. Please check the results page.");
            setRemainingTime(0);
            navigate("/results");
            return;
          }
          
          setRemainingTime(Math.max(0, remainingSeconds));
        } catch (error) {
          console.error("Error updating voting status:", error);
        }
      };

      // Initial check
      updateVotingStatus();

      // Update every second
      interval = setInterval(updateVotingStatus, 1000);

      return () => {
        if (interval) clearInterval(interval);
        if (contractSync) clearInterval(contractSync);
      };
    }
  }, [contract, remainingTime, navigate]);

  // Function to handle voting
  const handleVote = async (id) => {
    if (!id) {
      setMessage("Please enter a candidate ID.");
      return;
    }

    try {
      // Request account access and reinitialize Web3
      const currentAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!currentAccounts || currentAccounts.length === 0) {
        setMessage("Error: No Metamask account connected.");
        return;
      }
      const currentAccount = currentAccounts[0];

      // Reinitialize Web3 and contract
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MyContract.networks[networkId];
      
      if (!deployedNetwork) {
        setMessage("Error: Contract not deployed on the current network");
        return;
      }

      const contractInstance = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
      );

      // Check if user has already voted before attempting to vote
      const voter = await contractInstance.methods.voters(currentAccount).call();
      if (voter.hasVoted) {
        alert("You have already cast your vote!");
        return;
      }

      await contractInstance.methods.vote(id).send({ from: currentAccount });
      setMessage("Vote cast successfully!");
      setShowPopup(true);
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === id
            ? { ...candidate, votes: BigInt(candidate.votes) + BigInt(1) }
            : candidate
        )
      );
    } catch (error) {
      // Extract the revert reason from the error
      if (error.message.includes('You have already voted')) {
        alert("You have already cast your vote!");
        setMessage("Error: You have already cast your vote.");
      } else if (error.message.includes('Voting is not active')) {
        setMessage("Error: Voting is not currently active.");
      } else if (error.message.includes('Invalid candidate')) {
        setMessage("Error: Invalid candidate selection.");
      } else {
        setMessage("Error: Failed to cast vote. Please try again.");
      }
      console.error("Error casting vote:", error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("voter_id");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const voterId = localStorage.getItem("voter_id");
      try {
        // Get current Metamask accounts first
        let currentMetamaskId = '';
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          currentMetamaskId = accounts[0].toLowerCase();
        }

        // Then fetch user info and compare with current Metamask ID
        const response = await fetch(`http://localhost:3000/voters/${voterId}`);
        const data = await response.json();
        setUserInfo(data);

        // Compare with current Metamask ID
        if (currentMetamaskId && currentMetamaskId !== data.metamask_id.toLowerCase()) {
          alert('Metamask ID does not match');
          handleLogout();
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleLogout);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleLogout);
      }
    };
  }, []);

  // Update the callback to handle both metamask ID and balance
  const updateWalletInfo = (newMetamaskId, newBalance) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      metamask_id: newMetamaskId,
    }));
    setBalance(newBalance);
  };

  return (
    <div className="voters-page">
      <Navbar
        home="/"
        features="/#features"
        aboutus="/#aboutus"
        contactus="/#contactus"
      />
      <div className="voters-modern-container">
        {showPopup && message && (
          <div className="vote-success-overlay">
            <div className="vote-success-modal">
              <img src={tickGif} alt="Success" className="success-gif" />
              <h2>{message}</h2>
              <button className="close-button" onClick={() => setShowPopup(false)}>
                Close
              </button>
            </div>
          </div>
        )}
        
        {!message.includes("not started") && (
          <div className="voting-status-section">
            <h1>Active Election Session</h1>
            {remainingTime > 0 && (
              <div className="time-display">
                <span className="time-label">Time Remaining</span>
                <span className="time-value">{formatTime(remainingTime)}</span>
              </div>
            )}
          </div>
        )}

        <div className="candidates-modern-grid">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-modern-card">
              <div className="candidate-content">
                <div>
                  <h2>{candidate.name}</h2>
                  <p className="candidate-id">Candidate #{candidate.id}</p>
                </div>
                <button
                  onClick={() => handleVote(candidate.id)}
                  className="modern-vote-button"
                >
                  Cast Vote
                </button>
              </div>
            </div>
          ))}
        </div>


        {userInfo && (
          <div className="voter-profile-section">
            <div className="profile-header">
              <h2>Voter Profile</h2>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Voter ID</span>
                <span className="detail-value">{userInfo.voter_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Metamask ID</span>
                <span className="detail-value">{userInfo.metamask_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Balance</span>
                <span className="detail-value">{<Conn_web updateMetamaskId={updateWalletInfo} />
              }&nbsp;ETH</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="modern-logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Voters;
