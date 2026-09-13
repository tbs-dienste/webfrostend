import React, { useState, useEffect } from "react";
import "./CookieConsent.scss";
import { FaCookieBite } from "react-icons/fa";

const COOKIE_NAME = "cookies-accepted";
const COOKIE_DURATION = 60 * 60 * 24 * 365;

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const hasCookieDecision = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));

    // Wenn bereits entschieden wurde:
    // Cookie-Banner und Cookie-Icon bleiben dauerhaft unsichtbar.
    if (hasCookieDecision) {
      setShowBanner(false);
      setShowIcon(false);
      return;
    }

    // Nur beim allerersten Besuch anzeigen
    setShowIcon(true);
  }, []);

  const saveCookieDecision = (value) => {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_DURATION}; SameSite=Lax`;

    setShowBanner(false);
    setShowIcon(false);
  };

  const handleAccept = () => {
    saveCookieDecision("true");
  };

  const handleReject = () => {
    saveCookieDecision("false");
  };

  const handleMoreInfo = () => {
    window.location.href = "/privacy-policy";
  };

  const handleIconClick = () => {
    setShowBanner(true);
    setShowIcon(false);
  };

  // Wenn bereits entschieden wurde, überhaupt nichts rendern.
  if (!showIcon && !showBanner) {
    return null;
  }

  return (
    <>
      {showIcon && (
        <button
          type="button"
          className="cookie-icon"
          onClick={handleIconClick}
          aria-label="Cookie-Einstellungen öffnen"
        >
          <FaCookieBite className="icon" />
        </button>
      )}

      {showBanner && (
        <div className="cookie-consent-banner">
          <p className="cookie-text">
            Diese Website verwendet Cookies, um Ihnen die beste Erfahrung auf
            unserer Website zu bieten.

            <button
              type="button"
              onClick={handleMoreInfo}
              className="info-button"
            >
              Erfahren Sie mehr
            </button>
          </p>

          <div className="cookie-buttons">
            <button
              type="button"
              onClick={handleAccept}
              className="accept-button"
            >
              Akzeptieren
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="reject-button"
            >
              Ablehnen
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
