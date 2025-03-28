import React from "react";
import Button from "./button";

const Footer = () => {
  return (
    <section className="footer" id="footer">
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>
      <div className="footer-main">
        <div className="footer-content">
          <h3>ChainElect</h3>
          <p>
            ChainElect is a blockchain-based voting platform that ensures
            secure, transparent, and efficient elections.
          </p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/voters">Vote</a></li>
          </ul>
        </div>
        <div className="footer-resources">
          <h4>Resources</h4>
          <ul>
            <li><a href="/#features">Features</a></li>
            <li><a href="/#aboutus">About Us</a></li>
            <li><a href="/#contactus">Contact Us</a></li>
            <li><a href="/results">Results</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact Info</h4>
          <ul>
            <li><a href="mailto:support@chainelect.com">support@chainelect.com</a></li>
            <li>Solapur, Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright &copy; 2024-2025 ChainElect. All rights reserved.</p>
      </div>
    </section>
  );
};
export default Footer;
