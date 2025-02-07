import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import Voters from './pages/Voters';
import PrivateRoute from './components/PrivateRoute';
import Results from './pages/Results';
import Admin from './pages/Admin';
import VotersPage from './pages/VotersPage';

const App = () => {
  return (
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
  );
};

export default App;