import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('voter_id'); // Check if voter_id exists

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
