import React, { useState, useEffect } from 'react';
import { QRCode } from 'qrcode.react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import './Conn_web.css';

const Web3Connection = ({ onConnect }) => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  const connectWithWalletConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          80001: "https://rpc-mumbai.maticvigil.com"
        },
        qrcode: true,
        qrcodeModalOptions: {
          mobileWallets: [
            {
              id: 'metamask',
              name: 'MetaMask',
              links: {
                native: 'metamask://',
                universal: 'https://metamask.app.link'
              }
            },
            {
              id: 'trust',
              name: 'Trust Wallet',
              links: {
                native: 'trust://',
                universal: 'https://trustwallet.com'
              }
            },
            {
              id: 'rainbow',
              name: 'Rainbow',
              links: {
                native: 'rainbow://',
                universal: 'https://rainbow.me'
              }
            }
          ]
        }
      });

      await provider.enable();
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      setBalance(ethers.utils.formatEther(balance));
      
      onConnect(provider);
    } catch (err) {
      setError('Failed to connect with WalletConnect: ' + err.message);
    }
  };

  const connectWithMetaMask = async () => {
    try {
      if (!window.ethereum) {
        if (isMobile) {
          setShowInstructions(true);
          return;
        }
        setError('Please install MetaMask to use this feature');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x13881') { // Mumbai testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
          });
        } catch (switchError) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x13881',
                chainName: 'Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/']
              }]
            });
          }
          throw switchError;
        }
      }

      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      setBalance(ethers.utils.formatEther(balance));

      onConnect(window.ethereum);
    } catch (err) {
      setError('Failed to connect with MetaMask: ' + err.message);
    }
  };

  const openMetaMaskMobile = () => {
    window.location.href = 'metamask://';
  };

  const getBalance = async (provider, address) => {
    try {
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('Error getting balance:', err);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        if (accounts[0]) {
          getBalance(window.ethereum, accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="wallet-connect-container">
      {!account ? (
        <div className="wallet-connect-options">
          <button 
            className="wallet-option-button metamask-button"
            onClick={connectWithMetaMask}
          >
            {isMobile ? 'Open in MetaMask Mobile' : 'Connect with MetaMask'}
          </button>
          
          <button 
            className="wallet-option-button walletconnect-button"
            onClick={() => setShowWalletConnect(true)}
          >
            Connect with Mobile Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-connected">
          <p>Connected Account: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <p>Balance: {parseFloat(balance).toFixed(4)} MATIC</p>
        </div>
      )}

      {error && <div className="wallet-error">{error}</div>}

      {showWalletConnect && (
        <div className="wallet-connect-modal">
          <div className="modal-content">
            <h3>Connect Your Mobile Wallet</h3>
            <p>Scan this QR code with your mobile wallet to connect</p>
            <div className="qr-code-container">
              <QRCode 
                value={window.location.href} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="supported-wallets">
              <p>Supported Wallets:</p>
              <ul>
                <li>MetaMask Mobile</li>
                <li>Trust Wallet</li>
                <li>Rainbow</li>
              </ul>
            </div>
            <button 
              className="close-modal-button"
              onClick={() => setShowWalletConnect(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="wallet-connect-modal">
          <div className="modal-content">
            <h3>How to Connect on Mobile</h3>
            <div className="mobile-instructions">
              <ol>
                <li>Install MetaMask Mobile from your app store</li>
                <li>Open MetaMask Mobile</li>
                <li>Go to Settings → Browser</li>
                <li>Enter our website URL</li>
                <li>Connect your wallet when prompted</li>
              </ol>
            </div>
            <div className="instruction-buttons">
              <button 
                className="wallet-option-button metamask-button"
                onClick={openMetaMaskMobile}
              >
                Open MetaMask Mobile
              </button>
              <button 
                className="close-modal-button"
                onClick={() => setShowInstructions(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Web3Connection;
  