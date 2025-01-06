import React, { useState } from "react";
import Button from "../components/button";
import Sample from "../components/Sample";
import Aboutus from "./Aboutus";
import Features from "./Features";
import Footer from "../components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Navbar from "../components/Navbar";

const Homepage = () => {

  return (
    <>
      <section id="hero">
        <video src="src/images/hero.mp4" autoPlay loop muted></video>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />

        <div className="hero">
          <h1>In-Cognito Voting</h1>
          <p>
            Lorem ipsum dolor sit a natus nemo consectetur numquam impedit
            autem, aut debitis animi accusantium. Debitis nobis fugiat quo illo
            numquam recusandae libero doloribus dignissimos ipsam, beatae sequi
            culpa omnis accusantium inventore sint eius atque exercitationem.
            Dolores expedita dolorum dicta fuga.
          </p>
          <Button name="Get Started" link="/register" />
        </div>
      </section>
      <Features />
      <Aboutus />
      <Footer />
    </>
  );
};

export default Homepage;
