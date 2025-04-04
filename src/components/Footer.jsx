import React from "react";
import Button from "./Button";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
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
          <h3>{t('app.title')}</h3>
          <p>
            {t('footer.description')}
          </p>
        </div>
        <div className="footer-links">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li><a href="/">{t('nav.home')}</a></li>
            <li><a href="/register">{t('nav.register')}</a></li>
            <li><a href="/login">{t('nav.login')}</a></li>
            <li><a href="/voters">{t('footer.vote')}</a></li>
          </ul>
        </div>
        <div className="footer-resources">
          <h4>{t('footer.resources')}</h4>
          <ul>
            <li><a href="/#features">{t('nav.features')}</a></li>
            <li><a href="/#aboutus">{t('nav.about')}</a></li>
            <li><a href="/#contactus">{t('nav.contact')}</a></li>
            <li><a href="/results">{t('nav.results')}</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>{t('footer.contactInfo')}</h4>
          <ul>
            <li><a href="mailto:support@chainelect.com">support@chainelect.com</a></li>
            <li>{t('footer.location')}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t('footer.copyright')} &copy; 2024-2025 {t('app.title')}. {t('footer.allRightsReserved')}</p>
      </div>
    </section>
  );
};
export default Footer;
