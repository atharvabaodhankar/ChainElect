import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSelector.css';
import { detectUserLanguage } from '../i18n/i18n';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Available languages
  const languages = [
    { code: 'en', name: t('languageSelector.english') },
    { code: 'hi', name: t('languageSelector.hindi') },
    { code: 'mr', name: t('languageSelector.marathi') }
  ];

  // Apply language detection on initial load
  useEffect(() => {
    // Only apply auto-detection if no language is already set in localStorage
    const storedLang = localStorage.getItem('i18nextLng');
    if (!storedLang || storedLang.startsWith('en-') || storedLang.startsWith('hi-') || storedLang.startsWith('mr-')) {
      // Detect preferred language
      const detectedLang = detectUserLanguage();
      
      // Only change if it's different from current
      if (i18n.language !== detectedLang) {
        console.log('Auto-detected language:', detectedLang);
        i18n.changeLanguage(detectedLang);
        localStorage.setItem('i18nextLng', detectedLang);
      }
    }
  }, [i18n]);

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
    <div className="language-selector" ref={dropdownRef}>
      <button 
        className="language-selector-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={t('languageSelector.language')}
      >
        <span className="language-icon">🌐</span>
        <span className="current-language">{getCurrentLanguageName()}</span>
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <ul className="language-dropdown">
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

export default LanguageSelector; 