import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiMail, FiSend } from 'react-icons/fi';
import axios from 'axios';
import './Footer.scss';
import Datenschutzrichtlinien from '../Mitarbeiter/Documents/Datenschutzrichtlinien.pdf';
import Leitbild from '../Mitarbeiter/Documents/Leitbild.pdf';

const Footer = () => {
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
      setMessage(error.response?.data?.error || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Kontaktinformationen */}
        <div className="footer-section">
          <h2>Kontakt</h2>
          <p>
            TBS Solutions <br />
            3001 Bern <br />
            <Link to="/kontakt">Zum Kontaktformular</Link>
          </p>
        </div>

        {/* Rechtliches */}
        <div className="footer-section">
          <h2>Rechtliches</h2>
          <ul>
            <li><Link to="/impressum">Impressum</Link></li>
            <li><a href={Datenschutzrichtlinien} target="_blank" rel="noopener noreferrer">Datenschutzrichtlinien</a></li>
            <li><Link to="/agb">Allgemeine Geschäftsbedingungen</Link></li>
          </ul>
        </div>

        {/* Leitbild */}
        <div className="footer-section">
          <h2>Unser Leitbild</h2>
          <ul>
            <li><a href={Leitbild} target="_blank" rel="noopener noreferrer">Leitbild von TBS Solutions</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="footer-section">
          <h2>Folgen Sie uns</h2>
          <div className="footer-socials">
            <a href="https://www.tiktok.com/@tbs.solutions" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaTiktok /><span className="social-text">TikTok</span>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram /><span className="social-text">Instagram</span>
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaFacebookF /><span className="social-text">Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter-Abo */}
      <div className="newsletter-footer">
        <form onSubmit={handleSubmit} className="newsletter-form-footer">
          <h3>📬 Jetzt Newsletter abonnieren</h3>
          <div className="newsletter-input-group">
            <FiMail className="newsletter-icon" />
            <input
              type="email"
              placeholder="Deine E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              <FiSend className="send-icon" />
              {loading ? 'Senden...' : 'Abonnieren'}
            </button>
          </div>
          {status && <p className={`newsletter-feedback ${status}`}>{message}</p>}
        </form>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TBS Solutions. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
};

export default Footer;
