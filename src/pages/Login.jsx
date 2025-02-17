import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voter_id: voterId, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('voter_id', voterId);
        navigate('/voters');
      } else {
        setErrorMessage(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="voterId">Voter ID</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="voterId"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  placeholder="Enter your Voter ID"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="error-container">
                <p className="error-message">{errorMessage}</p>
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="login-footer">
              <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
