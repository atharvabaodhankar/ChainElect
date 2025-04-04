import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';

// Initialize i18next
i18n
  // Use backend for loading translations from server (optional)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize
  .init({
    // Default language
    fallbackLng: 'en',
    // Debug mode (remove in production)
    debug: process.env.NODE_ENV === 'development',
    // Resources contain translations
    resources: {
      en: {
        translation: enTranslation
      },
      hi: {
        translation: hiTranslation
      },
      mr: {
        translation: mrTranslation
      }
    },
    // Configuration options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      // Detection order - try localStorage first (for returning users), 
      // then navigator (for new users), then location/subdomain, then cookie
      order: ['localStorage', 'navigator', 'querystring', 'cookie', 'sessionStorage'],
      // Only cache in localStorage for persistence
      caches: ['localStorage'],
      // Look for specific languages in navigator.languages
      lookupFromNavigatorLanguage: true,
      // Check if navigator.languages contains our supported languages
      checkWhitelist: true,
      // Handle language mapping (e.g., 'en-US' -> 'en')
      convertDetectedLanguage: (lng) => {
        // Map language codes to our supported ones
        if (lng.startsWith('en')) return 'en';
        if (lng.startsWith('hi')) return 'hi';
        if (lng.startsWith('mr') || lng.startsWith('ma')) return 'mr'; // 'ma' is sometimes used for Marathi
        return lng;
      }
    },
    react: {
      useSuspense: true,
    }
  });

// Export for debugging purposes
export const detectUserLanguage = () => {
  // Get user's browser language
  const browserLang = navigator.language || navigator.userLanguage;
  console.log('Detected browser language:', browserLang);
  
  // Determine which of our supported languages to use
  if (browserLang.startsWith('hi')) return 'hi';
  if (browserLang.startsWith('mr') || browserLang.startsWith('ma')) return 'mr';
  return 'en'; // Default to English
};

export default i18n; 