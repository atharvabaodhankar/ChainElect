import React from 'react'
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  return (
    <section className="features" id="features">
            <div>
                <div>
                    <h1 className='h1'>{t('features.title')}</h1>
                </div>
                <div className="boxes">
                    <div className="box">
                        <img src="/images/Decentralised.jpg" alt="" />
                      <div className="box-desc">
                      <h2 className="h2">{t('features.decentralized.title')}</h2>
                      <p>{t('features.decentralized.description')}</p>
                      </div>
                     </div>
                    <div className="box">
                        <img src="/images/audit.jpg" alt="" />
                        <div className="box-desc">
                            <h2 className="h2">{t('features.transparency.title')}</h2>
                            <p>{t('features.transparency.description')}</p>
                        </div>
                    </div>
                    <div className="box">
                        <img src="/images/realtime.png" alt="" />
                        <div className="box-desc">
                            <h2 className="h2">{t('features.realtime.title')}</h2>
                            <p>{t('features.realtime.description')}</p>
                        </div>
                        </div>
                        <div className="box">
                            <img src="/images/verification.jpg" alt="" />
                            <div className="box-desc">
                                <h2 className="h2">{t('features.verification.title')}</h2>
                                <p>{t('features.verification.description')}</p>
                            </div>
                        </div>
                        <div className="box">
                            <img src="/images/privacy.jpg" alt="" />
                            <div className="box-desc">
                                <h2 className="h2">{t('features.privacy.title')}</h2>
                                <p>{t('features.privacy.description')}</p>
                            </div>
                        </div>
                        <div className="box">
                            <img src="/images/scalable.jpg" alt="" />
                            <div className="box-desc">
                                <h2 className="h2">{t('features.scalable.title')}</h2>
                                <p>{t('features.scalable.description')}</p>
                            </div>
                        </div>
                        
                    </div>
            </div>
    </section>
  )
}

export default Features