import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddPoints.scss';

const AddPoints = () => {
  const [kundenkartennummer, setKundenkartennummer] = useState('');
  const [einkaufsbetrag, setEinkaufsbetrag] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten/addPoints',
        { kundenkartennummer, einkaufsbetrag },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setKundenkartennummer('');
      setEinkaufsbetrag('');

      setTimeout(() => {
        navigate('/kundenkarten');
      }, 1500);

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || 'Fehler beim Punkte nachtragen.');
    }
  };

  return (
    <div className="add-points-container">
      <div className="card">
        <h2>Punkte nachtragen</h2>
        <p className="subtitle">Trage hier die Kundendaten und den Betrag ein, um Punkte zu vergeben.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="kundenkartennummer">Kundenkartennummer</label>
            <input
              type="text"
              id="kundenkartennummer"
              placeholder="z.B. 1234567890"
              value={kundenkartennummer}
              onChange={(e) => setKundenkartennummer(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="einkaufsbetrag">Einkaufsbetrag (CHF)</label>
            <input
              type="number"
              id="einkaufsbetrag"
              placeholder="z.B. 59.90"
              value={einkaufsbetrag}
              onChange={(e) => setEinkaufsbetrag(e.target.value)}
              required
            />
          </div>

          <div className="info-box">
            <p><strong>Hinweis:</strong> Je nach Kundenstatus erhält der Kunde:</p>
            <ul>
              <li><strong>Normal:</strong> 4 Punkte pro CHF</li>
              <li><strong>Silber:</strong> 10 Punkte pro CHF</li>
              <li><strong>Gold:</strong> 13 Punkte pro CHF</li>
            </ul>
            <p>Bonusaktionen werden automatisch berücksichtigt.</p>
          </div>


          <div className="button-container">
            <button type="submit">
              <span>➕ Punkte hinzufügen</span>
            </button>
          </div>

          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
        </form>

        <div className="footer-note">
          <p>Zurück zur <span onClick={() => navigate('/kundenkarten')} className="link">Kundenkartenübersicht</span></p>
        </div>
      </div>
    </div>
  );
};

export default AddPoints;
