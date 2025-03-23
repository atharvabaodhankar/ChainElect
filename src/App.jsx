import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Voters from './pages/Voters.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Results from './pages/Results.jsx';
import Admin from './pages/Admin.jsx';
import VotersPage from './pages/VotersPage.jsx';
import Preloader from './components/Preloader.jsx';

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
        <Route path="/voterspage" element={<VotersPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin" element={<Admin />} />
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