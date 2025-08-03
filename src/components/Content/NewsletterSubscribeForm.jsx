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
      <h2 className="form-title">📬 Werde Teil unserer Community</h2>
      <p className="form-subtitle">
        Tritt hunderten anderen bei, die unsere besten Tipps, exklusivsten Angebote und spannende Einblicke direkt per Mail erhalten.
        Unser Newsletter ist der einfachste Weg, immer up to date zu bleiben – ohne nervige Werbung, ohne leere Versprechen.
      </p>

      <ul className="benefits-list">
        <li><FiStar className="benefit-icon" /> <strong>Exklusive Inhalte</strong> – Nur Abonnenten erhalten tiefe Einblicke, Checklisten und Profi-Tipps aus der digitalen Welt.</li>
        <li><FiGift className="benefit-icon" /> <strong>Geheime Rabatte</strong> – Zugang zu Sonderaktionen und Vorteilen, die nirgendwo sonst veröffentlicht werden.</li>
        <li><FiBell className="benefit-icon" /> <strong>Wichtige News zuerst</strong> – Sei immer der oder die Erste, die über neue Features, Trends und Änderungen Bescheid weiß.</li>
        <li><FiThumbsUp className="benefit-icon" /> <strong>Keine Spam-Garantie</strong> – Wir schreiben nur, wenn es wirklich Sinn macht. Punkt.</li>
        <li><FiCalendar className="benefit-icon" /> <strong>Monatlich kompakt</strong> – Maximal 1x pro Monat. Kurz, prägnant und auf den Punkt.</li>
      </ul>

      <div className="extra-info-box">
        <FiInfo className="info-icon" />
        <span>
          Unser Ziel ist es, dir echten Mehrwert zu liefern. Du kannst dich jederzeit mit nur einem Klick abmelden – kein Stress, kein Kleingedrucktes. Deine Daten bleiben bei uns.
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
        🔒 Wir respektieren deine Zeit und deine Privatsphäre. Keine Weitergabe an Dritte. Du hast jederzeit volle Kontrolle über deine Daten.
      </p>

      <p className="privacy-note">
        💡 Unser Newsletter ist mehr als nur Info – er ist Inspiration, Orientierung und dein direkter Draht zu echten digitalen Vorteilen. Sei dabei.
      </p>
    </div>
  );
};

export default NewsletterSubscribeForm;
