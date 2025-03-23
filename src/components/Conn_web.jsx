import React, { useEffect, useState } from "react";
import Web3 from "web3";

// Component for Web3 connection
const Web3Connection = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const setupNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xaa36a7',  // 11155111 in hex
          chainName: 'Sepolia Test Network',
          nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'SEP',
            decimals: 18
          },
          rpcUrls: ['https://sepolia.infura.io/v3/c9ce36a11fef47d3b611df8773fa71b1'],
          blockExplorerUrls: ['https://sepolia.etherscan.io/']
        }]
      });
    } catch (error) {
      console.error('Error setting up network:', error);
    }
  };

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

      // Setup Sepolia network
      setupNetwork();
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
        if (chainId !== '0xaa36a7') { // If not Sepolia
          setupNetwork();
        }
      };

      window.ethereum.on("chainChanged", handleNetworkChange);

      return () => {
        window.ethereum.removeListener("chainChanged", handleNetworkChange);
      };
    }
  }, []);

  return (
    <div>
      {account ? (
        <span>{balance}</span>
      ) : (
        <span>0</span>
      )}
    </div>
  );
};

export default Web3Connection;
  