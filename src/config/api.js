const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const endpoints = {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    logout: `${API_URL}/auth/logout`,
    getVoter: (voterId) => `${API_URL}/voters/${voterId}`
};

export default API_URL; 