import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiCheckCircle, FiXCircle, FiSend, FiStar, FiGift, FiBell } from 'react-icons/fi';
import './NewsletterSubscribeForm.scss';

const NewsletterSubscribeForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/newsletter/subscribe', { email });
      setStatus('success');
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setStatus('error');
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Ein unerwarteter Fehler ist aufgetreten.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-form-container">
      <div className="form-card">
        <h2 className="form-title">📬 Unser Newsletter – Mehr als nur E-Mails</h2>
        <p className="form-subtitle">Deine Vorteile auf einen Blick:</p>
        <ul className="benefits-list">
          <li><FiStar className="benefit-icon" /> Exklusive Einblicke & Tipps nur für Abonnenten</li>
          <li><FiGift className="benefit-icon" /> Frühzeitiger Zugang zu Aktionen & Rabatten</li>
          <li><FiBell className="benefit-icon" /> Wichtige Updates direkt in dein Postfach</li>
        </ul>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Deine E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            <FiSend className="send-icon" />
            {loading ? 'Wird gesendet...' : 'Jetzt abonnieren'}
          </button>
        </form>

        {status && (
          <div className={`feedback-message ${status}`}>
            {status === 'success' ? <FiCheckCircle /> : <FiXCircle />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterSubscribeForm;
