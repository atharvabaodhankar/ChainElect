import React, { useEffect, useState } from "react";
import Web3 from "web3";
import MyContract from "../../artifacts/contracts/MyContract.sol/MyContract.json";
import Navbar from "../components/Navbar";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingEnded, setVotingEnded] = useState(false);
  const [contract, setContract] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const navigate = useNavigate();

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyContract.networks[networkId];
        if (!deployedNetwork) {
          throw new Error("Contract not deployed on this network");
        }
        const newContract = new web3.eth.Contract(
          MyContract.abi,
          deployedNetwork.address
        );
        setContract(newContract);
      } catch (error) {
        console.error("Error initializing contract:", error);
        setError("Failed to initialize contract. Please try again later.");
        setLoading(false);
      }
    };
    initContract();
  }, []);

  // Store results in Supabase
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

        if (error) throw error;
        
        // Navigate to declared results after successful storage
        navigate('/declared-results');
      }
    } catch (error) {
      console.error("Error storing results:", error);
      setError("Failed to store voting results. Please try again later.");
    }
  };

  // Check voting status and update results
  useEffect(() => {
    let interval;
    
    const checkVotingStatus = async () => {
      if (!contract) return;

      try {
        const [votingStarted, votingEndedStatus, votingEndTime] = await Promise.all([
          contract.methods.votingStarted().call(),
          contract.methods.votingEnded().call(),
          contract.methods.votingEndTime().call()
        ]);
        
        const currentTime = Math.floor(Date.now() / 1000);
        const hasEnded = votingEndedStatus || (votingStarted && currentTime >= Number(votingEndTime));

        // Calculate time remaining
        if (!hasEnded && votingStarted) {
          const remainingSeconds = Number(votingEndTime) - currentTime;
          if (remainingSeconds > 0) {
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;
            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
          } else {
            setTimeRemaining(null);
          }
        } else {
          setTimeRemaining(null);
        }

        if (hasEnded && !votingEnded) {
          setVotingEnded(true);
          await storeResults();
          if (interval) clearInterval(interval);
          return;
        }

        if (!hasEnded) {
          // Update current results
          const candidateCount = await contract.methods.getCandidatesCount().call();
          const candidatesData = [];
          
          for (let i = 1; i <= candidateCount; i++) {
            const candidate = await contract.methods.getCandidate(i).call();
            candidatesData.push({
              id: i,
              name: candidate[0],
              voteCount: Number(candidate[1])
            });
          }
          
          candidatesData.sort((a, b) => Number(b.voteCount) - Number(a.voteCount));
          setCandidates(candidatesData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking voting status:", error);
        setError("Failed to check voting status. Please try again later.");
        setLoading(false);
      }
    };

    if (contract) {
      // Check immediately
      checkVotingStatus();
      // Then check every second to update the timer more smoothly
      interval = setInterval(checkVotingStatus, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [contract, votingEnded, navigate]);

  if (loading) {
    return (
      <div className="results-container">
        <h1>Loading Results...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <h1>Error</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar
        home="/"
        features="/#features"
        aboutus="/#aboutus"
        contactus="/#contactus"
      />
      <div className="results-container">
        <h1 className="results-title">Election Results</h1>
        {timeRemaining && (
          <div className="time-remaining">
            <h2>Time Remaining</h2>
            <div className="timer-display">{timeRemaining}</div>
          </div>
        )}
        
        {candidates.length > 0 && (
          <div className="winner-section">
            <h2 className="section-title">
              Current Leader{candidates.length > 1 && candidates[0].voteCount === candidates[1].voteCount ? 's (Tie)' : ''}
            </h2>
            {candidates.length > 1 && candidates[0].voteCount === candidates[1].voteCount ? (
              <div className="tied-leaders">
                {candidates.filter(c => c.voteCount === candidates[0].voteCount).map(leader => (
                  <div key={leader.id} className="winner-card">
                    <div className="winner-badge">🏆</div>
                    <h3 className="candidate-name">{leader.name}</h3>
                    <div className="vote-count">
                      <span className="vote-number">{leader.voteCount.toString()}</span>
                      <span className="vote-label">Votes</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="winner-card">
                <div className="winner-badge">🏆</div>
                <h3 className="candidate-name">{candidates[0].name}</h3>
                <div className="vote-count">
                  <span className="vote-number">{candidates[0].voteCount.toString()}</span>
                  <span className="vote-label">Votes</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="all-results">
          <h2 className="section-title">All Candidates</h2>
          <div className="candidates-grid">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="candidate-card">
                <div className="position-badge">#{index + 1}</div>
                <h3 className="candidate-name">{candidate.name}</h3>
                <div className="candidate-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Votes:</span>
                    <span className="stat-value">{candidate.voteCount.toString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Percentage:</span>
                    <span className="stat-value">
                      {candidates.reduce((sum, c) => sum + Number(c.voteCount), 0) > 0
                        ? ((Number(candidate.voteCount) / candidates.reduce((sum, c) => sum + Number(c.voteCount), 0)) * 100).toFixed(2)
                        : "0"}%
                    </span>
                  </div>
                  <div className="vote-bar">
                    <div 
                      className="vote-bar-fill"
                      style={{
                        width: `${candidates.reduce((sum, c) => sum + Number(c.voteCount), 0) > 0
                          ? ((Number(candidate.voteCount) / candidates.reduce((sum, c) => sum + Number(c.voteCount), 0)) * 100)
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
