import React, { useState } from 'react';
import axios from 'axios';
import './GutscheinErstellung.scss';

const GutscheinErstellung = () => {
  const [anzahl, setAnzahl] = useState(1);
  const [guthaben, setGuthaben] = useState('');
  const [gutscheincode, setGutscheincode] = useState('');
  const [generierteCodes, setGenerierteCodes] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleCreateGutscheine = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/generate',
        { anzahl, guthaben },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Gutscheine erfolgreich erstellt.`);
      setMessageType('success');
      setGenerierteCodes(response.data.data);
      setAnzahl(1);
      setGuthaben('');
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
      setMessage('Erstellung fehlgeschlagen.');
      setMessageType('error');
    }
  };

  const handleActivateGutschein = async () => {
    try {
      if (!gutscheincode || guthaben <= 0) {
        setMessage('Gutscheincode und Guthaben erforderlich.');
        setMessageType('error');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/activate',
        { gutscheincode, guthaben },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setMessageType('success');
      setGutscheincode('');
      setGuthaben('');
    } catch (error) {
      console.error('Fehler bei der Aktivierung:', error);
      setMessage('Aktivierung fehlgeschlagen.');
      setMessageType('error');
    }
  };

  return (
    <div className="gutschein-erstellung">
      <h2>Gutscheine erstellen / aktivieren</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="anzahl">Anzahl Gutscheine</label>
          <input
            type="number"
            id="anzahl"
            value={anzahl}
            onChange={(e) => setAnzahl(e.target.value)}
            min="1"
            placeholder="Anzahl der Gutscheine"
          />
        </div>

        <div className="form-group">
          <label htmlFor="guthaben">Guthaben pro Gutschein (€)</label>
          <input
            type="number"
            id="guthaben"
            value={guthaben}
            onChange={(e) => setGuthaben(e.target.value)}
            placeholder="Guthaben eingeben"
          />
        </div>

        <button type="button" onClick={handleCreateGutscheine}>
          Gutscheine erstellen
        </button>

        {generierteCodes.length > 0 && (
          <div className="gutscheine-liste">
            <h3>Generierte Gutscheincodes:</h3>
            <ul>
              {generierteCodes.map((gutschein, index) => (
                <li key={index}>{gutschein.gutscheincode} - {gutschein.guthaben}€</li>
              ))}
            </ul>
          </div>
        )}

        <hr />

        <div className="form-group">
          <label htmlFor="gutscheincode">Gutscheincode</label>
          <input
            type="text"
            id="gutscheincode"
            value={gutscheincode}
            onChange={(e) => setGutscheincode(e.target.value)}
            placeholder="Gutscheincode eingeben"
          />
        </div>

        <button type="button" onClick={handleActivateGutschein}>
          Gutschein aktivieren
        </button>
      </form>
    </div>
  );
};

export default GutscheinErstellung;