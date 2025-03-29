// API Utility for handling backend requests

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Authentication endpoints
export const API_ENDPOINTS = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  logout: `${API_URL}/auth/logout`,
  getVoter: (voterId) => `${API_URL}/voters/${voterId}`,
  updateMetamask: (voterId) => `${API_URL}/voters/update-metamask/${voterId}`,
};

// Generic API request function
export async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(endpoint, defaultOptions);
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error('API request error:', error);
    return { success: false, error: error.message, status: 500 };
  }
}

export default {
  API_ENDPOINTS,
  apiRequest,
}; 