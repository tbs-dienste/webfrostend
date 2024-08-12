import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GutscheinErstellung.scss';

const GutscheinErstellung = () => {
  const [guthaben, setGuthaben] = useState(0);
  const [gueltigBis, setGueltigBis] = useState('');
  const [gutscheinrabatt, setGutscheinrabatt] = useState('');
  const [gutscheinaktiviert, setGutscheinaktiviert] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'

  // Effect to set "gueltigBis" to one year from today
  useEffect(() => {
    const today = new Date();
    const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
    const formattedDate = nextYear.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    setGueltigBis(formattedDate);
  }, []);

  const handleCreateGutschein = async () => {
    try {
      const rabattInDezimal = gutscheinrabatt ? parseFloat(gutscheinrabatt) / 100 : 0;
      const gutschein = {
        guthaben,
        gueltigBis,
        gutscheinrabatt: rabattInDezimal,
        gutscheinaktiviert
      };

      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine', gutschein);

      setMessage(`Gutschein erfolgreich erstellt mit ID: ${response.data.data.id}`);
      setMessageType('success');

      // Weiterleitung auf eine andere Seite nach erfolgreicher Erstellung
      window.location.href = '/gutscheine-liste'; // Ändere die URL nach Bedarf
    } catch (error) {
      console.error('Fehler beim Erstellen des Gutscheins:', error);
      setMessage('Es gab ein Problem beim Erstellen des Gutscheins. Bitte versuchen Sie es später erneut.');
      setMessageType('error');
    }
  };

  const handleGutscheinrabattChange = (e) => {
    const value = e.target.value;
    setGutscheinrabatt(value);
    if (value) {
      setGuthaben(0);
    }
  };

  return (
    <div className="gutschein-erstellung">
      <h2>Gutschein erstellen</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="guthaben">Guthaben</label>
          <input
            type="number"
            id="guthaben"
            value={guthaben}
            onChange={(e) => setGuthaben(e.target.value)}
            disabled={!!gutscheinrabatt}
            placeholder="Guthaben eingeben"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gueltigBis">Gültig bis</label>
          <input
            type="date"
            id="gueltigBis"
            value={gueltigBis}
            onChange={(e) => setGueltigBis(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gutscheinrabatt">Gutscheinrabatt (%)</label>
          <input
            type="number"
            id="gutscheinrabatt"
            value={gutscheinrabatt}
            onChange={handleGutscheinrabattChange}
            placeholder="Rabatt in Prozent"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gutscheinaktiviert" className="checkbox-label">
            <input
              type="checkbox"
              id="gutscheinaktiviert"
              checked={gutscheinaktiviert}
              onChange={(e) => setGutscheinaktiviert(e.target.checked)}
            />
            <span className="custom-checkbox"></span>
            Gutschein aktiviert
          </label>
        </div>
        <button type="button" onClick={handleCreateGutschein}>
          Gutschein erstellen
        </button>
        {message && (
          <p className={messageType === 'error' ? 'message error' : 'message success'}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default GutscheinErstellung;
