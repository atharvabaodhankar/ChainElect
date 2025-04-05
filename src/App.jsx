import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import Voters from './pages/Voters';
import PrivateRoute from './components/PrivateRoute';
import Results from './pages/Results';
import Admin from './pages/Admin';
import Preloader from './components/Preloader';
import DeclaredResults from './pages/DeclaredResults';
import VotingStatusRoute from './components/VotingStatusRoute';
import VotingRevolution from './pages/VotingRevolution';
import HowItWorks from './pages/HowItWorks';
import MobileMetaMaskGuide from './components/MobileMetaMaskGuide';
import { isMobile, isMetaMaskBrowser } from './utils/mobileDetection';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showMobileGuide, setShowMobileGuide] = useState(false);

  useEffect(() => {
    // Check if mobile guide should be shown (on mobile but not in MetaMask browser)
    if (isMobile() && !isMetaMaskBrowser()) {
      setShowMobileGuide(true);
    } else {
      setShowMobileGuide(false);
    }

    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 3500); // This should be slightly longer than the preloader animation duration
  }, []);

  if (loading) {
    return <Preloader />;
  }

  // If on mobile and not using MetaMask browser, show the guide
  if (showMobileGuide) {
    return <MobileMetaMaskGuide />;
  }

  // Otherwise show the main app
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/voting-revolution" element={<VotingRevolution />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route
        path="/results"
        element={
          <VotingStatusRoute>
            <Results />
          </VotingStatusRoute>
        }
      />
      <Route path="/admin" element={<Admin />} />
      <Route path="/declared-results" element={<DeclaredResults />} />
      <Route
        path="/voters"
        element={
          <PrivateRoute>
            <Voters />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;