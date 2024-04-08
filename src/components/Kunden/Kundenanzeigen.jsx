import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './KundenAnzeigen.scss';

const KundenAnzeigen = ({ kunden }) => {
  const { id } = useParams();
  const kundeId = parseInt(id);
  const selectedKunde = kunden.find(kunde => kunde.id === kundeId);
  const [userIP, setUserIP] = useState('');

  useEffect(() => {
    const storedIP = localStorage.getItem('userIP');
    if (storedIP) {
      setUserIP(storedIP);
    }
  }, []);

  if (!selectedKunde) {
    return <div>Kein Kunde gefunden</div>;
  }

  return (
    <div className="kunden-anzeigen">
      <div className="header">
        <h2>Kundeninformationen</h2>
      </div>
      <div className="info">
        <p><span>Kundennummer:</span> {selectedKunde.kundennummer}</p>
        <p><span>Vorname:</span> {selectedKunde.vorname}</p>
        <p><span>Nachname:</span> {selectedKunde.nachname}</p>
        <h3>Aufträge</h3>
        {selectedKunde.aufträge.length > 0 ? (
          <ul>
            {selectedKunde.aufträge.map((auftrag, index) => (
              <li key={index}>
                <p><span>Auftragstyp:</span> {auftrag.typ}</p>
                <p><span>Beschreibung:</span> {auftrag.beschreibung}</p>
                <p><span>Auftragsnummer:</span> {auftrag.auftragsnummer}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-auftraege">Keine Aufträge für diesen Kunden</p> 
        )}
      </div>
      <div className="ip-info">
        <p><span>IP-Adresse:</span> {userIP}</p>
      </div>
    </div>
  );
};

export default KundenAnzeigen;
