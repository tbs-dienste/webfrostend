import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importiere Link aus react-router-dom
import './Kunden.scss';

const Kunden = () => {
  const [kunden, setKunden] = useState([]);

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

  return (
    <div className="kunde">
      <h2>Gespeicherte Kunden</h2>
      <div className="kunden-liste">
        {kunden.length > 0 ? (
          kunden.map((kunde) => (
            <div key={kunde.id} className="kunden-box">
              <p>{kunde.vorname} {kunde.nachname}</p>
              {/* Weitere Daten anzeigen */}
              <Link to={`/zeiterfassung/${kunde.id}`}>
                <button>Arbeitszeit</button>
              </Link>
              <Link to={`/rechnung/${kunde.id}`}>
                <button>Rechnung erstellen</button>
              </Link>
              <button onClick={() => handleKundeLöschen(kunde.id)}>Kunde löschen</button>
            </div>
          ))
        ) : (
          <p>Keine Kunden gespeichert</p>
        )}
      </div>
    </div>
  );
};

export default Kunden;
