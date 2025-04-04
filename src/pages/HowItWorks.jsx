import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from 'react-i18next';
import "../styles/HowItWorks.css";
import { FaReact, FaNodeJs, FaUserShield, FaLaptopCode, FaLink, FaServer, FaShieldAlt, FaLock, FaSearch, FaUsers, FaDatabase, FaWallet, FaChartLine } from "react-icons/fa";
import { SiSolidity, SiPolygon } from "react-icons/si";

const HowItWorks = () => {
  const { t } = useTranslation();

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
            <h1>{t('howItWorks.title')}</h1>
            <p>{t('howItWorks.subtitle')}</p>
          </div>
        </div>

        <div className="container">
          <section className="tech-stack">
            <h2>{t('howItWorks.techStack.title')}</h2>
            <p className="section-intro">{t('howItWorks.techStack.intro')}</p>
            <div className="tech-grid">
              <div className="tech-card">
                <div className="tech-icon">
                  <FaReact />
                </div>
                <h3>{t('howItWorks.techStack.react.title')}</h3>
                <p>{t('howItWorks.techStack.react.description')}</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <SiPolygon />
                </div>
                <h3>{t('howItWorks.techStack.polygon.title')}</h3>
                <p>{t('howItWorks.techStack.polygon.description')}</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <SiSolidity />
                </div>
                <h3>{t('howItWorks.techStack.solidity.title')}</h3>
                <p>{t('howItWorks.techStack.solidity.description')}</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <FaNodeJs />
                </div>
                <h3>{t('howItWorks.techStack.nodejs.title')}</h3>
                <p>{t('howItWorks.techStack.nodejs.description')}</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <FaDatabase />
                </div>
                <h3>{t('howItWorks.techStack.supabase.title')}</h3>
                <p>{t('howItWorks.techStack.supabase.description')}</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <FaWallet />
                </div>
                <h3>{t('howItWorks.techStack.web3js.title')}</h3>
                <p>{t('howItWorks.techStack.web3js.description')}</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <FaChartLine />
                </div>
                <h3>{t('howItWorks.techStack.chartjs.title')}</h3>
                <p>{t('howItWorks.techStack.chartjs.description')}</p>
              </div>
              
              <div className="tech-card">
                <div className="tech-icon">
                  <FaUserShield />
                </div>
                <h3>{t('howItWorks.techStack.faceapi.title')}</h3>
                <p>{t('howItWorks.techStack.faceapi.description')}</p>
              </div>
            </div>
          </section>

          <section className="architecture">
            <h2>{t('howItWorks.architecture.title')}</h2>
            <p className="section-intro">{t('howItWorks.architecture.intro')}</p>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <FaLaptopCode />
              </div>
              <div className="arch-content">
                <h3>{t('howItWorks.architecture.frontend.title')}</h3>
                <p>{t('howItWorks.architecture.frontend.description')}</p>
              </div>
            </div>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <FaLink />
              </div>
              <div className="arch-content">
                <h3>{t('howItWorks.architecture.blockchain.title')}</h3>
                <p>{t('howItWorks.architecture.blockchain.description')}</p>
              </div>
            </div>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <FaServer />
              </div>
              <div className="arch-content">
                <h3>{t('howItWorks.architecture.backend.title')}</h3>
                <p>{t('howItWorks.architecture.backend.description')}</p>
              </div>
            </div>
            
            <div className="architecture-section">
              <div className="arch-icon">
                <FaShieldAlt />
              </div>
              <div className="arch-content">
                <h3>{t('howItWorks.architecture.security.title')}</h3>
                <p>{t('howItWorks.architecture.security.description')}</p>
              </div>
            </div>
          </section>

          <section className="workflow">
            <h2>{t('howItWorks.workflow.title')}</h2>
            <p className="section-intro">{t('howItWorks.workflow.intro')}</p>
            
            <div className="workflow-steps">
              <div className="workflow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>{t('howItWorks.workflow.step1.title')}</h3>
                  <p>{t('howItWorks.workflow.step1.description')}</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>{t('howItWorks.workflow.step2.title')}</h3>
                  <p>{t('howItWorks.workflow.step2.description')}</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>{t('howItWorks.workflow.step3.title')}</h3>
                  <p>{t('howItWorks.workflow.step3.description')}</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>{t('howItWorks.workflow.step4.title')}</h3>
                  <p>{t('howItWorks.workflow.step4.description')}</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>{t('howItWorks.workflow.step5.title')}</h3>
                  <p>{t('howItWorks.workflow.step5.description')}</p>
                </div>
              </div>
              
              <div className="workflow-step">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h3>{t('howItWorks.workflow.step6.title')}</h3>
                  <p>{t('howItWorks.workflow.step6.description')}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="benefits">
            <h2>{t('howItWorks.benefits.title')}</h2>
            <p className="section-intro">{t('howItWorks.benefits.intro')}</p>
            
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <FaLock />
                </div>
                <h3>{t('howItWorks.benefits.immutability.title')}</h3>
                <p>{t('howItWorks.benefits.immutability.description')}</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <FaSearch />
                </div>
                <h3>{t('howItWorks.benefits.transparency.title')}</h3>
                <p>{t('howItWorks.benefits.transparency.description')}</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <FaShieldAlt />
                </div>
                <h3>{t('howItWorks.benefits.security.title')}</h3>
                <p>{t('howItWorks.benefits.security.description')}</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <FaUsers />
                </div>
                <h3>{t('howItWorks.benefits.accessibility.title')}</h3>
                <p>{t('howItWorks.benefits.accessibility.description')}</p>
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