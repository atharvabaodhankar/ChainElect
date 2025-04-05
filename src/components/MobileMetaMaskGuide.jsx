import React from 'react';
import { openInMetaMask } from '../utils/mobileDetection';

const MobileMetaMaskGuide = () => {
  return (
    <div className="mobile-metamask-guide">
      <div className="metamask-guide-container">
        <div className="metamask-guide-header">
          <div className="metamask-logo-container">
            <img 
              src="/images/metamask-fox.svg" 
              alt="MetaMask Fox" 
              className="metamask-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg";
              }}
            />
          </div>
          <h1>Mobile Setup Required</h1>
          <p>To access all features and connect to the blockchain securely</p>
        </div>
        
        <div className="guide-steps-container">
          <div className="guide-step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Install MetaMask</h3>
              <p>Download the official MetaMask mobile app from your app store</p>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="metamask-action-button install-button"
              >
                <svg className="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 13L12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download MetaMask
              </a>
            </div>
          </div>
          
          <div className="guide-step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Open in MetaMask Browser</h3>
              <p>Launch this site securely in the MetaMask mobile browser</p>
              <button 
                onClick={openInMetaMask}
                className="metamask-action-button open-button"
              >
                <svg className="open-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Open in MetaMask
              </button>
            </div>
          </div>
          
          <div className="guide-step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Connect Your Wallet</h3>
              <p>Once in the MetaMask browser, connect your wallet when prompted</p>
              <div className="connect-visual">
                <svg className="connect-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="guide-security-note">
          <svg className="security-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>For security reasons, blockchain interactions on mobile devices require MetaMask.</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMetaMaskGuide; 