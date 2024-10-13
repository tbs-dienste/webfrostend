// CreateService Component
import React, { useState } from 'react';
import axios from 'axios';
import './CreateService.scss';

const CreateService = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState(''); // Keep img as a string for the URL
  const [preis, setPreis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung',
        { title, description, img, preis }, // Send img as URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Dienstleistung erfolgreich erstellt!');
      window.location.href = "/dienstleistungen";
      // Reset form fields
      setTitle('');
      setDescription('');
      setImg('');
      setPreis('');
    } catch (error) {
      console.error("Fehler beim Erstellen der Dienstleistung:", error);
      setError("Fehler beim Erstellen der Dienstleistung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h1>Dienstleistung Erstellen</h1>
      <form onSubmit={handleSubmit} className="create-service-form">
        <label>
          <span>Titel</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Geben Sie den Titel der Dienstleistung ein"
            required
          />
        </label>
        <label>
          <span>Beschreibung</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Geben Sie eine Beschreibung der Dienstleistung ein"
            required
          ></textarea>
        </label>
        <label>
          <span>Bild URL</span>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)} // Set URL directly
            placeholder="Geben Sie die URL des Bildes ein"
            required
          />
        </label>
        <label>
          <span>Preis</span>
          <input
            type="number"
            value={preis}
            onChange={(e) => setPreis(e.target.value)}
            placeholder="Geben Sie den Preis der Dienstleistung ein"
            required
            min="0"
          />
        </label>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Erstelle Dienstleistung...' : 'Erstellen'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default CreateService;
