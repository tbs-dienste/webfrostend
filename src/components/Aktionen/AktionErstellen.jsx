import React, { useState } from 'react';
import axios from 'axios';
import './AktionErstellen.scss';

const AktionErstellen = () => {
  const [form, setForm] = useState({
    name: '',
    beschreibung: '',
    rabatt: '',
    startDatum: '',
    endDatum: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccessMsg(null);
  };

  const validateForm = () => {
    const { name, beschreibung, rabatt, startDatum, endDatum } = form;
    if (!name || !beschreibung || !rabatt || !startDatum || !endDatum) {
      setError('Bitte alle Felder ausfüllen.');
      return false;
    }
    const rabattNum = Number(rabatt);
    if (isNaN(rabattNum) || rabattNum <= 0 || rabattNum >= 100) {
      setError('Rabatt muss eine Zahl zwischen 1 und 99 sein.');
      return false;
    }
    if (new Date(startDatum) > new Date(endDatum)) {
      setError('Startdatum darf nicht nach dem Enddatum liegen.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/aktionen',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg('Aktion erfolgreich erstellt!');
      setForm({ name: '', beschreibung: '', rabatt: '', startDatum: '', endDatum: '' });
    } catch (err) {
      setError(
        err.response?.data?.error || 'Fehler beim Erstellen der Aktion. Bitte versuche es erneut.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aktion-erstellen">
      <h2>Neue Aktion erstellen</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name der Aktion"
            required
          />
        </label>

        <label>
          Beschreibung
          <textarea
            name="beschreibung"
            value={form.beschreibung}
            onChange={handleChange}
            placeholder="Beschreibung der Aktion"
            rows="4"
            required
          />
        </label>

        <label>
          Rabatt in Prozent
          <input
            type="number"
            name="rabatt"
            value={form.rabatt}
            onChange={handleChange}
            placeholder="z.B. 10"
            min="1"
            max="99"
            required
          />
        </label>

        <label>
          Startdatum
          <input
            type="date"
            name="startDatum"
            value={form.startDatum}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Enddatum
          <input
            type="date"
            name="endDatum"
            value={form.endDatum}
            onChange={handleChange}
            required
          />
        </label>

        {error && <div className="error-message">{error}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Speichert...' : 'Aktion erstellen'}
        </button>
      </form>
    </div>
  );
};

export default AktionErstellen;
