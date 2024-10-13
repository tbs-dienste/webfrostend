import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; 
import './ServiceDetail.scss';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = localStorage.getItem('token'); // Token holen
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Token in den Header einfügen
          }
        });
        setService(response.data.data);
        setEditedData(response.data.data);
      } catch (error) {
        console.error("Fehler beim Laden der Dienstleistung:", error.response || error.message);
        setError("Dienstleistung nicht gefunden.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedData.title || !editedData.description || !editedData.preis || !editedData.img) {
      setError('Bitte fülle alle Felder aus.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token'); // Token holen
      const response = await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, editedData, {
        headers: {
          Authorization: `Bearer ${token}` // Token in den Header einfügen
        }
      });
      setService(response.data.data);
      window.location.href = "/dienstleistungen";
      setIsEditing(false);
      setSuccessMessage('Dienstleistung erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Dienstleistung:', error.response || error.message);
      setError('Fehler beim Speichern der Dienstleistung. Bitte versuche es später noch einmal.');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null); 
  };

  if (loading) {
    return <div>Lade Dienstleistung...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }


  return (
    <div className="service-detail-container">
      {service.img && <img src={service.img} alt={service.title} className="service-image" />}
      <h1>{service.title}</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {isEditing ? (
        <div className="edit-form">
          <label>
            Titel:
            <input
              type="text"
              name="title"
              value={editedData.title || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Beschreibung:
            <textarea
              name="description"
              value={editedData.description || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Preis:
            <input
              type="number"
              name="preis"
              value={editedData.preis || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Bild URL:
            <input
              type="text"
              name="img"
              value={editedData.img || ''}
              onChange={handleInputChange} // Allow URL input for image
            />
          </label>
          <button onClick={handleSave} className="save-button">Speichern</button>
          <button onClick={handleEditToggle} className="cancel-button">Abbrechen</button>
        </div>
      ) : (
        <div>
          <p>{service.description}</p>
          <p>Preis: {service.preis} CHF</p>
          <button onClick={handleEditToggle} className="edit-button">Bearbeiten</button>
        </div>
      )}
      <Link to="/dienstleistungen" className="back-btn">&#8592; Zurück zu Dienstleistungen</Link>
    </div>
  );
};

export default ServiceDetail;
