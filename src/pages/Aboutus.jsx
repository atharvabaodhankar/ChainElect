import React from "react";
import { useTranslation } from 'react-i18next';

const Aboutus = () => {
  const { t } = useTranslation();

  return (
    <section id="aboutus">
      <h1 className="h1">{t('aboutus.title')}</h1>
      <div className="aboutus">
        <div className="aboutus-box">
          <video autoPlay loop muted src="/images/hero.mp4"></video>
        </div>
        <div className="aboutus-desc">
          <div className="aboutus-box-inner">
            <h1>{t('aboutus.mission.title')}</h1>
            <p>
              {t('aboutus.mission.description')}
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>{t('aboutus.values.title')}</h1>
            <p>
              {t('aboutus.values.description')}
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>{t('aboutus.team.title')}</h1>
            <p>
              {t('aboutus.team.description')}
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>{t('aboutus.technology.title')}</h1>
            <p>
              {t('aboutus.technology.description')}
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>{t('aboutus.fairness.title')}</h1>
            <p>
              {t('aboutus.fairness.description')}
            </p>
          </div>
          <div className="aboutus-box-inner">
            <h1>{t('aboutus.democracy.title')}</h1>
            <p>
              {t('aboutus.democracy.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
