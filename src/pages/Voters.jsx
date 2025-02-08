import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Conn_web from "../components/Conn_web";
import Web3 from "web3";
import MyContract from "../../artifacts/contracts/MyContract.sol/MyContract.json";

const Voters = () => {
  const [candidates, setCandidates] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

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
        const remainingTime = await contract.methods.getRemainingTime().call();

        if (!votingStarted) {
          setMessage("Voting has not started yet. Please wait for the admin to start the voting.");
          return;
        }

        if (votingEnded || remainingTime === "0") {
          setMessage("Voting has ended. Please check the results page.");
          navigate("/results");
          return;
        }

        // Set up timer to check remaining time
        const timer = setInterval(async () => {
          const timeLeft = await contract.methods.getRemainingTime().call();
          if (timeLeft === "0") {
            setMessage("Voting has ended. Please check the results page.");
            navigate("/results");
            clearInterval(timer);
          }
        }, 60000); // Check every minute

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

        // Clean up timer on unmount
        return () => clearInterval(timer);
      } catch (error) {
        console.error("Error fetching candidates: ", error);
        setErrorMessage("Failed to fetch candidates.");
      }
    };

    fetchCandidates();
  }, [navigate]);

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

  // Callback function to update userInfo with the latest Metamask ID
  const updateMetamaskId = (newMetamaskId) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      metamask_id: newMetamaskId,
    }));
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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {userInfo && (
          <div>
            <h2>User Information</h2>
            <p>Voter ID: {userInfo.voter_id}</p>
            <p>Metamask ID: {userInfo.metamask_id}</p>
          </div>
        )}
        <Conn_web updateMetamaskId={updateMetamaskId} />
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        <h1>Vote for Your Favorite Candidate</h1>
        <div className="candidates-container">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-box">
              <h2>{candidate.name}</h2>
              <p>Index: {candidate.id}</p>
              <p>Votes: {candidate.votes.toString()}</p>
              <button onClick={() => handleVote(candidate.id)}>Vote Now</button>
            </div>
          ))}
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Voters;
