import React, { useState, useEffect } from 'react';
import './CookieConsent.scss';
import { FaCookieBite } from 'react-icons/fa';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    const cookiesAccepted = document.cookie.split('; ').find(row => row.startsWith('cookies-accepted='));
    if (cookiesAccepted) {
      setShowIcon(false);
      setShowBanner(false);
    }
  }, []);

  const handleAccept = () => {
    document.cookie = "cookies-accepted=true; path=/; max-age=" + (60 * 60 * 24 * 365); // Cookie für 1 Jahr setzen
    setShowBanner(false);
    setShowIcon(false);
  };

  const handleReject = () => {
    document.cookie = "cookies-accepted=false; path=/; max-age=" + (60 * 60 * 24 * 365); // Cookie für 1 Jahr setzen
    setShowBanner(false);
    setShowIcon(false);
  };

  const handleMoreInfo = () => {
    window.location.href = "/privacy-policy"; // Leite den Benutzer zur Datenschutzrichtlinie weiter
  };

  const handleIconClick = () => {
    setShowBanner(true);
    setShowIcon(false);
  };

  if (!showIcon && !showBanner) return null;

  return (
    <>
      {showIcon && (
        <div className="cookie-icon" onClick={handleIconClick}>
          <FaCookieBite className="icon" />
        </div>
      )}
      {showBanner && (
        <div className="cookie-consent-banner">
          <p className="cookie-text">
            Diese Website verwendet Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
            <button onClick={handleMoreInfo} className="info-button">Erfahren Sie mehr</button>
          </p>
          <div className="cookie-buttons">
            <button onClick={handleAccept} className="accept-button">Akzeptieren</button>
            <button onClick={handleReject} className="reject-button">Ablehnen</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
