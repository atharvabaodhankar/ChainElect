import React, { useState } from "react";
// import "./VotersPage.css";

const VotersPage = () => {
  // Sample candidates data (replace with actual data later)
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Alice Johnson", votes: 0 },
    { id: 2, name: "Bob Smith", votes: 0 },
    { id: 3, name: "Charlie Brown", votes: 0 },
    { id: 4, name: "Diana Prince", votes: 0 },
  ]);

  // Function to handle voting
  const handleVote = (id) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.id === id
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );
  };

  return (
    <div className="voters-page">
      <h1>Vote for Your Favorite Candidate</h1>
      <div className="candidates-container">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-box">
            <h2>{candidate.name}</h2>
            <p>Index: {candidate.id}</p>
            <p>Votes: {candidate.votes}</p>
            <button onClick={() => handleVote(candidate.id)}>Add Vote</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotersPage;
