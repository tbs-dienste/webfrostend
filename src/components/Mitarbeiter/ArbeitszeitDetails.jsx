import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // useParams importieren
import './ArbeitszeitDetails.scss'; // Importiere das SCSS-Stylesheet

const ArbeitszeitDetails = () => {
  const { id } = useParams(); // Hole die Kunden-ID aus den URL-Parametern
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Hole das Token aus dem localStorage

    axios
      .get(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Füge das Token im Authorization-Header hinzu
        },
      })
      .then((response) => {
        console.log('API-Antwort:', response.data); // Gebe die komplette Antwort aus
        setData(response.data.data);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Daten:', error);
      });
  }, [id]);

  // Funktion zur Behandlung des Klicks auf das "+"-Symbol
  const handleDetailClick = (dienstleistungId) => {
    if (!dienstleistungId) {
      console.error("Dienstleistungs-ID ist undefined");
      return;
    }
    console.log(`Details für Dienstleistung ID: ${dienstleistungId}`);
    // Ändere die URL und leite weiter
    window.location.href = `/arbeitszeit-erfassen/${id}/${dienstleistungId}`;
  };

  return (
    <div className="arbeitszeit-container">
      <h1>Arbeitszeiten</h1>
      {data.length > 0 ? (
        data.map((dienstleistung, index) => {
          const dienstleistungId = dienstleistung.dienstleistung_id; // Überprüfen, ob die ID vorhanden ist

          if (!dienstleistungId) {
            console.error(`Dienstleistung mit Index ${index} hat keine ID`);
          } else {
            console.log(`Generierte Dienstleistung ID: ${dienstleistungId}`);
          }

          return (
            <div key={index} className="dienstleistung-section">
              <h2>
                {dienstleistung.dienstleistung} (ID: {dienstleistungId}) {/* ID neben dem Titel anzeigen */}
                <button onClick={() => handleDetailClick(dienstleistungId)} className="details-button">
                  +
                </button>
              </h2>
              <div className="arbeitszeit-box">
                {dienstleistung.mitarbeiter.map((mitarbeiter, mitIndex) => (
                  <div key={mitIndex} className="mitarbeiter-box">
                    <p><strong>Vorname:</strong> {mitarbeiter.vorname}</p>
                    <p><strong>Nachname:</strong> {mitarbeiter.nachname}</p>
                    <p><strong>Startzeit:</strong> {new Date(mitarbeiter.start_time).toLocaleString()}</p>
                    <p><strong>Endzeit:</strong> {new Date(mitarbeiter.end_time).toLocaleString()}</p>
                    <p><strong>Arbeitszeit (Stunden):</strong> {mitarbeiter.arbeitszeit}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>Keine Arbeitszeiten verfügbar.</p>
      )}
    </div>
  );
};

export default ArbeitszeitDetails;
