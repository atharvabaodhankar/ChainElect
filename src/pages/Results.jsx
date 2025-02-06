import React, { useEffect, useState } from "react";
import Web3 from "web3";
import MyContract from "../../artifacts/contracts/MyContract.sol/MyContract.json";

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyContract.networks[networkId];
        const contract = new web3.eth.Contract(
          MyContract.abi,
          deployedNetwork && deployedNetwork.address
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
    <div className="results-container">
      <h1>Election Results</h1>
      
      {candidates.length > 0 ? (
        <div className="winner-section">
          <h2>Current Leader</h2>
          <div className="winner-card">
            <h3>{candidates[0].name}</h3>
            <p>Total Votes: {candidates[0].voteCount.toString()}</p>
          </div>
        </div>
      ) : null}

      <div className="all-results">
        <h2>All Candidates</h2>
        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <h3>{candidate.name}</h3>
              <p>Position: #{candidate.id}</p>
              <p>Total Votes: {candidate.voteCount.toString()}</p>
              <p>Percentage: {
                candidates.reduce((sum, c) => sum + Number(c.voteCount), 0) > 0
                  ? ((Number(candidate.voteCount) / candidates.reduce((sum, c) => sum + Number(c.voteCount), 0)) * 100).toFixed(2)
                  : "0"
              }%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
