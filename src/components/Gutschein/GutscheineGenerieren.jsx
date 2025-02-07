import React, { useState } from 'react';
import axios from 'axios';
import './GutscheineGenerieren.scss';

const GutscheineGenerieren = () => {
  const [anzahl, setAnzahl] = useState('');
  const [guthaben, setGuthaben] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [generierteGutscheine, setGenerierteGutscheine] = useState([]);

  const handleGenerateGutscheine = async () => {
    try {
      if (!anzahl || anzahl <= 0) {
        setMessage('Bitte eine gültige Anzahl eingeben.');
        setMessageType('error');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/generate',
        { anzahl, guthaben },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGenerierteGutscheine(response.data.data);
      setMessage('Gutscheine erfolgreich generiert.');
      setMessageType('success');
      setAnzahl('');
      setGuthaben('');
    } catch (error) {
      console.error('Fehler beim Generieren:', error);
      setMessage('Erstellung fehlgeschlagen.');
      setMessageType('error');
    }
  };

  return (
    <div className="gutscheine-generieren">
      <h2>Gutscheine generieren</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="anzahl">Anzahl der Gutscheine</label>
          <input
            type="number"
            id="anzahl"
            value={anzahl}
            onChange={(e) => setAnzahl(e.target.value)}
            placeholder="Anzahl eingeben"
          />
        </div>

        <div className="form-group">
          <label htmlFor="guthaben">Guthaben pro Gutschein (€)</label>
          <input
            type="number"
            id="guthaben"
            value={guthaben}
            onChange={(e) => setGuthaben(e.target.value)}
            placeholder="Guthaben pro Gutschein eingeben"
          />
        </div>

        <button type="button" onClick={handleGenerateGutscheine}>
          Gutscheine generieren
        </button>
      </form>

      {generierteGutscheine.length > 0 && (
        <div className="gutscheine-liste">
          <h3>Generierte Gutscheine</h3>
          <ul>
            {generierteGutscheine.map((gutschein, index) => (
              <li key={index}>
                <strong>Code:</strong> {gutschein.gutscheincode} – 
                <strong> Guthaben:</strong> {gutschein.guthaben}€
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GutscheineGenerieren;