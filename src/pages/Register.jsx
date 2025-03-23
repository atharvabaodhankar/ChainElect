import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FaceRegister from '../components/FaceRegister';
import RegisterInstructions from '../components/RegisterInstructions';
import { endpoints } from "../config/api.js";

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
  const [validationErrors, setValidationErrors] = useState({
    voterId: '',
    metamaskId: '',
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    voter_id: "",
    metamask_id: "",
    email: "",
    password: "",
  });

  // Regex patterns
  const patterns = {
    voterId: /^[A-Z]{3}[0-9]{7}$/, // Based on Indian Voter ID format
    metamaskId: /^0x[a-fA-F0-9]{40}$/, // MetaMask address format
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  const validateField = (name, value) => {
    if (!value) {
      return `${name} is required`;
    }
    if (!patterns[name].test(value)) {
      switch (name) {
        case 'voterId':
          return 'Invalid Voter ID format. Must be 3 uppercase letters followed by 7 digits';
        case 'metamaskId':
          return 'Invalid MetaMask address. Must start with 0x followed by 40 hexadecimal characters';
        case 'email':
          return 'Invalid email format';
        case 'password':
          return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        default:
          return 'Invalid format';
      }
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'voterId':
        setVoterId(value.toUpperCase());
        break;
      case 'metamaskId':
        setMetamaskId(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

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
    setError("");
    setLoading(true);

    try {
      const response = await fetch(endpoints.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
                  name="voterId"
                  value={voterId}
                  onChange={handleInputChange}
                  placeholder="Enter your Voter ID (e.g., ABC1234567)"
                  required
                />
                {validationErrors.voterId && (
                  <div className="validation-error">{validationErrors.voterId}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="metamaskId">MetaMask ID</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="metamaskId"
                  name="metamaskId"
                  value={metamaskId}
                  onChange={handleInputChange}
                  placeholder="Enter your MetaMask ID (0x...)"
                  required
                />
                {validationErrors.metamaskId && (
                  <div className="validation-error">{validationErrors.metamaskId}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
                {validationErrors.email && (
                  <div className="validation-error">{validationErrors.email}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  required
                />
                {validationErrors.password && (
                  <div className="validation-error">{validationErrors.password}</div>
                )}
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
