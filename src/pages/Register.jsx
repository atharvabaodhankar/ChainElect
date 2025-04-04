import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FaceRegister from '../components/FaceRegister';
import RegisterInstructions from '../components/RegisterInstructions';
import contractConfig from '../utils/contractConfig';
import { API_ENDPOINTS } from '../utils/api';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const [voterId, setVoterId] = useState('');
  const [metamaskId, setMetamaskId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    voterId: '',
    metamaskId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Function to add Polygon Amoy Testnet network
  const addPolygonAmoyNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: contractConfig.polygonAmoy.chainHexId,
          chainName: contractConfig.polygonAmoy.chainName,
          nativeCurrency: {
            name: contractConfig.polygonAmoy.currencyName,
            symbol: contractConfig.polygonAmoy.currencySymbol,
            decimals: 18
          },
          rpcUrls: [contractConfig.polygonAmoy.rpcUrl],
          blockExplorerUrls: [contractConfig.polygonAmoy.blockExplorer]
        }]
      });
    } catch (error) {
      console.error('Error adding network:', error);
      setErrorMessage('Failed to add Polygon Amoy Testnet network. Please try again.');
    }
  };

  // Check if Metamask is installed and connected
  useEffect(() => {
    const checkMetamask = async () => {
      if (window.ethereum) {
        setIsMetamaskInstalled(true);
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsMetamaskConnected(true);
            setMetamaskId(accounts[0]); // Automatically set the Metamask ID
          }
        } catch (error) {
          console.error('Error checking Metamask connection:', error);
        }
      } else {
        setIsMetamaskInstalled(false);
      }
    };

    checkMetamask();
  }, []);

  // Function to connect Metamask
  const connectMetamask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsMetamaskConnected(true);
      if (accounts.length > 0) {
        setMetamaskId(accounts[0]);
        setValidationErrors(prev => ({
          ...prev,
          metamaskId: validateField('metamaskId', accounts[0])
        }));
      }

      // Try to switch to Polygon Amoy network after connecting
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: contractConfig.polygonAmoy.chainHexId }],
        });
      } catch (switchError) {
        // If the chain hasn't been added to MetaMask, add it
        if (switchError.code === 4902) {
          await addPolygonAmoyNetwork();
        }
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
      setErrorMessage('Failed to connect to Metamask. Please try again.');
    }
  };

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
        // Validate confirm password when password changes
        if (confirmPassword) {
          setValidationErrors(prev => ({
            ...prev,
            confirmPassword: value !== confirmPassword ? 'Passwords do not match' : ''
          }));
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: value !== password ? 'Passwords do not match' : ''
        }));
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: name === 'confirmPassword' ? 
        (value !== password ? 'Passwords do not match' : '') :
        validateField(name, value)
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
    setErrorMessage('');
    setSuccessMessage('');

    // Check if Metamask is connected
    if (!isMetamaskConnected) {
      setErrorMessage('Please connect your Metamask wallet before registering.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Validate all fields
    const errors = {
      voterId: validateField('voterId', voterId),
      metamaskId: validateField('metamaskId', metamaskId),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: password !== confirmPassword ? 'Passwords do not match' : ''
    };

    setValidationErrors(errors);

    // Check if there are any validation errors
    if (Object.values(errors).some(error => error)) {
      setErrorMessage('Please fix the validation errors before submitting');
      return;
    }

    if (!image) {
      setErrorMessage('Please select a profile image');
      return;
    }

    setIsLoading(true);

    try {
      // Ensure we're using the current Metamask account
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && accounts[0].toLowerCase() !== metamaskId.toLowerCase()) {
          setMetamaskId(accounts[0]);
        }
      }

      const formData = new FormData();
      formData.append('voter_id', voterId);
      formData.append('metamask_id', metamaskId);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('image', image);
      formData.append('face_descriptor', JSON.stringify(faceDescriptor));

      const response = await fetch(API_ENDPOINTS.register, {
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
        setConfirmPassword('');
        setImage(null);
        setImagePreview(null);
      } else {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
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
              <h2>{t('register.successful')}</h2>
              <div className="success-message">
                <p>{t('register.emailSent')}</p>
                <p className="email-highlight">{registeredEmail}</p>
                <p>{t('register.checkEmail')}</p>
                <div className="email-instructions">
                  <h3>{t('register.nextSteps')}</h3>
                  <ol>
                    <li>{t('register.openInbox')}</li>
                    <li>{t('register.lookForEmail')}</li>
                    <li>{t('register.clickLink')}</li>
                    <li>{t('register.afterConfirmation')}</li>
                  </ol>
                </div>
                <p className="note">{t('register.spamNote')}</p>
                <button 
                  className="login-redirect-button"
                  onClick={() => navigate('/login')}
                >
                  {t('register.goToLogin')}
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
            <h1>{t('register.createAccount')}</h1>
            <p>{t('register.joinPlatform')}</p>
          </div>
          
          {/* Metamask Connection Status */}
          <div className="metamask-status">
            {!isMetamaskInstalled ? (
              <div className="metamask-warning">
                <p>{t('register.metamaskNotInstalled')}</p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="metamask-install-button"
                >
                  {t('register.installMetamask')}
                </a>
              </div>
            ) : !isMetamaskConnected ? (
              <div className="metamask-connect">
                <p>{t('register.metamaskNotConnected')}</p>
                <button 
                  type="button"
                  onClick={connectMetamask} 
                  className="metamask-connect-button"
                >
                  {t('register.connectMetamask')}
                </button>
                <button 
                  type="button"
                  onClick={addPolygonAmoyNetwork} 
                  className="metamask-network-button"
                >
                  {t('register.addPolygonNetwork')}
                </button>
              </div>
            ) : (
              <div className="metamask-connected">
                <p className="connected-status">{t('register.metamaskConnected')}</p>
                <button 
                  type="button"
                  onClick={addPolygonAmoyNetwork} 
                  className="metamask-network-button"
                >
                  {t('register.addPolygonNetwork')}
                </button>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="voterId">{t('register.voterId')}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="voterId"
                  name="voterId"
                  value={voterId}
                  onChange={handleInputChange}
                  placeholder={t('register.voterIdPlaceholder')}
                  required
                />
                {validationErrors.voterId && (
                  <div className="validation-error">{validationErrors.voterId}</div>
                )}
                {!validationErrors.voterId && (
                  <p className="input-helper">{t('register.voterIdFormat')}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="metamaskId">{t('register.metamaskId')}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="metamaskId"
                  name="metamaskId"
                  value={metamaskId}
                  onChange={handleInputChange}
                  placeholder={t('register.metamaskIdPlaceholder')}
                  disabled={isMetamaskConnected}
                  required
                />
                {validationErrors.metamaskId && (
                  <div className="validation-error">{validationErrors.metamaskId}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('register.email')}</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder={t('register.emailPlaceholder')}
                  required
                />
                {validationErrors.email && (
                  <div className="validation-error">{validationErrors.email}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('register.password')}</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  placeholder={t('register.passwordPlaceholder')}
                  required
                />
                {validationErrors.password && (
                  <div className="validation-error">{validationErrors.password}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  required
                />
                {validationErrors.confirmPassword && (
                  <div className="validation-error">{validationErrors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">{t('register.profileImage')}</label>
              <div className="input-wrapper">
                <button
                  type="button"
                  className="capture-face-button"
                  onClick={() => setShowFaceCapture(true)}
                >
                  {t('register.captureFace')}
                </button>
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt={t('register.preview')} style={{ maxWidth: '200px', marginTop: '10px' }} />
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
              {isLoading ? t('register.creatingAccount') : t('register.createAccountButton')}
            </button>

            <div className="register-footer">
              <p>{t('register.haveAccount')} <a href="/login">{t('register.login')}</a></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
