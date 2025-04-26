import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import contractConfig from '../utils/contractConfig';
import { API_ENDPOINTS, apiRequest } from '../utils/api';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const navigate = useNavigate();

  // Function to check if we're on the Polygon Amoy network
  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsCorrectNetwork(chainId === contractConfig.polygonAmoy.chainHexId);
    } catch (error) {
      console.error('Error checking network:', error);
      setIsCorrectNetwork(false);
    }
  };

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
      await checkNetwork();
    } catch (error) {
      console.error('Error adding network:', error);
      setErrorMessage(t('login.networkError'));
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
          if (accounts.length > 0) {
            await checkNetwork();
          }

          // Listen for network changes
          window.ethereum.on('chainChanged', checkNetwork);
        } catch (error) {
          console.error('Error checking Metamask connection:', error);
        }
      } else {
        setIsMetamaskInstalled(false);
      }
    };

    checkMetamask();

    // Cleanup listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
      }
    };
  }, []);

  // Function to connect Metamask
  const connectMetamask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsMetamaskConnected(true);
      await checkNetwork();
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
      setErrorMessage(t('login.metamaskConnectionError'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if Metamask is connected before proceeding
    if (!isMetamaskConnected) {
      setErrorMessage(t('login.connectMetamaskFirst'));
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
        setErrorMessage(data.message || t('login.loginFailed'));
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(t('common.error'));
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
            <h1>{t('login.welcomeBack')}</h1>
            <p>{t('login.enterCredentials')}</p>
          </div>
          
          {/* Metamask Connection Status */}
          <div className="metamask-status">
            {!isMetamaskInstalled ? (
              <div className="metamask-warning">
                <p>{t('login.metamaskNotInstalled')}</p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="metamask-install-button"
                >
                  {t('login.installMetamask')}
                </a>
              </div>
            ) : !isMetamaskConnected ? (
              <div className="metamask-warning">
                <p>{t('login.metamaskNotConnected')}</p>
                <button 
                  onClick={connectMetamask}
                  className="metamask-connect-button"
                >
                  {t('login.connectMetamask')}
                </button>
              </div>
            ) : (
              <div className="metamask-connected">
                <p>{t('login.metamaskConnected')}</p>
                {!isCorrectNetwork ? (
                  <button 
                    onClick={addPolygonAmoyNetwork}
                    className="metamask-network-button"
                  >
                    {t('login.switchToAmoy')}
                  </button>
                ) : (
                  <p className="network-status-success">✓ {t('login.connectedToAmoy')}</p>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t('login.email')}</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('login.password')}</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
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
              {isLoading ? t('login.loggingIn') : t('login.submit')}
            </button>

            <div className="login-footer">
              <p>{t('login.noAccount')} <a href="/register">{t('login.register')}</a></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
