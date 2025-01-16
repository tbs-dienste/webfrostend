import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './KassenUebersicht.scss';
import blacklogo from './black.png'; // Bild importieren
import { FaDoorOpen } from 'react-icons/fa'; // Icon von react-icons importieren

const KassenUebersicht = ({ onKassenModusChange }) => {
  // Setzt den Kassenmodus beim Laden der Seite auf true, wenn erforderlich
  useEffect(() => {
    onKassenModusChange(true);
    // Cleanup: Kassenmodus zurücksetzen, wenn die Komponente verlassen wird
    return () => {
      onKassenModusChange(false);
    };
  }, [onKassenModusChange]);

  return (
    <div className="kassen-übersicht">
      <div className="kassen-übersicht__header">
        <img
          src={blacklogo}
          alt="Kassenübersicht Hintergrund"
          className="kassen-übersicht__image"
        />
        <div className="kassen-übersicht__text-wrapper">
          <div className="kassen-übersicht__text">Kassensystem</div>
        </div>
      </div>
      <div className="kassen-übersicht__links">
        <Link to="/kasse" className="link">Verkauf</Link>
        <Link to="/einnahmeausgabe" className="link">Einnahmen Ausgaben</Link>
        <Link to="/prov-abschluss" className="link">Prov. Abschluss</Link>
        <Link to="/receipts" className="link">Tagesübersicht</Link>
        <Link to="/kassenlogin" className="link">
          <FaDoorOpen className="exit-icon" /> 
        </Link>
      </div>
    </div>
  );
};

export default KassenUebersicht;
