import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // useParams importieren
import { FaTrash } from 'react-icons/fa'; // Importiere das Trash-Icon
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

  // Funktion zur Löschung der Arbeitszeit
  const handleDeleteClick = (arbeitszeitId) => {
    const token = localStorage.getItem('token');

    axios
      .delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/${arbeitszeitId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token für Authentifizierung
        },
      })
      .then((response) => {
        console.log('Arbeitszeit gelöscht:', response.data);
        // Nach dem Löschen die Liste aktualisieren
        setData((prevData) => {
          return prevData.map((dienstleistung) => ({
            ...dienstleistung,
            mitarbeiter: dienstleistung.mitarbeiter.filter((mitarbeiter) => mitarbeiter.arbeitszeit_id !== arbeitszeitId), // Filtere nach der Arbeitszeit-ID
          }));
        });
      })
      .catch((error) => {
        console.error('Fehler beim Löschen der Arbeitszeit:', error);
      });
  };

  return (
    <div className="arbeitszeit-container">
      <h1>Arbeitszeiten</h1>
      {data.length > 0 ? (
        data.map((dienstleistung) => {
          const dienstleistungId = dienstleistung.dienstleistung_id; // Überprüfen, ob die ID vorhanden ist

          if (!dienstleistungId) {
            console.error(`Dienstleistung hat keine ID`);
            return null; // Rückgabe null, wenn die ID nicht vorhanden ist
          }

          return (
            <div key={dienstleistungId} className="dienstleistung-section">
              <h2>
                {dienstleistung.dienstleistung} (ID: {dienstleistungId}) {/* ID neben dem Titel anzeigen */}
                <button onClick={() => handleDetailClick(dienstleistungId)} className="details-button">
                  +
                </button>
              </h2>
              <div className="arbeitszeit-box">
                {dienstleistung.mitarbeiter.map((mitarbeiter) => (
                  <div key={mitarbeiter.arbeitszeit_id} className="mitarbeiter-box"> {/* Verwende die Arbeitszeit-ID als Schlüssel */}
                    <p><strong>Vorname:</strong> {mitarbeiter.vorname}</p>
                    <p><strong>Nachname:</strong> {mitarbeiter.nachname}</p>
                    <p><strong>Startzeit:</strong> {new Date(mitarbeiter.start_time).toLocaleString()}</p>
                    <p><strong>Endzeit:</strong> {new Date(mitarbeiter.end_time).toLocaleString()}</p>
                    <p><strong>Arbeitszeit (Stunden):</strong> {mitarbeiter.arbeitszeit}</p>
                    <button 
                      onClick={() => handleDeleteClick(mitarbeiter.arbeitszeit_id)} // Übergebe die Arbeitszeit-ID für das Löschen
                      className="delete-button"
                    >
                      <FaTrash />
                    </button>
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
