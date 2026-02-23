import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateProtokoll.scss';

export default function CreateProtokoll() {
  const [kunden, setKunden] = useState([]);
  const [mitarbeiter, setMitarbeiter] = useState([]);

  const [formData, setFormData] = useState({
    kundenId: '',
    projekt: '',
    ortOrFormat: '',
    teilnehmer: '',
    datum: '',
    uhrzeit: '',
    mitarbeiterId: '',
    grund: '',
    besprochenePunkte: '',
    Ergebnisse: '',
    aufgaben: '',
    offenepunkte: '',
    naechsteschritte: ''
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setMessage('❌ Kein Token gefunden! Bitte einloggen.');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    async function fetchData() {
      try {
        // Kunden laden
        const kundenRes = await axios.get(
          'https://tbsdigitalsolutionsbackend.onrender.com/api/kunden',
          config
        );
        setKunden(kundenRes.data.data);

        // Mitarbeiter laden
        const mitarbeiterRes = await axios.get(
          'https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter',
          config
        );
        setMitarbeiter(mitarbeiterRes.data.data); // JSON hat "data" Feld
      } catch (error) {
        console.error(error);
        setMessage('❌ Fehler beim Laden der Daten. Token evtl. ungültig.');
      }
    }

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('❌ Kein Token gefunden! Bitte einloggen.');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/protokolle',
        formData,
        config
      );

      setMessage('✅ Protokoll erstellt: ' + res.data.protokoll.id);

      setFormData({
        kundenId: '',
        projekt: '',
        ortOrFormat: '',
        teilnehmer: '',
        datum: '',
        uhrzeit: '',
        mitarbeiterId: '',
        grund: '',
        besprochenePunkte: '',
        Ergebnisse: '',
        aufgaben: '',
        offenepunkte: '',
        naechsteschritte: ''
      });
    } catch (error) {
      console.error(error);
      setMessage('❌ Fehler beim Erstellen: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="create-protokoll-container">
      <h1>Protokoll erstellen</h1>
      {message && (
        <div className={message.startsWith('✅') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      <form className="create-protokoll-form" onSubmit={handleSubmit}>

        {/* Kunden Dropdown */}
        <div className="form-group">
          <label>Kunde:</label>
          <select name="kundenId" value={formData.kundenId} onChange={handleChange} required>
            <option value="">-- Kunde wählen --</option>
            {kunden.map(k => {
              const displayName = k.firma ? k.firma : `${k.vorname} ${k.nachname}`;
              return <option key={k.id} value={k.id}>{displayName}</option>;
            })}
          </select>
        </div>

        {/* Mitarbeiter Dropdown */}
        <div className="form-group">
          <label>Mitarbeiter:</label>
          <select name="mitarbeiterId" value={formData.mitarbeiterId} onChange={handleChange} required>
            <option value="">-- Mitarbeiter wählen --</option>
            {mitarbeiter.map(m => {
              const displayName = `${m.vorname} ${m.nachname}`;
              return <option key={m.id} value={m.id}>{displayName}</option>;
            })}
          </select>
        </div>

        {/* Projekt */}
        <div className="form-group">
          <label>Projekt:</label>
          <input type="text" name="projekt" value={formData.projekt} onChange={handleChange} required />
        </div>

        {/* Ort / Format */}
        <div className="form-group">
          <label>Ort / Format:</label>
          <input type="text" name="ortOrFormat" value={formData.ortOrFormat} onChange={handleChange} />
        </div>

        {/* Teilnehmer */}
        <div className="form-group">
          <label>Teilnehmer:</label>
          <input type="text" name="teilnehmer" value={formData.teilnehmer} onChange={handleChange} />
        </div>

        {/* Datum & Uhrzeit */}
        <div className="form-group date-time-group">
          <div>
            <label>Datum:</label>
            <input type="date" name="datum" value={formData.datum} onChange={handleChange} />
          </div>
          <div>
            <label>Uhrzeit:</label>
            <input type="time" name="uhrzeit" value={formData.uhrzeit} onChange={handleChange} />
          </div>
        </div>

        {/* Textareas für Listen */}
        {['grund','besprochenePunkte','Ergebnisse','aufgaben','offenepunkte','naechsteschritte'].map(field => (
          <div className="form-group" key={field}>
            <label>{field} (jeden Punkt in neue Zeile):</label>
            <textarea
              name={field}
              value={formData[field]}
              onChange={handleChange}
              rows={5}
            />
          </div>
        ))}

        <button type="submit">Protokoll erstellen</button>
      </form>
    </div>
  );
}