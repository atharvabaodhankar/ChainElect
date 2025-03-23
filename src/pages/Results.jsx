import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config/contract";
import Navbar from "../components/Navbar";

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const web3 = new Web3(window.ethereum || "http://localhost:8545");
        const contract = new web3.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );

        // Fetch all candidates
        const candidateCount = await contract.methods.getCandidatesCount().call();
        const candidatesData = [];
        
        for (let i = 1; i <= candidateCount; i++) {
          const candidate = await contract.methods.getCandidate(i).call();
          candidatesData.push({
            id: i,
            name: candidate[0],
            voteCount: candidate[1]
          });
        }
        
        // Sort candidates by vote count in descending order
        candidatesData.sort((a, b) => Number(b.voteCount) - Number(a.voteCount));
        
        setCandidates(candidatesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Failed to fetch voting results. Please try again later.");
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

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
