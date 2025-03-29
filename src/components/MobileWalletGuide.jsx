import React from 'react';
import { isIOSDevice, isAndroidDevice, openMetaMaskMobile } from '../utils/walletUtils';
import contractConfig from '../utils/contractConfig';

/**
 * A component that provides clear, step-by-step guidance for connecting 
 * MetaMask on mobile devices
 */
const MobileWalletGuide = () => {
  const isIOS = isIOSDevice();
  const isAndroid = isAndroidDevice();
  
  // Create a ready-to-copy RPC URL
  const polygonAmoyRpc = contractConfig.polygonAmoy.rpcUrl;
  
  // Function to copy network details to clipboard
  const copyNetworkDetails = () => {
    const details = `
Network Name: ${contractConfig.polygonAmoy.chainName}
RPC URL: ${contractConfig.polygonAmoy.rpcUrl}
Chain ID: ${contractConfig.polygonAmoy.chainId}
Symbol: ${contractConfig.polygonAmoy.currencySymbol}
Block Explorer: ${contractConfig.polygonAmoy.blockExplorer}
    `.trim();
    
    navigator.clipboard.writeText(details)
      .then(() => alert('Network details copied to clipboard!'))
      .catch(err => console.error('Could not copy text: ', err));
  };
  
  return (
    <div className="mobile-wallet-guide">
      <h3>Connect with MetaMask Mobile</h3>
      
      <div className="guide-steps">
        <div className="guide-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Install MetaMask</h4>
            <p>
              {isIOS 
                ? "Download MetaMask from the App Store" 
                : isAndroid 
                  ? "Download MetaMask from Google Play" 
                  : "Download MetaMask from your app store"
              }
            </p>
            <a 
              href={isIOS 
                ? "https://apps.apple.com/us/app/metamask/id1438144202" 
                : "https://play.google.com/store/apps/details?id=io.metamask"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-button"
            >
              Download MetaMask
            </a>
          </div>
        </div>
        
        <div className="guide-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Open this site in MetaMask</h4>
            <p>Click the button below to open this site in the MetaMask browser</p>
            <button 
              onClick={openMetaMaskMobile}
              className="metamask-button"
            >
              Open in MetaMask
            </button>
          </div>
        </div>
        
        <div className="guide-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Connect Your Wallet</h4>
            <p>Once in the MetaMask browser, approve the connection request</p>
          </div>
        </div>
        
        <div className="guide-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h4>Add Polygon Amoy Network</h4>
            <p>You'll need to add the Polygon Amoy network to vote:</p>
            <ol className="network-steps">
              <li>In MetaMask, tap the network selector at the top</li>
              <li>Scroll down and tap "Add network"</li>
              <li>Tap "Add a network manually"</li>
              <li>Enter these details:
                <div className="network-details">
                  <div className="detail-row">
                    <span className="detail-label">Network Name:</span>
                    <span className="detail-value">{contractConfig.polygonAmoy.chainName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">RPC URL:</span>
                    <span className="detail-value">{polygonAmoyRpc}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Chain ID:</span>
                    <span className="detail-value">{contractConfig.polygonAmoy.chainId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Currency Symbol:</span>
                    <span className="detail-value">{contractConfig.polygonAmoy.currencySymbol}</span>
                  </div>
                </div>
                <button 
                  onClick={copyNetworkDetails} 
                  className="copy-details-button"
                >
                  Copy All Details
                </button>
              </li>
            </ol>
          </div>
        </div>
        
        <div className="guide-step">
          <div className="step-number">5</div>
          <div className="step-content">
            <h4>Vote Securely</h4>
            <p>After connecting and adding the network, you'll be able to cast your vote securely</p>
          </div>
        </div>
      </div>
      
      <div className="guide-troubleshooting">
        <h4>Having trouble?</h4>
        <ul>
          <li>Make sure you have MetaMask installed and set up</li>
          <li>If MetaMask doesn't open, try copying the URL and pasting it in MetaMask's browser</li>
          <li>Make sure you have an account set up in MetaMask</li>
          <li>If you're already in the MetaMask browser, simply tap "Connect" instead</li>
          <li>If adding the network fails, try adding it manually using the details above</li>
        </ul>
      </div>
    </div>
  );
};

export default MobileWalletGuide; 