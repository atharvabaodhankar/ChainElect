import React from 'react';
import { isIOSDevice, isAndroidDevice, openMetaMaskMobile } from '../utils/walletUtils';

/**
 * A component that provides clear, step-by-step guidance for connecting 
 * MetaMask on mobile devices
 */
const MobileWalletGuide = () => {
  const isIOS = isIOSDevice();
  const isAndroid = isAndroidDevice();
  
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
            <h4>Vote Securely</h4>
            <p>After connecting, you'll be able to cast your vote securely</p>
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
        </ul>
      </div>
    </div>
  );
};

export default MobileWalletGuide; 