import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './ArbeitszeitDetails.scss';

const ArbeitszeitDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('API-Antwort:', response.data);
        setData(response.data.dienstleistungen); // Setze die Dienstleistungen direkt
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Daten:', error);
      });
  }, [id]);

  const handleDetailClick = (dienstleistungId) => {
    if (!dienstleistungId) {
      console.error("Dienstleistungs-ID ist undefined");
      return;
    }
    console.log(`Details für Dienstleistung ID: ${dienstleistungId}`);
    window.location.href = `/arbeitszeit-erfassen/${id}/${dienstleistungId}`;
  };

  const handleDeleteClick = (arbeitszeitId) => {
    const token = localStorage.getItem('token');

    axios
      .delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/${arbeitszeitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Arbeitszeit gelöscht:', response.data);
        setData((prevData) => {
          return prevData.map((dienstleistung) => ({
            ...dienstleistung,
            arbeitszeiten: dienstleistung.arbeitszeiten.filter((mitarbeiter) => mitarbeiter.arbeitszeit_id !== arbeitszeitId),
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
          const dienstleistungId = dienstleistung.dienstleistung_id;

          if (!dienstleistungId) {
            console.error(`Dienstleistung hat keine ID`);
            return null;
          }

          return (
            <div key={dienstleistungId} className="dienstleistung-section">
              <h2>
                {dienstleistung.dienstleistung} (ID: {dienstleistungId})
                <button onClick={() => handleDetailClick(dienstleistungId)} className="details-button">
                  +
                </button>
              </h2>
              <div className="arbeitszeit-box">
                {dienstleistung.arbeitszeiten.length > 0 ? (
                  dienstleistung.arbeitszeiten.map((mitarbeiter) => (
                    <div key={mitarbeiter.arbeitszeit_id} className="mitarbeiter-box">
                      <p><strong>Vorname:</strong> {mitarbeiter.vorname}</p>
                      <p><strong>Nachname:</strong> {mitarbeiter.nachname}</p>
                      <p><strong>Startzeit:</strong> {new Date(mitarbeiter.start_time).toLocaleString()}</p>
                      <p><strong>Endzeit:</strong> {new Date(mitarbeiter.end_time).toLocaleString()}</p>
                      <p><strong>Arbeitszeit (Stunden):</strong> {mitarbeiter.arbeitszeit}</p>
                      <button 
                        onClick={() => handleDeleteClick(mitarbeiter.arbeitszeit_id)} 
                        className="delete-button"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Keine Arbeitszeiten verfügbar.</p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>Keine Dienstleistungen verfügbar.</p>
      )}
    </div>
  );
};

export default ArbeitszeitDetails;
