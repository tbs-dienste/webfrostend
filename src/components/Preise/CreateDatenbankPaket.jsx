import React, { useState } from 'react';
import axios from 'axios';
import './CreateDatenbankPaket.scss'; // Dein Stylesheet

const CreateDatenbankPaket = () => {
  const [formData, setFormData] = useState({
    name: '',
    maxDBSize: '',
    memory: '',
    preis: '',
    empfohlen: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/datenbankpakete', formData);
      alert('Datenbank-Paket erfolgreich erstellt: ' + response.data.message);
      setFormData({
        name: '',
        maxDBSize: '',
        memory: '',
        preis: '',
        empfohlen: 0
      });
    } catch (error) {
      console.error('Fehler beim Erstellen des Datenbank-Pakets:', error);
      alert('Fehler beim Erstellen des Datenbank-Pakets.');
    }
  };

  return (
    <div className="create-datenbank-paket">
      <h2>Neues Datenbank-Paket erstellen</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Name des Pakets"
          />
        </div>
        <div className="form-group">
          <label htmlFor="maxDBSize">Maximale DB-Größe (GB)</label>
          <input
            type="number"
            id="maxDBSize"
            name="maxDBSize"
            value={formData.maxDBSize}
            onChange={handleChange}
            required
            placeholder="Maximale DB-Größe"
          />
        </div>
        <div className="form-group">
          <label htmlFor="memory">Speicher (GB)</label>
          <input
            type="number"
            id="memory"
            name="memory"
            value={formData.memory}
            onChange={handleChange}
            required
            placeholder="Speicher"
          />
        </div>
        <div className="form-group">
          <label htmlFor="preis">Preis (CHF)</label>
          <input
            type="number"
            step="0.01"
            id="preis"
            name="preis"
            value={formData.preis}
            onChange={handleChange}
            required
            placeholder="Preis"
          />
        </div>
        <div className="form-group">
          <label htmlFor="empfohlen">Empfohlen</label>
          <select
            id="empfohlen"
            name="empfohlen"
            value={formData.empfohlen}
            onChange={handleChange}
          >
            <option value="0">Nein</option>
            <option value="1">Ja</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Paket erstellen</button>
      </form>
    </div>
  );
};

export default CreateDatenbankPaket;
