import React from 'react';
import { Link } from 'react-router-dom'; // Importiere Link von react-router-dom
import './KassenUebersicht.scss';
import blacklogo from './black.png'; // Bild importieren

const KassenUebersicht = () => {
  return (
    <div className="kassen-übersicht">
      <div className="kassen-übersicht__header">
        <img
          src={blacklogo}
          alt="Kassenübersicht Hintergrund"
          className="kassen-übersicht__image"
        />
        <div className="kassen-übersicht__text">Kassensystem</div>
      </div>
      <div className="kassen-übersicht__links">
        <Link to="/kasse" className="link">Verkauf</Link>
        <Link to="/einnahmen-ausgaben" className="link">Einnahmen Ausgaben</Link>
        <Link to="/prov-abschluss" className="link">Prov. Abschluss</Link>
        <Link to="/tagesuebersicht" className="link">Tagesübersicht</Link>
      </div>
    </div>
  );
};

export default KassenUebersicht;
