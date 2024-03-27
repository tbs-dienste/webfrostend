import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Kunden.scss';

const Kunden = () => {
  const [kunden, setKunden] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedKunden = localStorage.getItem('kunden');
    if (storedKunden) {
      setKunden(JSON.parse(storedKunden));
    }
  }, []);

  const handleKundeLöschen = (id) => {
    const updatedKunden = kunden.filter(kunde => kunde.id !== id);
    setKunden(updatedKunden);
    localStorage.setItem('kunden', JSON.stringify(updatedKunden));
  };

  const filteredKunden = kunden.filter((kunde) => {
    const fullName = `${kunde.vorname} ${kunde.nachname}`;
    return (
      kunde.kundennummer.toString().includes(searchTerm) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kunde.aufträge.some(auftrag =>
        auftrag.auftragsnummer.toString().includes(searchTerm)
      )
    );
  });

  return (
    <div className="kunden-container">
      <h2 className="kunden-title">Gespeicherte Kunden</h2>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Kundennummer, Vorname, Nachname oder Auftragsnummer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="kunden-liste">
        {filteredKunden.length > 0 ? (
          filteredKunden.map((kunde) => (
            <div key={kunde.id} className="kunden-box">
              <p className="kunden-nummer">Kundennummer: {kunde.kundennummer}</p>
              <p className="kunden-name">{kunde.vorname} {kunde.nachname}</p>
              {/* Weitere Daten anzeigen */}
              <div className="kunden-buttons">
                <Link to={`/zeiterfassung/${kunde.id}`} className="kunden-button">
                  Arbeitszeit
                </Link>
                <Link to={`/rechnung/${kunde.id}`} className="kunden-button">
                  Rechnung erstellen
                </Link>
                <Link to={`/auftrag/${kunde.id}`} className="kunden-button">
                  Auftrag
                </Link>
                <Link to={`/kunden/${kunde.id}`} className="kunden-button">
                  Kunden anzeigen
                </Link>
                <button onClick={() => handleKundeLöschen(kunde.id)} className="kunden-button">
                  Kunde löschen
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Keine Kunden gefunden</p>
        )}
      </div>
    </div>
  );
};

export default Kunden;
