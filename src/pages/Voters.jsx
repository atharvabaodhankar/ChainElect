import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Conn_web from "../components/Conn_web";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS, NETWORK_CONFIG } from "../config/contract";
import tickGif from "../assets/tick.gif";
import FaceAuth from "../components/FaceAuth";

const Voters = () => {
  const [candidates, setCandidates] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState('0');
  const [showPopup, setShowPopup] = useState(false);
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

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
        const web3 = new Web3(window.ethereum || NETWORK_CONFIG.rpcUrl);
        
        // Request account access if needed
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Check if we're on the correct network
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId !== `0x${Number(NETWORK_CONFIG.id).toString(16)}`) {
            throw new Error(`Please switch to the ${NETWORK_CONFIG.name} network`);
          }
        }

        const contract = new web3.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );

        // Check voting status
        const [votingStarted, votingEnded] = await contract.methods.getVotingStatus().call();
        
        // Get both the end time and current remaining time
        const votingEndTime = await contract.methods.getVotingEndTime().call();
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
        setErrorMessage(error.message || "Failed to fetch candidates.");
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
          const [votingStarted, votingEnded] = await contract.methods.getVotingStatus().call();
          const votingEndTime = await contract.methods.getVotingEndTime().call();
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

  // Modified handleVote function
  const handleVote = async (id) => {
    if (!id) {
      setMessage("Please enter a candidate ID.");
      return;
    }

    setSelectedCandidateId(id);
    setShowFaceAuth(true);
  };

  const handleFaceAuthSuccess = async () => {
    try {
      // Request account access and reinitialize Web3
      const currentAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!currentAccounts || currentAccounts.length === 0) {
        setMessage("Error: No Metamask account connected.");
        return;
      }
      const currentAccount = currentAccounts[0];

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== `0x${Number(NETWORK_CONFIG.id).toString(16)}`) {
        throw new Error(`Please switch to the ${NETWORK_CONFIG.name} network`);
      }

      // Initialize contract
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );

      // Check if user has already voted
      const hasVoted = await contractInstance.methods.hasVoted(currentAccount).call();
      if (hasVoted) {
        setMessage("You have already cast your vote!");
        setShowErrorPopup(true);
        return;
      }

      await contractInstance.methods.vote(selectedCandidateId).send({ from: currentAccount });
      setMessage("Vote cast successfully!");
      setShowPopup(true);
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === selectedCandidateId
            ? { ...candidate, votes: BigInt(candidate.votes) + BigInt(1) }
            : candidate
        )
      );
    } catch (error) {
      if (error.message.includes('You have already voted')) {
        setMessage("You have already cast your vote!");
      } else if (error.message.includes('Voting is not active')) {
        setMessage("Voting is not currently active");
      } else if (error.message.includes('Invalid candidate')) {
        setMessage("Invalid candidate selection");
      } else {
        setMessage(error.message || "Failed to cast vote. Please try again");
      }
      setShowErrorPopup(true);
      console.error("Error casting vote:", error);
    } finally {
      setShowFaceAuth(false);
      setSelectedCandidateId(null);
    }
  };

  const handleFaceAuthFailure = () => {
    setMessage("Face verification failed. Please try again or login again.");
    setShowErrorPopup(true);
    setShowFaceAuth(false);
    setSelectedCandidateId(null);
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
        console.log("Fetched user info:", data);
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
        {showFaceAuth && userInfo && (
          <FaceAuth
            storedImageUrl={userInfo.image_url}
            onAuthSuccess={handleFaceAuthSuccess}
            onAuthFailure={handleFaceAuthFailure}
            storedFaceDescriptor={userInfo.face_descriptor}
          />
        )}

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

        {showErrorPopup && (
          <div className="error-popup-overlay">
            <div className="error-popup-modal">
              <div className="error-content">
                <h2>{message}</h2>
                <button className="error-close-button" onClick={() => setShowErrorPopup(false)}>
                  OK
                </button>
              </div>
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
              {userInfo.image_url && (
                <div className="profile-image-container">
                  <img src={userInfo.image_url} alt="Profile" className="profile-image" />
                </div>
              )}
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
                <span className="detail-label">Email</span>
                <span className="detail-value">{userInfo.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Balance</span>
                <span className="detail-value">{<Conn_web updateMetamaskId={updateWalletInfo} />}&nbsp;ETH</span>
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
