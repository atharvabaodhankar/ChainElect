import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { MdOutlineEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const ContactUs = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: null });

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus({ loading: false, success: true, error: null });
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus({ 
        loading: false, 
        success: false, 
        error: t('contactus.errors.submitFailed')
      });
    }
  };

  return (
    <section id="contactus">
      <div className="contact-container">
        <div className="contact-info">
          <h2>{t('contactus.getInTouch')}</h2>
          <p>{t('contactus.helpText')}</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">
                <MdOutlineEmail />
              </div>
              <div className="contact-text">
                <h3>{t('contactus.email')}</h3>
                <p>chainelect@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contactus.form.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('contactus.form.namePlaceholder')}
                required
                disabled={submitStatus.loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('contactus.form.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contactus.form.emailPlaceholder')}
                required
                disabled={submitStatus.loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">{t('contactus.form.subject')}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t('contactus.form.subjectPlaceholder')}
                required
                disabled={submitStatus.loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{t('contactus.form.message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contactus.form.messagePlaceholder')}
                required
                disabled={submitStatus.loading}
              />
            </div>

            {submitStatus.error && (
              <div className="error-message" style={{
                color: '#dc2626',
                background: '#fef2f2',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '1.4rem'
              }}>
                {submitStatus.error}
              </div>
            )}

            {submitStatus.success && (
              <div className="success-message" style={{
                color: '#059669',
                background: '#f0fdf4',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '1.4rem'
              }}>
                {t('contactus.successMessage')}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={submitStatus.loading}
            >
              {submitStatus.loading ? t('contactus.form.sending') : t('contactus.form.sendMessage')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs; 