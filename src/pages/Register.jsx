import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
  const [voterId, setVoterId] = useState('');
  const [metamaskId, setMetamaskId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter_id: voterId,
          metamask_id: metamaskId,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
      <div className="register-wrapper">
        <div className="register-content">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join the secure voting platform</p>
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
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
              <label htmlFor="metamaskId">Metamask ID</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="metamaskId"
                  value={metamaskId}
                  onChange={(e) => setMetamaskId(e.target.value)}
                  placeholder="Enter your Metamask ID"
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
                  placeholder="Create a strong password"
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
              className={`register-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="register-footer">
              <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
