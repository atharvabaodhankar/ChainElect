import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// Import our i18n configuration
import './i18n/i18n.js'

// Simple loading component for i18n initialization
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem',
    fontFamily: 'sans-serif',
    color: '#333'
  }}>
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⚙️</span>
      </div>
      <div>Loading...</div>
    </div>
  </div>
);

// Add a simple spinning animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </BrowserRouter>
);
