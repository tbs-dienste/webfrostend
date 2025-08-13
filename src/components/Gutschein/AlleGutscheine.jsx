import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleGutscheine.scss';
import { FaPlus, FaGift } from 'react-icons/fa';

const AlleGutscheine = () => {
  const [gutscheine, setGutscheine] = useState([]);

  useEffect(() => {
    const fetchGutscheine = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGutscheine(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Gutscheine:', error);
        alert(
          'Es gab ein Problem beim Abrufen der Gutscheine. Bitte versuchen Sie es später erneut.'
        );
      }
    };

    fetchGutscheine();
  }, []);

  return (
    <div className="gutscheine-container">
      {/* Header-Bereich */}
      <div className="header">
        <h1>
          <FaGift style={{ marginRight: '8px', color: '#2d89ff' }} />
          Gutscheincodes
        </h1>
        <button
          className="btn-primary"
          onClick={() => (window.location.href = '/gutschein')}
        >
          <FaPlus /> Neuer Gutschein
        </button>
      </div>

      {/* Gutschein-Liste */}
      <div className="gutscheine-list">
        {gutscheine.length === 0 ? (
          <div className="empty-state">Keine Gutscheine vorhanden.</div>
        ) : (
          gutscheine.map((gutschein) => (
            <div className="gutschein-card" key={gutschein.gutscheincode}>
              <div className="gutschein-info">
                <p>
                  <span>Kartennummer:</span> {gutschein.kartennummer}
                </p>
                <p>
                  <span>Guthaben:</span> {gutschein.guthaben} CHF
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlleGutscheine;
