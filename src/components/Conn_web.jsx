import React, { useEffect, useState } from "react";
import Web3 from "web3";

// Component for Web3 connection
const Web3Connection = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request access to user's MetaMask account
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);
          getBalance(accounts[0], web3Instance);
        })
        .catch((err) => console.error("User denied account access", err));
    } else {
      console.error("MetaMask is not installed.");
    }
  }, []);

  // Function to get the balance of the account
  const getBalance = async (account, web3Instance) => {
    const balanceInWei = await web3Instance.eth.getBalance(account);
    const balanceInEther = web3Instance.utils.fromWei(balanceInWei, "ether");
    setBalance(balanceInEther);
  };

  useEffect(() => {
    // Network change handler
    if (window.ethereum) {
      const handleNetworkChange = (chainId) => {
        console.log("Network changed to:", chainId);
      };

      window.ethereum.on("chainChanged", handleNetworkChange);

      return () => {
        window.ethereum.removeListener("chainChanged", handleNetworkChange);
      };
    }
  }, []);

  return (
    <div>
      <h1>Web3 Connection</h1>
      {account ? (
        <div>
          <p>Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      ) : (
        <p>Please connect to MetaMask.</p>
      )}
    </div>
  );
};

export default Web3Connection;
  