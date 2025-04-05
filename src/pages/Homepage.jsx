import React, { useState } from "react";
import Button from "../components/Button";
import Sample from "../components/Sample";
import Aboutus from "./Aboutus";
import Features from "./Features";
import Footer from "../components/Footer";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Register from "./Register";
import Navbar from "../components/Navbar";
import ContactUs from "../components/ContactUs";
import { useTranslation } from 'react-i18next';

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <>
      <section id="hero">
        <video src="/images/hero.mp4" autoPlay loop muted></video>
        <Navbar home="/" features="/#features" aboutus="/#aboutus" contactus="/#contactus" />

        <div className="hero">
          <h1>{t('app.title')} <br /><span>{t('app.slogan')}</span></h1>
          <p>
            {t('home.welcome')}, {t('home.description')}
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="button">{t('nav.login')}</Link>
            <Link to="/register" className="button">{t('nav.register')}</Link>
            <Link to="/results" className="button">{t('nav.results')}</Link>
      
            <Link to="/declared-results" className="button">{t('results.historical')}</Link>
          </div>
        </div>
      </section>
      <Features />
      <Aboutus />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Homepage;
