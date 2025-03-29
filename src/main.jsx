import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/mobile.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { applyMobileOptimizations } from './utils/walletUtils'

// Apply mobile optimizations immediately
applyMobileOptimizations();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
