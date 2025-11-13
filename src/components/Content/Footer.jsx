import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiMail, FiSend } from 'react-icons/fi';
import axios from 'axios';
import './Footer.scss';
import Datenschutzrichtlinien from '../Mitarbeiter/Documents/Datenschutzrichtlinien.pdf';
import Leitbild from '../Mitarbeiter/Documents/Leitbild.pdf';

const Footer = () => {
  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Anfrage
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nachricht, setNachricht] = useState('');
  const [anfrageStatus, setAnfrageStatus] = useState(null);
  const [anfrageMessage, setAnfrageMessage] = useState('');
  const [anfrageLoading, setAnfrageLoading] = useState(false);

  // Newsletter abonnieren
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus(null);
    setNewsletterMessage('');
    setNewsletterLoading(true);
    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterStatus('success');
      setNewsletterMessage(response.data.message);
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(error.response?.data?.error || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Anfrage senden
  const handleAnfrageSubmit = async (e) => {
    e.preventDefault();
    setAnfrageStatus(null);
    setAnfrageMessage('');
    setAnfrageLoading(true);
    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/anfragen/create', {
        name,
        email,
        nachricht
      });
      setAnfrageStatus('success');
      setAnfrageMessage('Ihre Anfrage wurde erfolgreich gesendet!');
      setName('');
      setEmail('');
      setNachricht('');
    } catch (error) {
      setAnfrageStatus('error');
      setAnfrageMessage(error.response?.data?.error || 'Fehler beim Senden der Anfrage.');
    } finally {
      setAnfrageLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h3>Kontakt</h3>
          <p>TBS Solutions</p>
          <p>3001 Bern</p>
          <Link to="/kontakt" className="footer-link">Kontaktformular</Link>
        </div>

        <div className="footer-column">
          <h3>Rechtliches</h3>
          <Link to="/impressum" className="footer-link">Impressum</Link>
          <a href={Datenschutzrichtlinien} target="_blank" rel="noopener noreferrer" className="footer-link">Datenschutzrichtlinien</a>
          <Link to="/agb" className="footer-link">AGB</Link>
        </div>

        <div className="footer-column">
          <h3>Leitbild</h3>
          <a href={Leitbild} target="_blank" rel="noopener noreferrer" className="footer-link">Unser Leitbild</a>
        </div>

        <div className="footer-column">
          <h3>Folgen Sie uns</h3>
          <div className="socials">
            <a href="https://www.tiktok.com/@tbs.solutions" target="_blank" rel="noopener noreferrer" className="social"><FaTiktok /> TikTok</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social"><FaInstagram /> Instagram</a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social"><FaFacebookF /> Facebook</a>
          </div>
        </div>
      </div>

      <div className="footer-forms">
        {/* Newsletter */}
        <div className="form-card">
          <h3>Newsletter abonnieren</h3>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <div className="input-group">
              <FiMail className="icon" />
              <input
                type="email"
                placeholder="E-Mail Adresse"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                disabled={newsletterLoading}
              />
              <button type="submit" disabled={newsletterLoading}>
                {newsletterLoading ? 'Senden...' : 'Abonnieren'} <FiSend />
              </button>
            </div>
            {newsletterStatus && <p className={`feedback ${newsletterStatus}`}>{newsletterMessage}</p>}
          </form>
        </div>

        {/* Anfrage */}
        <div className="form-card">
          <h3>Kontaktanfrage senden</h3>
          <form onSubmit={handleAnfrageSubmit} className="anfrage-form">
            <input
              type="text"
              placeholder="Ihr Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={anfrageLoading}
            />
            <input
              type="email"
              placeholder="Ihre E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={anfrageLoading}
            />
            <textarea
              placeholder="Ihre Nachricht"
              value={nachricht}
              onChange={(e) => setNachricht(e.target.value)}
              required
              disabled={anfrageLoading}
            />
            <button type="submit" disabled={anfrageLoading}>
              {anfrageLoading ? 'Senden...' : 'Nachricht senden'}
            </button>
            {anfrageStatus && <p className={`feedback ${anfrageStatus}`}>{anfrageMessage}</p>}
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TBS Solutions. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
};

export default Footer;
