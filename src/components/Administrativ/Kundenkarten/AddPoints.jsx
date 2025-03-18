import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddPoints.scss'; // <--- hier dein SCSS importieren!

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
      }, 1000);

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || 'Fehler beim Punkte nachtragen.');
    }
  };

  return (
    <div className="add-points-container">
      <h2>Punkte nachtragen</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="kundenkartennummer">Kundenkartennummer</label>
          <input
            type="text"
            id="kundenkartennummer"
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
            value={einkaufsbetrag}
            onChange={(e) => setEinkaufsbetrag(e.target.value)}
            required
          />
        </div>

        <div className="button-container">
          <button type="submit">Punkte hinzufügen</button>
        </div>

        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default AddPoints;
