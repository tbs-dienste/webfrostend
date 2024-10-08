import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaUndo } from 'react-icons/fa';
import './ServiceEdit.scss';

const ServiceEdit = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [originalService, setOriginalService] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchService() {
      try {
        const token = localStorage.getItem('token'); // Token aus localStorage abrufen
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Token im Header hinzufügen
          }
        });
        const serviceData = response.data.data[0]; // Zugriff auf das erste Element im Array
        if (serviceData) {
          setService(serviceData);
          setOriginalService(serviceData);
          setEditedData(serviceData);
        } else {
          setError('Dienstleistung nicht gefunden');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Dienstleistung:', error);
        setError('Fehler beim Abrufen der Dienstleistung. Bitte versuche es später noch einmal.');
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token'); // Token aus localStorage abrufen
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, editedData, {
        headers: {
          Authorization: `Bearer ${token}` // Token im Header hinzufügen
        }
      });
      alert('Dienstleistung erfolgreich aktualisiert');
      // Weiterleiten nach erfolgreicher Bearbeitung
      window.location.href = '/dienstleistungen'; // Ersetzen Sie '/' mit der gewünschten URL für die Weiterleitung
    } catch (error) {
      console.error('Fehler beim Speichern der Dienstleistung:', error);
      alert('Fehler beim Speichern der Dienstleistung. Bitte versuche es später noch einmal.');
    }
  };

  const handleUndo = () => {
    if (originalService) {
      setEditedData(originalService);
      setEditMode(false); // Optional: Editiermodus ausschalten, wenn die Rückgängig-Schaltfläche gedrückt wird
    }
  };

  if (loading) {
    return <div className="loading">Lade Dienstleistung...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="service-edit-container">
      <h2>Dienstleistung bearbeiten</h2>
      <div className="service-edit-form">
        <label>
          Titel:
          <input
            type="text"
            name="title"
            value={editedData.title || ''} // Default-Wert hinzugefügt
            onChange={handleInputChange}
          />
        </label>
        <label>
          Beschreibung:
          <textarea
            name="description"
            value={editedData.description || ''} // Default-Wert hinzugefügt
            onChange={handleInputChange}
          />
        </label>
        <label>
          Bild-URL:
          <input
            type="text"
            name="img"
            value={editedData.img || ''} // Default-Wert hinzugefügt
            onChange={handleInputChange}
          />
        </label>
        <label>
          Preis:
          <input
            type="number"
            name="price"
            value={editedData.price || ''} // Default-Wert hinzugefügt
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleSave} className="save-button">
          <FaSave /> Speichern
        </button>
        <button onClick={handleUndo} className="undo-button">
          <FaUndo /> Rückgängig
        </button>
      </div>
    </div>
  );
};

export default ServiceEdit;
