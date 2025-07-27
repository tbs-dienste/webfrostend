import React, { useState } from 'react';
import axios from 'axios';
import './CreateService.scss';

const CreateService = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [preis, setPreis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Kein Token gefunden. Bitte erneut anmelden.");
        setLoading(false);
        return;
      }

      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung',
        { title, description, img, preis },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Dienstleistung erfolgreich erstellt.");
      setTitle('');
      setDescription('');
      setImg('');
      setPreis('');

      setTimeout(() => {
        window.location.href = "/dienstleistungen";
      }, 1500);

    } catch (error) {
      setError("Fehler beim Erstellen der Dienstleistung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h1>Dienstleistung erstellen</h1>
      <form onSubmit={handleSubmit} className="create-service-form">
        <label>
          <span>Titel</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel der Dienstleistung"
            required
          />
        </label>

        <label>
          <span>Beschreibung</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung"
            required
          />
        </label>

        <label>
          <span>Bild-URL</span>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            placeholder="https://example.com/bild.jpg"
            required
          />
        </label>

        <label>
          <span>Preis (€)</span>
          <input
            type="number"
            value={preis}
            onChange={(e) => setPreis(e.target.value)}
            placeholder="z. B. 99.99"
            min="0"
            required
          />
        </label>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Wird erstellt...' : 'Erstellen'}
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>

      {(title || description || img || preis) && (
        <div className="preview-section">
          <h2>Vorschau</h2>
          <div className="preview-card">
            {img && <img src={img} alt="Dienstleistung" />}
            <div className="preview-content">
              <h3>{title || 'Titel fehlt'}</h3>
              <p>{description || 'Keine Beschreibung vorhanden.'}</p>
              <strong>{preis ? `${preis} €` : 'Kein Preis angegeben'}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateService;