import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTrash, FaUserClock, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import './ArbeitszeitDetails.scss';

const ArbeitszeitDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data.dienstleistungen || []);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Daten:', error);
      });
  }, [id]);

  const handleDetailClick = (dienstleistungId) => {
    if (!dienstleistungId) return;
    window.location.href = `/arbeitszeit-erfassen/${id}/${dienstleistungId}`;
  };

  const handleDeleteClick = (arbeitszeitId) => {
    const token = localStorage.getItem('token');

    axios
      .delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/${arbeitszeitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setData((prevData) =>
          prevData.map((dienstleistung) => ({
            ...dienstleistung,
            arbeitszeiten: dienstleistung.arbeitszeiten.filter(
              (mitarbeiter) => mitarbeiter.arbeitszeit_id !== arbeitszeitId
            ),
          }))
        );
      })
      .catch((error) => {
        console.error('Fehler beim Löschen der Arbeitszeit:', error);
      });
  };

  return (
    <div className="arbeitszeit-container">
      <h1><FaUserClock /> Arbeitszeiten</h1>
      {data.length > 0 ? (
        data.map((dienstleistung) => (
          <div key={dienstleistung.dienstleistung_id} className="dienstleistung-section">
            <div className="dienstleistung-header">
              <h2><FaCalendarAlt /> {dienstleistung.dienstleistung}</h2>
              <button onClick={() => handleDetailClick(dienstleistung.dienstleistung_id)} className="details-button">
                <FaPlus /> Neue Zeit erfassen
              </button>
            </div>

            <div className="arbeitszeit-box">
              {dienstleistung.arbeitszeiten.length > 0 ? (
                dienstleistung.arbeitszeiten.map((mitarbeiter) => (
                  <div key={mitarbeiter.arbeitszeit_id} className="mitarbeiter-box">
                    <div className="mitarbeiter-info">
                      <p><strong>👤 {mitarbeiter.vorname} {mitarbeiter.nachname}</strong></p>
                      <p>⏳ {new Date(mitarbeiter.start_time).toLocaleString()} - {new Date(mitarbeiter.end_time).toLocaleString()}</p>
                      <p>🕒 {mitarbeiter.arbeitszeit} Std.</p>
                    </div>
                    <button onClick={() => handleDeleteClick(mitarbeiter.arbeitszeit_id)} className="delete-button">
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-data">Keine Arbeitszeiten verfügbar.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="no-data">Keine Dienstleistungen verfügbar.</p>
      )}
    </div>
  );
};

export default ArbeitszeitDetails;