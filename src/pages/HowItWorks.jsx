import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/HowItWorks.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  useEffect(() => {
    // Animation for hero section
    gsap.from(".how-it-works-hero h1", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from(".how-it-works-hero p", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out"
    });

    gsap.from(".shape", {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Animation for tech stack cards
    gsap.from(".tech-card", {
      y: 60,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".tech-grid",
        start: "top 80%",
      }
    });

    // Animation for architecture sections
    gsap.from(".architecture-section", {
      x: -50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".architecture",
        start: "top 75%",
      }
    });

    // Animation for workflow steps
    gsap.from(".workflow-step", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".workflow",
        start: "top 75%",
      }
    });

    // Animation for benefits
    gsap.from(".benefit-card", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".benefits",
        start: "top 80%",
      }
    });
  }, []);

  return (
    <>
      <section className="how-it-works-page">
        <div className="overlay"></div>
        <div className="shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />
        
        <div className="how-it-works-hero">
          <div className="hero-content">
            <h1>How It Works</h1>
            <p>Explore the technology stack and architecture behind ChainElect</p>
          </div>
        </div>

        <div className="container">
          <section className="tech-stack">
            <h2>Technology Stack</h2>
            <p className="section-intro">Our system leverages industry-leading technologies to deliver a secure, transparent, and user-friendly voting experience.</p>
            <div className="tech-grid">
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fab fa-react"></i>
                </div>
                <h3>React</h3>
                <p>Frontend UI library for building interactive components</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fab fa-ethereum"></i>
                </div>
                <h3>Ethereum</h3>
                <p>Blockchain network for secure, transparent voting</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fas fa-code"></i>
                </div>
                <h3>Solidity</h3>
                <p>Smart contract language for vote logic and security</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fab fa-node-js"></i>
                </div>
                <h3>Node.js</h3>
                <p>Backend runtime environment for API services</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fas fa-database"></i>
                </div>
                <h3>Supabase</h3>
                <p>Database and authentication services</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fas fa-wallet"></i>
                </div>
                <h3>Web3.js</h3>
                <p>Library for Ethereum blockchain interactions</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Chart.js</h3>
                <p>Data visualization for election results</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <i className="fas fa-user-shield"></i>
                </div>
                <h3>Face API</h3>
                <p>Facial recognition for voter verification</p>
              </div>
            </div>
          </section>

          <section className="architecture">
            <h2>System Architecture</h2>
            <p className="section-intro">Our multi-layered architecture ensures security, performance, and reliability.</p>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <div className="arch-content">
                <h3>Frontend Layer</h3>
                <p>The user interface is built with React and Vite for fast performance. We use modern React patterns including hooks and context API for state management. The UI communicates with both the backend server and directly with the blockchain via Web3.js.</p>
              </div>
            </div>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <i className="fas fa-link"></i>
              </div>
              <div className="arch-content">
                <h3>Blockchain Layer</h3>
                <p>Our smart contracts are written in Solidity and deployed on the Ethereum network. The contracts handle the core voting logic, ensuring each vote is securely recorded, cannot be tampered with, and is transparent for verification.</p>
              </div>
            </div>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <i className="fas fa-server"></i>
              </div>
              <div className="arch-content">
                <h3>Backend Layer</h3>
                <p>A Node.js server handles user authentication, profile management, and serves as a bridge between the frontend and database. Supabase provides database capabilities and file storage for voter profile images.</p>
              </div>
            </div>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="arch-content">
                <h3>Security Layer</h3>
                <p>Multiple security mechanisms are in place: MetaMask wallet verification ensures one-vote-per-person, email verification confirms user identity, and Face API provides an additional layer of verification during the voting process.</p>
              </div>
            </div>
          </section>

          <section className="workflow">
            <h2>Voting Workflow</h2>
            <p className="section-intro">From registration to results, our streamlined process ensures a smooth voting experience.</p>
            
            <div className="workflow-steps">
              <div className="workflow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Registration</h3>
                  <p>Users register with their email, create a password, and connect their MetaMask wallet. Profile images are stored securely in Supabase.</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Authentication</h3>
                  <p>Secure login using email/password, with MetaMask wallet verification to prevent duplicate voting.</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Candidate Selection</h3>
                  <p>Users see available candidates with information and select their preferred choice.</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Blockchain Verification</h3>
                  <p>The vote is verified and recorded on the Ethereum blockchain, requiring confirmation via MetaMask.</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>Vote Confirmation</h3>
                  <p>Users receive confirmation of their vote with a transaction hash for verification.</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h3>Results Viewing</h3>
                  <p>Once the election ends, results are tallied from the blockchain and displayed with interactive charts.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="benefits">
            <h2>Key Benefits</h2>
            <p className="section-intro">ChainElect offers numerous advantages over traditional voting systems.</p>
            
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <h3>Immutability</h3>
                <p>Once recorded on the blockchain, votes cannot be altered or deleted.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3>Transparency</h3>
                <p>All transactions are publicly verifiable while maintaining voter privacy.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Security</h3>
                <p>Multi-layer security with cryptographic voting mechanisms.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Accessibility</h3>
                <p>Vote from anywhere with internet access and a supported browser.</p>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HowItWorks; 