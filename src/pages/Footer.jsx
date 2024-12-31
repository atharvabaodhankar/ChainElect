import React from "react";
import Button from "../components/button";

const Footer = () => {
  return (
    <section className="footer" id="footer">
      <div class="waves">
        <div class="wave" id="wave1"></div>
        <div class="wave" id="wave2"></div>
        <div class="wave" id="wave3"></div>
        <div class="wave" id="wave4"></div>
      </div>
      <div className="footer-main">
        <div className="footer-content">
          <h3>ChainElect</h3>
          <p>
            ChainElect is a blockchain-based voting platform that ensures
            secure, transparent, and efficient elections.
          </p>
          <Button name="Learn More" link="/" />
        </div>
        <div className="footer-right">
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#aboutus">About Us</a>
            </li>
            <li>
              <a href="#contactus">ContactUs</a>
            </li>
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
