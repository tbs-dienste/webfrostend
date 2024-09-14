import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import './Footer.scss';

const Footer = () => {
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

        {/* Rechtliche Links */}
        <div className="footer-section">
          <h2>Rechtliches</h2>
          <ul>
            <li><Link to="/impressum">Impressum</Link></li>
            <li><span className="disabled-link">Datenschutz</span></li>
            <li><span className="disabled-link">AGB</span></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h2>Folgen Sie uns</h2>
          <div className="footer-socials">
            <a href="https://www.tiktok.com/@tbs.solutions" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaTiktok />
              <span className="social-text">TikTok</span>
            </a>
            <a href="https://www.instagram.com/tbssolutions" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram />
              <span className="social-text">Instagram</span>
            </a>
            <a href="https://www.facebook.com/tbssolutions" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaFacebookF />
              <span className="social-text">Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Hinweis */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TBS Solutions. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
};

export default Footer;
