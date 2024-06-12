import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mitarbeiter.scss'; // Stil für diese Komponente
import { Link } from 'react-router-dom';

function Mitarbeiter() {
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]);

  useEffect(() => {
    const fetchMitarbeiter = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter`);
        setMitarbeiterListe(response.data.data); // Hier greifen wir auf die "data"-Eigenschaft der API-Antwort zu
      } catch (error) {
        console.error('Fehler beim Laden der Mitarbeiter:', error);
        setMitarbeiterListe([]);
      }
    };

    fetchMitarbeiter();
  }, []); // Keine Abhängigkeit, da wir die Mitarbeiterliste nur einmal laden möchten

  const handleMitarbeiterLoeschen = async (id) => {
    try {
      await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`);
      const updatedList = mitarbeiterListe.filter(mitarbeiter => mitarbeiter.id !== id);
      setMitarbeiterListe(updatedList);
    } catch (error) {
      console.error('Fehler beim Löschen des Mitarbeiters:', error);
    }
  };

  return (
    <div className="mitarbeiter-anzeigen-container">
      <h2 className="mitarbeiter-anzeigen-title">Mitarbeiter anzeigen</h2>
      <ul className="mitarbeiter-liste">
        {mitarbeiterListe.map((mitarbeiter) => (
          <li key={mitarbeiter.id} className="mitarbeiter-list-item">
            <span className="mitarbeiter-name">{mitarbeiter.vorname} {mitarbeiter.nachname}</span>
            <span className="mitarbeiter-status">{mitarbeiter.online ? 'Online' : 'Offline'}</span>
            <button onClick={() => handleMitarbeiterLoeschen(mitarbeiter.id)}>Löschen</button>
            <Link to={`/mitarbeiteranzeigen/${mitarbeiter.id}`} className="details-link">Mehr</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Mitarbeiter;
