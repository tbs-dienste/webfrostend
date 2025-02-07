import React, { useState } from 'react';
import axios from 'axios';
import './GutscheinErstellung.scss';

const GutscheinErstellung = () => {
  const [guthaben, setGuthaben] = useState('');
  const [gutscheinrabatt, setGutscheinrabatt] = useState('');
  const [gutscheincode, setGutscheincode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleCreateGutschein = async () => {
    try {
      const rabattInDezimal = gutscheinrabatt ? parseFloat(gutscheinrabatt) / 100 : 0;
      const gutschein = { guthaben, gutscheinrabatt: rabattInDezimal };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine',
        gutschein,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Gutschein erfolgreich erstellt: ${response.data.data.gutscheincode}`);
      setMessageType('success');
      setGuthaben('');
      setGutscheinrabatt('');
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
      <h2>Gutschein erstellen / aktivieren</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="guthaben">Guthaben (€)</label>
          <input
            type="number"
            id="guthaben"
            value={guthaben}
            onChange={(e) => setGuthaben(e.target.value)}
            placeholder="Guthaben eingeben"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gutscheinrabatt">Rabatt (%)</label>
          <input
            type="number"
            id="gutscheinrabatt"
            value={gutscheinrabatt}
            onChange={(e) => setGutscheinrabatt(e.target.value)}
            placeholder="Rabatt in % eingeben"
          />
        </div>

        <button type="button" onClick={handleCreateGutschein}>Gutschein erstellen</button>

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

        <button type="button" onClick={handleActivateGutschein}>Gutschein aktivieren</button>
      </form>
    </div>
  );
};

export default GutscheinErstellung;