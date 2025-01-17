import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
  const [voterId, setVoterId] = useState('');
  const [metamaskId, setMetamaskId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

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
        alert('Registration Successful!');
        navigate('/login');
      } else {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
      <section className="register-section">
        <div className="register-container">
          <h2>Register</h2>
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
              <label htmlFor="metamaskId">Metamask ID</label>
              <input
                type="text"
                id="metamaskId"
                value={metamaskId}
                onChange={(e) => setMetamaskId(e.target.value)}
                placeholder="Enter your Metamask ID"
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
            <button type="submit" className="register-button">Register</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Register;
