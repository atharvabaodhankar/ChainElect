import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import contractConfig from '../utils/contractConfig';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const navigate = useNavigate();

  // Function to add Polygon Amoy Testnet network
  const addPolygonAmoyNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: contractConfig.polygonAmoy.chainHexId,
          chainName: contractConfig.polygonAmoy.chainName,
          nativeCurrency: {
            name: contractConfig.polygonAmoy.currencyName,
            symbol: contractConfig.polygonAmoy.currencySymbol,
            decimals: 18
          },
          rpcUrls: [contractConfig.polygonAmoy.rpcUrl],
          blockExplorerUrls: [contractConfig.polygonAmoy.blockExplorer]
        }]
      });
    } catch (error) {
      console.error('Error adding network:', error);
      setErrorMessage('Failed to add Polygon Amoy Testnet network. Please try again.');
    }
  };

  // Check if Metamask is installed and connected
  useEffect(() => {
    const checkMetamask = async () => {
      if (window.ethereum) {
        setIsMetamaskInstalled(true);
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setIsMetamaskConnected(accounts.length > 0);
        } catch (error) {
          console.error('Error checking Metamask connection:', error);
        }
      } else {
        setIsMetamaskInstalled(false);
      }
    };

    checkMetamask();
  }, []);

  // Function to connect Metamask
  const connectMetamask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsMetamaskConnected(true);
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
      setErrorMessage('Failed to connect to Metamask. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if Metamask is connected before proceeding
    if (!isMetamaskConnected) {
      setErrorMessage('Please connect your Metamask wallet before logging in.');
      return;
    }
    
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Get the current account
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const currentAccount = accounts[0];

      const { success, data } = await apiRequest(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password,
          metamask_id: currentAccount // Send the Metamask account with the login request
        }),
      });

      if (success) {
        localStorage.setItem('voter_id', data.voter.voter_id);
        localStorage.setItem('voter_data', JSON.stringify(data.voter));
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
          
          {/* Metamask Connection Status */}
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
