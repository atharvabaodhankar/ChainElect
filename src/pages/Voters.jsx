import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Navbar from "../components/Navbar";
import Conn_web from "../components/Conn_web";
import Web3 from "web3";
import tickGif from "/assets/tick.gif";
import FaceAuth from "../components/FaceAuth";
import contractConfig from "../utils/contractConfig";
import { API_ENDPOINTS, apiRequest } from '../utils/api';
import { loadContractArtifacts } from '../utils/contractLoader';

// Helper function to check if error is an RPC error
const isRpcError = (error) => {
  return (
    error &&
    (error.message.includes("Internal JSON-RPC error") || 
     error.message.includes("transaction underpriced") ||
     error.message.includes("insufficient funds") ||
     error.message.includes("gas required exceeds allowance"))
  );
};

// Helper function to handle RPC errors
const getRpcErrorMessage = (error) => {
  if (!error) return "Unknown error";
  
  if (error.message.includes("transaction underpriced")) {
    return "Transaction underpriced. Please try again with higher gas settings.";
  } else if (error.message.includes("insufficient funds")) {
    return "Insufficient funds. Please add more MATIC to your wallet.";
  } else if (error.message.includes("gas required exceeds allowance")) {
    return "Gas required exceeds allowance. Please try again with higher gas limit.";
  } else if (error.message.includes("Internal JSON-RPC error")) {
    return "Network is congested. Please try again later.";
  }
  
  return error.message;
};

