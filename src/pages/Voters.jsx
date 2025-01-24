import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Conn_web from "../components/conn_web";
import Web3 from "web3";

const Voters = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Alice Johnson", votes: 0 },
    { id: 2, name: "Bob Smith", votes: 0 },
    { id: 3, name: "Charlie Brown", votes: 0 },
    { id: 4, name: "Diana Prince", votes: 0 },
  ]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleLogout);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleLogout);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const voterId = localStorage.getItem("voter_id");
      try {
        const response = await fetch(`http://localhost:3000/voters/${voterId}`);
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const voterId = localStorage.getItem("voter_id");
      try {
        const response = await fetch(`http://localhost:3000/voters/${voterId}`);
        const data = await response.json();
        setUserInfo(data);

        // Fetch current Metamask ID
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          const currentMetamaskId = accounts[0];

          // Compare Metamask IDs
          if (currentMetamaskId !== data.metamask_id) {
            setErrorMessage("Metamask ID does not match");
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

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

  return (
    <div>
      <Navbar
        home="/"
        features="/#features"
        aboutus="/#aboutus"
        contactus="/#contactus"
      />
      <div className="voters-page">
        <h1>Voters Page</h1>
        <p>Welcome to the Voters page.</p>
        {userInfo && (
          <div>
            <h2>User Information</h2>
            <p>Voter ID: {userInfo.voter_id}</p>
            <p>Metamask ID: {userInfo.metamask_id}</p>
          </div>
        )}
        <Conn_web />
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
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
    </div>
  );
};

export default Voters;
