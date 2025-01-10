import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
    // State to handle form inputs
    const [voterId, setVoterId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [metamaskId, setMetamaskId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!voterId || !metamaskId || !password || !confirmPassword || !image) {
            setError('All fields are required!');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setError('');
        setLoading(true); // Show loading state

        // Create FormData to send file and other form data
        const formData = new FormData();
        formData.append('voter_id', voterId);
        formData.append('metamask_id', metamaskId);
        formData.append('password', password);
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                body: formData,
                credentials: 'include', // Include cookies for session handling if needed
            });

            const result = await response.json();

            if (response.ok) {
                alert('Registration Successful!');
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    // Handle file input change
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <>
            <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
            <section className="register-section">
                <div className="register-container">
                    <h2>Register to Vote</h2>
                    {error && <p className="error-message">{error}</p>}
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
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Upload Voter Image</label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>
                        <button type="submit" className="register-button" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Register;
