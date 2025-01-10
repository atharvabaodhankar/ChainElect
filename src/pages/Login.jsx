import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  // State for login inputs
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize useNavigate
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error message
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter_id: voterId,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Login Successful!');
        navigate('/voters');  // Redirect to Voters.jsx on successful login
      } else {
        setErrorMessage(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
      <section className="login-section">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="voterId">Voter ID</label>
              <input
                type="text"
                id="voterId"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                placeholder="Enter your Voter ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
