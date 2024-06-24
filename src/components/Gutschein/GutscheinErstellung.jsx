import React, { useState } from 'react';
import axios from 'axios';
import './GutscheinErstellung.scss';

const GutscheinErstellung = () => {
  const [guthaben, setGuthaben] = useState(0); // Standardwert auf 0 setzen
  const [gueltigBis, setGueltigBis] = useState('');
  const [gutscheinrabatt, setGutscheinrabatt] = useState('');
  const [gutscheinaktiviert, setGutscheinaktiviert] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateGutschein = async () => {
    try {
      const rabattInDezimal = gutscheinrabatt ? parseFloat(gutscheinrabatt) / 100 : 0; // Umwandlung von 20 in 0.2
      const gutschein = {
        guthaben,
        gueltigBis,
        gutscheinrabatt: rabattInDezimal,
        gutscheinaktiviert
      };

      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine', gutschein);

      setMessage(`Gutschein erfolgreich erstellt mit ID: ${response.data.data.id}`);
    } catch (error) {
      console.error('Fehler beim Erstellen des Gutscheins:', error);
      setMessage('Es gab ein Problem beim Erstellen des Gutscheins. Bitte versuchen Sie es später erneut.');
    }
  };

  const handleGutscheinrabattChange = (e) => {
    const value = e.target.value;
    setGutscheinrabatt(value);
    if (value) {
      setGuthaben(0); // Setzt guthaben auf 0, wenn gutscheinrabatt gesetzt ist
    }
  };

  return (
    <div className="gutschein-erstellung">
      <h2>Gutschein erstellen</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="guthaben">Guthaben:</label>
          <input
            type="number"
            id="guthaben"
            value={guthaben}
            onChange={(e) => setGuthaben(e.target.value)}
            disabled={!!gutscheinrabatt} // Deaktiviert das Feld, wenn gutscheinrabatt gesetzt ist
          />
        </div>
        <div className="form-group">
          <label htmlFor="gueltigBis">Gültig bis:</label>
          <input
            type="date"
            id="gueltigBis"
            value={gueltigBis}
            onChange={(e) => setGueltigBis(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gutscheinrabatt">Gutscheinrabatt (%):</label>
          <input
            type="number"
            id="gutscheinrabatt"
            value={gutscheinrabatt}
            onChange={handleGutscheinrabattChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gutscheinaktiviert">Gutschein aktiviert:</label>
          <input
            type="checkbox"
            id="gutscheinaktiviert"
            checked={gutscheinaktiviert}
            onChange={(e) => setGutscheinaktiviert(e.target.checked)}
          />
        </div>
        <button type="button" onClick={handleCreateGutschein}>
          Gutschein erstellen
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default GutscheinErstellung;
