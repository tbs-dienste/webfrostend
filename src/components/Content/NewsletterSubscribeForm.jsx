import React, { useState } from 'react';
import axios from 'axios';
import {
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiSend,
  FiStar,
  FiGift,
  FiBell,
  FiThumbsUp,
  FiCalendar,
  FiInfo
} from 'react-icons/fi';
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
        <h2 className="form-title">📬 Werde Teil unserer Community</h2>
        <p className="form-subtitle">Hol dir Wissen, Aktionen und echte Vorteile direkt ins Postfach!</p>

        <ul className="benefits-list">
          <li><FiStar className="benefit-icon" /> **Exklusive Inhalte** – Tipps, Trends und Insights aus der digitalen Welt</li>
          <li><FiGift className="benefit-icon" /> **Geheime Rabatte** – nur für Newsletter-Abonnenten</li>
          <li><FiBell className="benefit-icon" /> **Wichtige News zuerst** – bleib immer informiert</li>
          <li><FiThumbsUp className="benefit-icon" /> **Keine Spam-Garantie** – nur Relevantes, kein Blabla</li>
          <li><FiCalendar className="benefit-icon" /> **Monatlich kompakt** – alle Highlights in 2 Minuten</li>
        </ul>

        <div className="extra-info-box">
          <FiInfo className="info-icon" />
          <span>
            Du kannst dich jederzeit mit einem Klick wieder abmelden. Wir respektieren deine Zeit und deine Privatsphäre.
          </span>
        </div>

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
            {loading ? 'Wird gesendet...' : 'Jetzt kostenlos abonnieren'}
          </button>
        </form>

        {status && (
          <div className={`feedback-message ${status}`}>
            {status === 'success' ? <FiCheckCircle /> : <FiXCircle />}
            <span>{message}</span>
          </div>
        )}

        <p className="privacy-note">
          🔒 Wir geben deine E-Mail-Adresse niemals an Dritte weiter. Datenschutz ist uns heilig.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSubscribeForm;
