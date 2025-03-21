import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FaceRegister from '../components/FaceRegister';
import RegisterInstructions from '../components/RegisterInstructions';

const Register = () => {
  const [voterId, setVoterId] = useState('');
  const [metamaskId, setMetamaskId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMessage('Image size should be less than 5MB');
        return;
      }
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        setErrorMessage('Only .jpg, .jpeg, and .png files are allowed');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };
  const handleFaceDetected = ({ descriptor, imageFile }) => {
    setFaceDescriptor(descriptor);
    setImage(imageFile);
    setImagePreview(URL.createObjectURL(imageFile));
    setShowFaceCapture(false);
  };
  const handleFaceError = (error) => {
    setErrorMessage(error);
    setShowFaceCapture(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!image) {
      setErrorMessage('Please select a profile image');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('voter_id', voterId);
      formData.append('metamask_id', metamaskId);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('image', image);
      formData.append('face_descriptor', JSON.stringify(faceDescriptor));

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setRegistrationComplete(true);
        setRegisteredEmail(result.email);
        setSuccessMessage(result.message);
        // Clear form
        setVoterId('');
        setMetamaskId('');
        setEmail('');
        setPassword('');
        setImage(null);
        setImagePreview(null);
      } else {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
        // If it's an email-related error, provide more specific guidance
        if (result.isEmailError) {
          setErrorMessage('This email address is already registered. Please use a different email or try logging in.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showInstructions) {
    return (
      <div className="register-page">
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        <RegisterInstructions onStart={() => setShowInstructions(false)} />
        <Footer />
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="register-page">
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        <div className="register-wrapper">
          <div className="register-content">
            <div className="registration-success">
              <h2>Registration Successful!</h2>
              <div className="success-message">
                <p>We've sent a confirmation email to:</p>
                <p className="email-highlight">{registeredEmail}</p>
                <p>Please check your email and click the confirmation link to activate your account.</p>
                <div className="email-instructions">
                  <h3>Next steps:</h3>
                  <ol>
                    <li>Open your email inbox</li>
                    <li>Look for an email from ChainElect</li>
                    <li>Click the confirmation link in the email</li>
                    <li>Once confirmed, you can log in to your account</li>
                  </ol>
                </div>
                <p className="note">Note: If you don't see the email, please check your spam folder.</p>
                <button 
                  className="login-redirect-button"
                  onClick={() => navigate('/login')}
                >
                  Go to Login Page
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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

            <div className="form-group">
              <label htmlFor="image">Profile Image</label>
              <div className="input-wrapper">
                <button
                  type="button"
                  className="capture-face-button"
                  onClick={() => setShowFaceCapture(true)}
                >
                  Capture Face Image
                </button>
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                </div>
              )}
            </div>
            {showFaceCapture && (
              <FaceRegister
                onFaceDetected={handleFaceDetected}
                onError={handleFaceError}
              />
            )}
            {errorMessage && (
              <div className="error-container">
                <p className="error-message">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="success-container">
                <p className="success-message">{successMessage}</p>
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
