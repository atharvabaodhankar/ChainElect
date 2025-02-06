import React, { useState } from "react";
import Button from "../components/button";
import Sample from "../components/Sample";
import Aboutus from "./Aboutus";
import Features from "./Features";
import Footer from "../components/Footer";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Register from "./Register";
import Navbar from "../components/Navbar";
import Web3 from "web3";

const Homepage = () => {

  return (
    <>
      <section id="hero">
        <video src="src/images/hero.mp4" autoPlay loop muted></video>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />

        <div className="hero">
          <h1>Chain Elect <br /><span>Secure Voting System</span></h1>
          <p>
            Welcome to Chain Elect, a blockchain-based voting system that ensures
            secure, transparent, and tamper-proof elections. Your vote matters, and
            we make sure it counts.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="button">Login to Vote</Link>
            <Link to="/register" className="button">Register Now</Link>
            <Link to="/results" className="button">View Results</Link>
          </div>
        </div>
      </section>
      <Features />
      <Aboutus />
      <Footer />
      </>
  );
};

export default Homepage;
