import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = document.cookie.split(';').some((item) => item.trim().startsWith('authToken='));

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
