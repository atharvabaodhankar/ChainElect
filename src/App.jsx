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

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 3500); // This should be slightly longer than the preloader animation duration
  }, []);

  return (
    <>
      {loading && <Preloader />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
    </>
  );
};

export default App;