const Voters = () => {
  const { t } = useTranslation();
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
  const [hasVoted, setHasVoted] = useState(false);

  // Function to format time
  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        if (!window.ethereum) {
          setMessage(t('voter.messages.installMetamask'));
          return;
        }

        // Request connection to Polygon Amoy testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: contractConfig.polygonAmoy.chainHexId }],
          });
        } catch (switchError) {
          // If the chain hasn't been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: contractConfig.polygonAmoy.chainHexId,
                  chainName: contractConfig.polygonAmoy.chainName,
                  rpcUrls: [contractConfig.polygonAmoy.rpcUrl],
                  nativeCurrency: {
                    name: contractConfig.polygonAmoy.currencyName,
                    symbol: contractConfig.polygonAmoy.currencySymbol,
                    decimals: 18
                  },
                  blockExplorerUrls: [contractConfig.polygonAmoy.blockExplorer]
                }],
              });
            } catch (addError) {
              console.error("Error adding Polygon Amoy network:", addError);
              setMessage(t('voter.messages.addPolygonNetwork'));
              return;
            }
          } else {
            console.error("Error switching to Polygon Amoy network:", switchError);
            setMessage(t('voter.messages.switchPolygonNetwork'));
            return;
          }
        }

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        if (!accounts || accounts.length === 0) {
          setMessage(t('voter.messages.connectMetamask'));
          return;
        }

        // Load contract artifacts dynamically
        const MyContract = await loadContractArtifacts();

        // Using our deployed contract address from config
        const contractInstance = new web3.eth.Contract(
          MyContract.abi,
          contractConfig.polygonAmoy.contractAddress
        );

        // Check if user has already voted
        const voter = await contractInstance.methods.voters(accounts[0]).call();
        
        if (voter.hasVoted) {
          setMessage(t('voter.messages.alreadyVoted'));
          setHasVoted(true);
          // Redirect to results page after a short delay
          setTimeout(() => {
            navigate("/results");
          }, 2000);
          return;
        }

        setContract(contractInstance);
        setAccounts(accounts);
      } catch (error) {
        console.error("Error checking voting status:", error);
        setMessage(t('voter.messages.votingStatusError', { error: error.message }));
      }
    };

    checkVotingStatus();
  }, [navigate, t]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        if (hasVoted) return; // Don't fetch candidates if user has already voted

        const web3 = new Web3(window.ethereum);
        
        // Load contract artifacts dynamically
        const MyContract = await loadContractArtifacts();
        
        // Using our deployed contract address from config
        const contract = new web3.eth.Contract(
          MyContract.abi,
          contractConfig.polygonAmoy.contractAddress
        );

        // Check voting status
        const votingStarted = await contract.methods.votingStarted().call();
        const votingEnded = await contract.methods.votingEnded().call();
        
        // Get both the end time and current remaining time
        const votingEndTime = await contract.methods.votingEndTime().call();
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingSeconds = Number(votingEndTime) - currentTime;
        
        setRemainingTime(remainingSeconds);

        if (!votingStarted) {
          setMessage(t('voter.messages.votingNotStarted'));
          setTimeout(() => {
            navigate("/declared-results");
          }, 2000);
          return;
        }

        if (votingEnded || remainingSeconds <= 0) {
          setMessage(t('voter.messages.votingEnded'));
          setTimeout(() => {
            navigate("/declared-results");
          }, 2000);
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
      } catch (error) {
        console.error("Error fetching candidates: ", error);
        setErrorMessage(t('voter.messages.fetchCandidatesError'));
      }
    };

    fetchCandidates();
  }, [navigate, hasVoted, t]);

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
            setMessage(t('voter.messages.votingEndedCheckResults'));
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
  }, [contract, remainingTime, navigate, t]);

  // Modified handleVote function
  const handleVote = async (id) => {
    if (!id) {
      setMessage(t('voter.messages.enterCandidateId'));
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
        setMessage(t('voter.messages.noMetamaskAccount'));
        return;
      }
      const currentAccount = currentAccounts[0];

      // Reinitialize Web3 and contract
      const web3 = new Web3(window.ethereum);
      
      // Load contract artifacts dynamically
      const MyContract = await loadContractArtifacts();
      
      // Using our deployed contract address from config
      const contractInstance = new web3.eth.Contract(
        MyContract.abi,
        contractConfig.polygonAmoy.contractAddress
      );

      // Check if user has already voted
      const voter = await contractInstance.methods.voters(currentAccount).call();
      if (voter.hasVoted) {
        setMessage(t('voter.messages.alreadyVoted'));
        setShowErrorPopup(true);
        return;
      }

      // Add gas configuration to avoid RPC errors
      await contractInstance.methods.vote(selectedCandidateId).send({ 
        from: currentAccount,
        gasPrice: contractConfig.polygonAmoy.transactionConfig.gasPrice,
        gas: contractConfig.polygonAmoy.transactionConfig.gasLimit
      });
      
      setMessage(t('voter.messages.voteSuccess'));
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
        setMessage(t('voter.messages.alreadyVoted'));
      } else if (error.message.includes('Voting is not active')) {
        setMessage(t('voter.messages.votingNotActive'));
      } else if (error.message.includes('Invalid candidate')) {
        setMessage(t('voter.messages.invalidCandidate'));
      } else if (isRpcError(error)) {
        setMessage(t('voter.messages.votingError') + " " + getRpcErrorMessage(error));
      } else {
        setMessage(t('voter.messages.failedToVote'));
      }
      setShowErrorPopup(true);
      console.error("Error casting vote:", error);
    } finally {
      setShowFaceAuth(false);
      setSelectedCandidateId(null);
    }
  };

  const handleFaceAuthFailure = () => {
    setMessage(t('voter.messages.faceVerificationFailed'));
    setShowErrorPopup(true);
    setShowFaceAuth(false);
    setSelectedCandidateId(null);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const { success } = await apiRequest(API_ENDPOINTS.logout, {
        method: "POST",
      });

      if (success) {
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
        const { success, data } = await apiRequest(API_ENDPOINTS.getVoter(voterId));
        if (success) {
          setUserInfo(data);
          console.log("Fetched user info:", data);
          // Compare with current Metamask ID
          if (currentMetamaskId && currentMetamaskId !== data.metamask_id.toLowerCase()) {
            alert(t('voter.messages.metamaskIdMismatch'));
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [t]);

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

  if (hasVoted) {
    return (
      <div>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        <div className="voters-page">
          <div className="voting-message">
            <h2>{t('voter.alreadyVotedTitle')}</h2>
            <p>{t('voter.alreadyVotedRedirecting')}</p>
          </div>
        </div>
      </div>
    );
  }

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
              <img src={tickGif} alt={t('common.success')} className="success-gif" />
              <h2>{message}</h2>
              <button className="close-button" onClick={() => setShowPopup(false)}>
                {t('common.close')}
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
                  {t('common.ok')}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!message.includes("not started") && (
          <div className="voting-status-section">
            <h1>{t('voter.activeElectionSession')}</h1>
            {remainingTime > 0 && (
              <div className="time-display">
                <span className="time-label">{t('voter.timeRemaining')}</span>
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
                  <h2>{t(`candidates.${candidate.name}`, {defaultValue: candidate.name})}</h2>
                  <p className="candidate-id">{t('voter.candidateNumber', { id: candidate.id })}</p>
                </div>
                <button
                  onClick={() => handleVote(candidate.id)}
                  className="modern-vote-button"
                >
                  {t('voter.castVote')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {userInfo && (
          <div className="voter-profile-section">
            <div className="profile-header">
              <h2>{t('voter.profile.title')}</h2>
              {userInfo.image_url && (
                <div className="profile-image-container">
                  <img src={userInfo.image_url} alt={t('voter.profile.image')} className="profile-image" />
                </div>
              )}
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">{t('voter.profile.voterId')}</span>
                <span className="detail-value">{userInfo.voter_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('voter.profile.metamaskId')}</span>
                <span className="detail-value">{userInfo.metamask_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('voter.profile.email')}</span>
                <span className="detail-value">{userInfo.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('voter.profile.balance')}</span>
                <span className="detail-value">{<Conn_web updateMetamaskId={updateWalletInfo} />}&nbsp;ETH</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="modern-logout-button">
          {t('voter.logout')}
        </button>
      </div>
    </div>
  );
};

export default Voters;
