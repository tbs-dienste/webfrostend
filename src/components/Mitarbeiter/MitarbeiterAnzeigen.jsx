import React, { useState, useEffect } from 'react';
import './MitarbeiterAnzeigen.scss';

function MitarbeiterAnzeigen() {
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]);

  useEffect(() => {
    const storedMitarbeiter = localStorage.getItem('mitarbeiter');
    if (storedMitarbeiter) {
      setMitarbeiterListe(JSON.parse(storedMitarbeiter));
    }
  }, []);

  return (
    <div className="mitarbeiter-anzeigen-container">
      <h2 className="mitarbeiter-anzeigen-title">Alle Mitarbeiter</h2>
      <ul className="mitarbeiter-liste">
        {mitarbeiterListe.map((mitarbeiter, index) => (
          <li key={index} className="mitarbeiter-list-item">
            <div className="mitarbeiter-details">
              <span className="mitarbeiter-detail">Vorname: {mitarbeiter.vorname}</span>
              <span className="mitarbeiter-detail">Nachname: {mitarbeiter.nachname}</span>
              <span className="mitarbeiter-detail">IBAN: {mitarbeiter.iban}</span>
              <span className="mitarbeiter-detail">Adresse: {mitarbeiter.adresse}</span>
              <span className="mitarbeiter-detail">Benutzername: {mitarbeiter.benutzername}</span>
              <span className="mitarbeiter-detail">Passwort: {mitarbeiter.passwort}</span>
              <span className="mitarbeiter-detail">Status: {mitarbeiter.online ? (
  <span className="mitarbeiter-status-circle mitarbeiter-status-online"></span>
) : (
  <span className="mitarbeiter-status-circle mitarbeiter-status-offline"></span>
)}
</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MitarbeiterAnzeigen;
