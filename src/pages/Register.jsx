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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // You can handle form data here, e.g., sending to an API
        alert('Registration Successful!');
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
                        <button type="submit" className="register-button">Register</button>
                    </form>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Register;
