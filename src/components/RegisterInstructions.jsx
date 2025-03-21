import React from 'react';

const RegisterInstructions = ({ onStart }) => {
  const handleStartClick = () => {
    // Scroll to top before starting registration
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Wait for scroll to complete before proceeding
    setTimeout(() => {
      onStart();
    }, 500);
  };

  return (
    <div className="register-instructions">
      <div className="instructions-content">
        <div className="instructions-header">
          <h2>Welcome to ChainElect</h2>
          <p>Follow these steps to complete your registration and secure your voting identity</p>
        </div>

        <div className="instructions-steps">
          <div className="instruction-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Prepare Your Environment</h3>
              <p>Find a well-lit area and ensure your face is clearly visible to your camera. Remove any face coverings or accessories that might obstruct your features.</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>MetaMask Setup</h3>
              <p>Install and set up MetaMask in your browser:</p>
              <ul className="metamask-steps">
                <li>Install MetaMask from <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="metamask-link">metamask.io/download</a></li>
                <li>Create a new wallet or import an existing one</li>
                <li>Keep your recovery phrase safe and secure</li>
                <li>Copy your MetaMask wallet address (it starts with 0x)</li>
              </ul>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Face Capture</h3>
              <p>Position your face within the frame and maintain a neutral expression. The system will capture your facial features for secure authentication.</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Verification</h3>
              <p>Your facial features will be securely stored and used for future authentication when you participate in elections.</p>
            </div>
          </div>
        </div>

        <div className="requirements-list">
          <h3>Requirements</h3>
          <ul>
            <li>Good lighting conditions</li>
            <li>Clear view of your face</li>
            <li>Neutral expression</li>
            <li>No face coverings or accessories</li>
            <li>Stable internet connection</li>
            <li>MetaMask wallet installed and configured</li>
          </ul>
        </div>

        <div className="important-notes">
          <h3>⚠️ Important Notes</h3>
          <ul>
            <li className="warning">Do NOT upload any photos of friends, relatives, or other people</li>
            <li className="warning">Do NOT upload a pre-existing photo of yourself</li>
            <li className="warning">Only use the live face capture feature for registration</li>
            <li>Your face data is encrypted and stored securely</li>
            <li>Keep your MetaMask recovery phrase and private keys safe</li>
          </ul>
        </div>

        <button className="start-registration-button" onClick={handleStartClick}>
          Start Registration
        </button>
      </div>
    </div>
  );
};

export default RegisterInstructions; 