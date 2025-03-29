import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileWalletConnect from '../components/MobileWalletConnect';
import contractConfig from '../utils/contractConfig';
import { API_ENDPOINTS, apiRequest } from '../utils/api';
import { 
  checkWalletConnection, 
  isMobileDevice, 
  openMetaMaskMobile,
  switchToNetwork,
  wasRedirectAttempted,
  clearRedirectAttempt
} from "../utils/walletUtils";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're returning from a MetaMask redirect
    if (wasRedirectAttempted()) {
      // Try to connect automatically after redirect
      const autoConnect = async () => {
        try {
          const walletStatus = await checkWalletConnection();
          if (walletStatus.connected) {
            setIsMetamaskConnected(true);
            setCurrentAccount(walletStatus.accounts[0]);
            
            // Try to add network
            await addPolygonAmoyNetwork();
          }
        } finally {
          clearRedirectAttempt();
        }
      };
      
      autoConnect();
    }
  }, []);

  // Function to add Polygon Amoy Testnet network
  const addPolygonAmoyNetwork = async () => {
    try {
      const networkDetails = {
        chainName: contractConfig.polygonAmoy.chainName,
        nativeCurrency: {
          name: contractConfig.polygonAmoy.currencyName,
          symbol: contractConfig.polygonAmoy.currencySymbol,
          decimals: 18
        },
        rpcUrls: [contractConfig.polygonAmoy.rpcUrl],
        blockExplorerUrls: [contractConfig.polygonAmoy.blockExplorer]
      };
      
      const result = await switchToNetwork(
        contractConfig.polygonAmoy.chainHexId, 
        networkDetails
      );
      
      if (!result.success) {
        // Handle the error based on the device type
        if (result.isMobile) {
          setErrorMessage('To add Polygon Amoy network on mobile, please use the MetaMask app settings or try again.');
        } else {
          setErrorMessage('Failed to add Polygon Amoy Testnet network. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error adding network:', error);
      setErrorMessage('Failed to add Polygon Amoy Testnet network. Please try again.');
    }
  };

  // Check if Metamask is installed and connected
  useEffect(() => {
    const checkWalletStatus = async () => {
      // Check if on mobile
      const mobileDevice = isMobileDevice();
      setIsMobile(mobileDevice);
      
      // Use our new utility function
      const walletStatus = await checkWalletConnection();
      
      if (walletStatus.connected) {
        setIsMetamaskInstalled(true);
        setIsMetamaskConnected(true);
        setCurrentAccount(walletStatus.accounts[0]);
      } else if (window.ethereum) {
        setIsMetamaskInstalled(true);
        setIsMetamaskConnected(false);
      } else {
        setIsMetamaskInstalled(false);
        setIsMetamaskConnected(false);
      }
    };

    checkWalletStatus();
  }, []);

  // Function to connect Metamask
  const connectMetamask = async () => {
    try {
      if (isMobile && !window.ethereum) {
        // On mobile without MetaMask browser, open MetaMask app
        openMetaMaskMobile();
        return;
      }
      
      // Normal desktop/in-app connection flow
      const walletStatus = await checkWalletConnection();
      if (walletStatus.connected) {
        setIsMetamaskConnected(true);
        setCurrentAccount(walletStatus.accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
      setErrorMessage('Failed to connect to Metamask. Please try again.');
    }
  };

  // Handle wallet connection from the MobileWalletConnect component
  const handleWalletConnect = (account) => {
    setIsMetamaskConnected(true);
    setCurrentAccount(account);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if Metamask is connected before proceeding
    if (!isMetamaskConnected) {
      setErrorMessage('Please connect your wallet before logging in.');
      return;
    }
    
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Get the current account
      const metamaskId = currentAccount || (await window.ethereum.request({ method: 'eth_accounts' }))[0];

      const { success, data } = await apiRequest(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password,
          metamask_id: metamaskId // Send the Metamask account with the login request
        }),
      });

      if (success) {
        localStorage.setItem('voter_id', data.voter_id);
        localStorage.setItem('token', data.token);
        navigate('/voters');
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Enter your credentials to access your account</p>
          </div>
          
          {/* Metamask Connection Status - Show for desktop or when no mobile component exists */}
          {!isMobile ? (
            <div className="metamask-status">
              {!isMetamaskInstalled ? (
                <div className="metamask-warning">
                  <p>MetaMask is not installed. Please install MetaMask to proceed.</p>
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="metamask-install-button"
                  >
                    Install MetaMask
                  </a>
                </div>
              ) : !isMetamaskConnected ? (
                <div className="metamask-connect">
                  <p>Please connect your MetaMask wallet to proceed with login.</p>
                  <button 
                    onClick={connectMetamask} 
                    className="metamask-connect-button"
                  >
                    Connect MetaMask
                  </button>
                  <button 
                    onClick={addPolygonAmoyNetwork} 
                    className="metamask-network-button"
                  >
                    Add Polygon Amoy Testnet
                  </button>
                </div>
              ) : (
                <div className="metamask-connected">
                  <p className="connected-status">✓ MetaMask Connected</p>
                  <button 
                    onClick={addPolygonAmoyNetwork} 
                    className="metamask-network-button"
                  >
                    Add Polygon Amoy Testnet
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Mobile-specific wallet connection component
            <MobileWalletConnect 
              onConnect={handleWalletConnect} 
              buttonText="Connect Wallet to Login"
              className="login-mobile-wallet"
            />
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="error-container">
                <p className="error-message">{errorMessage}</p>
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !isMetamaskConnected}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="login-footer">
              <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
