import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Link, useParams } from 'react-router-dom';
import './BewertungDetail.scss';

const BewertungDetail = () => {
  const { id } = useParams(); // ID der Bewertung aus der URL
  const [bewertung, setBewertung] = useState(null); // Zustand für die Bewertung

  // Lade die Bewertung bei der Initialisierung und bei Änderung der ID
  useEffect(() => {
    const fetchBewertung = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${id}`);
        
        if (response.data.data && response.data.data.length > 0) {
          setBewertung(response.data.data[0]); // Speichere die Bewertung, wenn Daten vorhanden sind
        } else {
          setBewertung(null); // Wenn keine Bewertung gefunden wurde
        }
      } catch (error) {
        console.error('Fehler beim Laden der Bewertung:', error);
        setBewertung(null); // Setze auf null im Fehlerfall
      }
    };

    fetchBewertung();
  }, [id]); // Dependency Array, damit die Funktion bei Änderung der ID neu ausgeführt wird

  if (!bewertung) {
    return <div className="loading">Lade Bewertung...</div>; // Anzeige während der API-Abfrage
  }

  return (
    <div className="bewertung-detail">
      <Link to="/bewertungen" className="back-button">Zurück</Link>
      <h2>Bewertungsdetails</h2>
      <div className="bewertung-container">
        {/* Dynamisch alle Bewertungskriterien anzeigen */}
        {['arbeitsqualität', 'tempo', 'gesamt', 'freundlichkeit', 'zufriedenheit'].map((field) => (
          <div key={field} className="bewertung-section">
            <p className="bewertung-label">
              <strong>{capitalizeFirstLetter(field)}:</strong> {bewertung[field]}
            </p>
            <ReactStars
              count={5}
              value={parseFloat(bewertung[`${field}_rating`])}
              size={24}
              color2={'#FFD700'}
              edit={false} // Bewertung nur lesbar, nicht editierbar
            />
          </div>
        ))}
        
        {/* Kommentar anzeigen */}
        <div className="bewertung-section">
          <p className="bewertung-label"><strong>Kommentar:</strong> {bewertung.gesamttext}</p>
        </div>
      </div>
    </div>
  );
};

// Helferfunktion zur Großschreibung des ersten Buchstabens eines Strings
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default BewertungDetail;
