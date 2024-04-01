import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Kunden.scss';

const Kunden = () => {
  const [kunden, setKunden] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [musterKunde] = useState({
    id: 1,
    kundennummer: 123456,
    vorname: 'Max',
    nachname: 'Mustermann',
    aufträge: [
      { auftragsnummer: 987654, typ: 'Musterartikel', beschreibung: 'Dies ist eine Musterbeschreibung' }
    ]
  });

  useEffect(() => {
    const storedKunden = localStorage.getItem('kunden');
    if (storedKunden) {
      setKunden(JSON.parse(storedKunden));
    } else {
      setKunden([musterKunde]);
      localStorage.setItem('kunden', JSON.stringify([musterKunde]));
    }
  }, [musterKunde]);

  const handleKundeLöschen = (id) => {
    if (kunden.length > 1 || (kunden.length === 1 && id !== 1)) {
      const updatedKunden = kunden.filter(kunde => kunde.id !== id);
      setKunden(updatedKunden);
      localStorage.setItem('kunden', JSON.stringify(updatedKunden));
    } else {
      alert("Es muss mindestens ein Kunde vorhanden sein. Der Musterkunde kann nicht gelöscht werden.");
    }
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
          <div key={musterKunde.id} className="kunden-box">
            <p className="kunden-nummer">Kundennummer: {musterKunde.kundennummer}</p>
            <p className="kunden-name">{musterKunde.vorname} {musterKunde.nachname}</p>
            <div className="kunden-buttons">
              <Link to={`/zeiterfassung/${musterKunde.id}`} className="kunden-button">
                Arbeitszeit
              </Link>
              <Link to={`/rechnung/${musterKunde.id}`} className="kunden-button">
                Rechnung erstellen
              </Link>
              <Link to={`/auftrag/${musterKunde.id}`} className="kunden-button">
                Auftrag
              </Link>
              <Link to={`/kunden/${musterKunde.id}`} className="kunden-button">
                Kunden anzeigen
              </Link>
              <button disabled className="kunden-button">
                Kunde löschen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kunden;
