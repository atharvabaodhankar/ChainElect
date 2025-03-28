import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractConfig from "../utils/contractConfig";

// Component for Web3 connection
const Web3Connection = ({ updateMetamaskId }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request connection to Polygon Amoy testnet
      const connectToPolygonAmoy = async () => {
        try {
          // First try to switch to the network
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
              setError("Failed to add Polygon Amoy network");
            }
          } else {
            console.error("Error switching to Polygon Amoy network:", switchError);
            setError("Failed to switch to Polygon Amoy network");
          }
        }

        // After network setup, connect account
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);
          await getBalance(accounts[0], web3Instance);
          
          // If updateMetamaskId callback is provided, update the parent component
          if (updateMetamaskId && typeof updateMetamaskId === 'function') {
            try {
              const balanceInWei = await web3Instance.eth.getBalance(accounts[0]);
              const balanceInEther = web3Instance.utils.fromWei(balanceInWei, "ether");
              updateMetamaskId(accounts[0], balanceInEther);
            } catch (balanceError) {
              console.error("Error getting balance:", balanceError);
              // Still update the metamask ID even if balance fails
              updateMetamaskId(accounts[0], "0");
            }
          }
        } catch (err) {
          console.error("User denied account access", err);
          setError("MetaMask connection denied");
        }
      };

      connectToPolygonAmoy();
    } else {
      console.error("MetaMask is not installed.");
      setError("MetaMask is not installed");
    }
  }, [updateMetamaskId]);

  // Function to get the balance of the account
  const getBalance = async (account, web3Instance) => {
    try {
      // Configure the request with higher gas settings to avoid RPC errors
      const balanceInWei = await web3Instance.eth.getBalance(account, "latest");
      const balanceInEther = web3Instance.utils.fromWei(balanceInWei, "ether");
      setBalance(balanceInEther);
      return balanceInEther;
    } catch (error) {
      console.error("Error getting balance:", error);
      setError("Failed to fetch balance");
      setBalance("0");
      return "0";
    }
  };

  useEffect(() => {
    // Network change handler
    if (window.ethereum) {
      const handleNetworkChange = (chainId) => {
        console.log("Network changed to:", chainId);
        // Check if it's the right network
        if (chainId !== contractConfig.polygonAmoy.chainHexId) {
          setError("Please switch to Polygon Amoy network");
        } else {
          setError(null);
        }
        // Refresh the page when network changes to update all components
        window.location.reload();
      };

      window.ethereum.on("chainChanged", handleNetworkChange);

      return () => {
        window.ethereum.removeListener("chainChanged", handleNetworkChange);
      };
    }
  }, []);

  return (
    <div>
      {error ? (
        <span title={error}>Error</span>
      ) : account ? (
        <span>{balance}</span>
      ) : (
        <span>0</span>
      )}
    </div>
  );
};

export default Web3Connection;
  