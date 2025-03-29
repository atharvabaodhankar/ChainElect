import React from "react";

const Aboutus = () => {
  return (
    <section id="aboutus">
      <h1 className="h1">About Us</h1>
      <div className="aboutus">
        <div className="aboutus-box">
          <video autoPlay loop muted src="/images/hero.mp4"></video>
        </div>
        <div className="aboutus-desc">
          <div className="aboutus-box-inner">
            <h1>Our Mission</h1>
            <p>
              To revolutionise voting by providing a secure, transparent, and
              accessible decentralized platform using blockchain technology.
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>Core Values</h1>
            <p>
              Trust, transparency, and integrity in every vote, ensuring
              accuracy and protection against tampering.
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>Expert Team</h1>
            <p>
              Blockchain specialists, security experts, and UX designers
              dedicated to advancing democratic processes.
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>Technology-Driven</h1>
            <p>
              Utilising blockchain, cryptographic security, and intuitive design
              to create a reliable voting experience.
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>Commitment to Fairness</h1>
            <p>
              ChainElect is designed to make voting easy, fair, and verifiable
              for everyone.
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>Empowering Democracy</h1>
            <p>
              Aiming to reinforce public trust in elections, whether local or
              global, for a more democratic future.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
