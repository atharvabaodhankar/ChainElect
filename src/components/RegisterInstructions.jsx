import React from 'react';
import { useTranslation } from 'react-i18next';

const RegisterInstructions = ({ onStart }) => {
  const { t } = useTranslation();
  
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
          <h2>{t('registerInstructions.welcome')}</h2>
          <p>{t('registerInstructions.followSteps')}</p>
        </div>

        <div className="instructions-steps">
          <div className="instruction-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>{t('registerInstructions.prepareEnvironment.title')}</h3>
              <p>{t('registerInstructions.prepareEnvironment.description')}</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>{t('registerInstructions.metamaskSetup.title')}</h3>
              <p>{t('registerInstructions.metamaskSetup.description')}</p>
              <ul className="metamask-steps">
                <li>{t('registerInstructions.metamaskSetup.step1')} <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="metamask-link">metamask.io/download</a></li>
                <li>{t('registerInstructions.metamaskSetup.step2')}</li>
                <li>{t('registerInstructions.metamaskSetup.step3')}</li>
                <li>{t('registerInstructions.metamaskSetup.step4')}</li>
              </ul>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>{t('registerInstructions.faceCapture.title')}</h3>
              <p>{t('registerInstructions.faceCapture.description')}</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>{t('registerInstructions.verification.title')}</h3>
              <p>{t('registerInstructions.verification.description')}</p>
            </div>
          </div>
        </div>

        <div className="requirements-list">
          <h3>{t('registerInstructions.requirements.title')}</h3>
          <ul>
            <li>{t('registerInstructions.requirements.lighting')}</li>
            <li>{t('registerInstructions.requirements.clearView')}</li>
            <li>{t('registerInstructions.requirements.neutralExpression')}</li>
            <li>{t('registerInstructions.requirements.noFaceCoverings')}</li>
            <li>{t('registerInstructions.requirements.stableInternet')}</li>
            <li>{t('registerInstructions.requirements.metamaskWallet')}</li>
          </ul>
        </div>

        <div className="important-notes">
          <h3>{t('registerInstructions.importantNotes.title')}</h3>
          <ul>
            <li className="warning">{t('registerInstructions.importantNotes.warning1')}</li>
            <li className="warning">{t('registerInstructions.importantNotes.warning2')}</li>
            <li className="warning">{t('registerInstructions.importantNotes.warning3')}</li>
            <li>{t('registerInstructions.importantNotes.note1')}</li>
            <li>{t('registerInstructions.importantNotes.note2')}</li>
          </ul>
        </div>

        <button className="start-registration-button" onClick={handleStartClick}>
          {t('registerInstructions.startButton')}
        </button>
      </div>
    </div>
  );
};

export default RegisterInstructions; 