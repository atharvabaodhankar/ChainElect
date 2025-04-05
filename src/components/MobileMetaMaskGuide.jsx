import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { openInMetaMask } from '../utils/mobileDetection';

const MobileLanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Available languages
  const languages = [
    { code: 'en', name: t('languageSelector.english') },
    { code: 'hi', name: t('languageSelector.hindi') },
    { code: 'mr', name: t('languageSelector.marathi') }
  ];

  // Get current language name
  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    return currentLang ? currentLang.name : languages[0].name;
  };

  // Change language handler
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    // Save to localStorage
    localStorage.setItem('i18nextLng', code);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mobile-language-selector" ref={dropdownRef}>
      <button 
        className="mobile-language-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={t('languageSelector.language')}
      >
        <span className="language-icon">🌐</span>
        <span className="current-language">{getCurrentLanguageName()}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <ul className="mobile-language-dropdown">
          {languages.map((language) => (
            <li key={language.code}>
              <button
                className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
                onClick={() => changeLanguage(language.code)}
              >
                {language.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MobileMetaMaskGuide = () => {
  const { t } = useTranslation();

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
          <h1>{t('mobileGuide.title')}</h1>
          <p>{t('mobileGuide.subtitle')}</p>
        </div>
        
        <MobileLanguageSelector />
        
        <div className="guide-steps-container">
          <div className="guide-step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>{t('mobileGuide.step1.title')}</h3>
              <p>{t('mobileGuide.step1.description')}</p>
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
                {t('mobileGuide.step1.button')}
              </a>
            </div>
          </div>
          
          <div className="guide-step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>{t('mobileGuide.step2.title')}</h3>
              <p>{t('mobileGuide.step2.description')}</p>
              <button 
                onClick={openInMetaMask}
                className="metamask-action-button open-button"
              >
                <svg className="open-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('mobileGuide.step2.button')}
              </button>
            </div>
          </div>
          
          <div className="guide-step-card video-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>{t('mobileGuide.step3.title')}</h3>
              <p>{t('mobileGuide.step3.description')}</p>
              <div className="step-video-container">
                <video 
                  className="guide-video" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src="/images/hero.mp4" type="video/mp4" />
                  {t('mobileGuide.step3.videoFallback')}
                </video>
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
          <p>{t('mobileGuide.securityNote')}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMetaMaskGuide; 