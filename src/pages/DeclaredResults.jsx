import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Navbar from "../components/Navbar";

const DeclaredResults = () => {
  const [historicalResults, setHistoricalResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoricalResults = async () => {
      try {
        const { data, error } = await supabase
          .from('voting_results')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistoricalResults(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching historical results:", error);
        setError("Failed to fetch historical results. Please try again later.");
        setLoading(false);
      }
    };

    fetchHistoricalResults();
  }, []);

  const calculateVotePercentage = (votes, totalVotes) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  if (loading) {
    return (
      <>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        <div className="loading-state">
          <h2>Loading Historical Results...</h2>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
      <div className="declared-results-container">
        <h1 className="historical-results-title">Historical Election Results</h1>
        
        {historicalResults.length > 0 ? (
          <div className="historical-results-grid">
            {historicalResults.map((result, index) => {
              const totalVotes = result.candidates.reduce((sum, c) => sum + Number(c.votes), 0);
              
              return (
                <div key={index} className="historical-result-card">
                  <div className="election-date">
                    Election Date: {new Date(result.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="winner-section-declared">
                    <h3>Winner</h3>
                    <div className="winner-info">
                      <span className="winner-name">{result.winner_name}</span>
                      <span className="vote-count">
                        {result.winner_votes} votes
                        ({calculateVotePercentage(result.winner_votes, totalVotes).toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div className="candidates-list">
                    <h3>All Candidates</h3>
                    {result.candidates.map((candidate, idx) => (
                      <div key={idx} className="candidate-result">
                        <div className="candidate-info">
                          <span className="candidate-name">{candidate.name}</span>
                          <div className="vote-percentage-bar">
                            <div 
                              className="vote-percentage-fill"
                              style={{
                                width: `${calculateVotePercentage(candidate.votes, totalVotes)}%`
                              }}
                            />
                          </div>
                        </div>
                        <span className="candidate-votes">
                          {candidate.votes} votes
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">
            <p>No historical results available yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DeclaredResults; 