import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RechnungForm.scss';

const RechnungForm = () => {
  const { id } = useParams(); // Kunden-ID aus URL-Params abrufen
  const [benutzerdefinierteDienstleistungen, setBenutzerdefinierteDienstleistungen] = useState([
    { title: '', anzahl: 1, preisProEinheit: 0 },
  ]);
  const [message, setMessage] = useState('');

  const handleDienstleistungChange = (index, field, value) => {
    const updatedDienstleistungen = [...benutzerdefinierteDienstleistungen];
    updatedDienstleistungen[index][field] = field === 'anzahl' || field === 'preisProEinheit' ? Number(value) : value;
    setBenutzerdefinierteDienstleistungen(updatedDienstleistungen);
  };

  const handleDienstleistungHinzufuegen = () => {
    setBenutzerdefinierteDienstleistungen([
      ...benutzerdefinierteDienstleistungen,
      { title: '', anzahl: 1, preisProEinheit: 0 },
    ]);
  };

  const handleDienstleistungEntfernen = (index) => {
    setBenutzerdefinierteDienstleistungen((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      kundenId: id,
      dienstleistungen: benutzerdefinierteDienstleistungen,
    };

    try {
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Rechnung erfolgreich erstellt! ID: ${response.data.data.id}`);
    } catch (error) {
      console.error('Fehler beim Erstellen der Rechnung:', error);
      setMessage('Fehler beim Erstellen der Rechnung. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="rechnung-form-container">
      <h2>Rechnung erstellen</h2>
      <form onSubmit={handleSubmit}>
        <div className="info">
          <p>Kunden-ID: <strong>{id}</strong></p>
        </div>

        <div className="dienstleistungen-section">
          <h3>Dienstleistungen</h3>
          {benutzerdefinierteDienstleistungen.map((dienstleistung, index) => (
            <div className="dienstleistung-row" key={index}>
              <input
                type="text"
                placeholder="Dienstleistungstitel"
                value={dienstleistung.title}
                onChange={(e) => handleDienstleistungChange(index, 'title', e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                placeholder="Anzahl"
                value={dienstleistung.anzahl}
                onChange={(e) => handleDienstleistungChange(index, 'anzahl', e.target.value)}
                required
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Preis pro Einheit (€)"
                value={dienstleistung.preisProEinheit}
                onChange={(e) => handleDienstleistungChange(index, 'preisProEinheit', e.target.value)}
                required
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleDienstleistungEntfernen(index)}
              >
                Entfernen
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={handleDienstleistungHinzufuegen}
          >
            + Dienstleistung hinzufügen
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Rechnung erstellen
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RechnungForm;
