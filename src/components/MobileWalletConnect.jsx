import React, { useState, useEffect } from 'react';
import { 
  isMobileDevice, 
  openMetaMaskMobile, 
  checkWalletConnection,
  isMetaMaskBrowser,
  wasRedirectAttempted,
  clearRedirectAttempt
} from '../utils/walletUtils';
import MobileWalletGuide from './MobileWalletGuide';

/**
 * A component specifically designed for handling mobile wallet connections
 * Can be used in place of standard wallet buttons on mobile
 */
const MobileWalletConnect = ({ onConnect, buttonText, className }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [inMetaMaskBrowser, setInMetaMaskBrowser] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [redirectedFromMetaMask, setRedirectedFromMetaMask] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Check if on mobile device
    setIsMobile(isMobileDevice());
    
    // Check if we're already in MetaMask browser
    setInMetaMaskBrowser(isMetaMaskBrowser());
    
    // Check if we're returning from a MetaMask redirect
    if (wasRedirectAttempted()) {
      setRedirectedFromMetaMask(true);
      
      // Try to connect automatically after redirect
      const autoConnect = async () => {
        setIsConnecting(true);
        try {
          await handleConnectWallet();
        } finally {
          setIsConnecting(false);
          clearRedirectAttempt();
        }
      };
      
      autoConnect();
    }
    
    // Check if wallet is already connected
    const checkExistingConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletConnected(true);
            // Notify parent component
            if (onConnect && typeof onConnect === 'function') {
              onConnect(accounts[0]);
            }
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkExistingConnection();
  }, [onConnect]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);

    try {
      // If on mobile but not in MetaMask browser, open MetaMask app
      if (isMobile && !window.ethereum) {
        openMetaMaskMobile();
        return;
      }
      
      // Use our utility function to connect wallet
      const walletStatus = await checkWalletConnection();
      
      if (walletStatus.connected) {
        setWalletConnected(true);
        
        // Notify parent component about successful connection
        if (onConnect && typeof onConnect === 'function') {
          onConnect(walletStatus.accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Toggle showing the detailed guide
  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  // If not on mobile, don't render this component
  if (!isMobile) {
    return null;
  }

  return (
    <div className={`mobile-wallet-connect ${className || ''}`}>
      {inMetaMaskBrowser ? (
        walletConnected ? (
          <div className="wallet-connected-status">
            <span className="connected-indicator">✓</span>
            <span>Wallet Connected</span>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="connect-wallet-button"
          >
            {isConnecting ? 'Connecting...' : buttonText || 'Connect Wallet'}
          </button>
        )
      ) : (
        <>
          <div className="connect-options">
            <button
              onClick={() => openMetaMaskMobile()}
              className="open-metamask-button"
            >
              Open in MetaMask
            </button>
            
            <button 
              onClick={toggleGuide}
              className="show-guide-button"
            >
              {showGuide ? 'Hide Guide' : 'Need Help?'}
            </button>
          </div>
          
          {redirectedFromMetaMask && (
            <p className="redirect-note">
              If MetaMask didn't open, please install it first or try again.
            </p>
          )}
          
          {showGuide && <MobileWalletGuide />}
        </>
      )}
    </div>
  );
};

export default MobileWalletConnect; 