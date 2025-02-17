import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // jwt-decode importieren
import './ServiceDetail.scss'; // Importiere das SCSS-Design

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.userType === 'admin') {
          setIsAdmin(true);
        }
      }
    };

    const fetchService = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
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

    checkAdmin();
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
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, editedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setService(response.data.data);
      setIsEditing(false);
      setSuccessMessage('Dienstleistung erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Dienstleistung:', error.response || error.message);
      setError('Fehler beim Speichern der Dienstleistung. Bitte versuche es später noch einmal.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Möchtest du diese Dienstleistung wirklich löschen?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Dienstleistung erfolgreich gelöscht.");
        navigate('/dienstleistungen');
      } catch (error) {
        console.error('Fehler beim Löschen der Dienstleistung:', error.response || error.message);
        setError('Fehler beim Löschen der Dienstleistung. Bitte versuche es später noch einmal.');
      }
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
              onChange={handleInputChange}
            />
          </label>
          <div className="button-group">
            <button onClick={handleSave} className="save-button">Speichern</button>
            <button onClick={handleEditToggle} className="cancel-button">Abbrechen</button>
          </div>
        </div>
      ) : (
        <div>
          <p>{service.description}</p>
          <p className="price">Preis: {service.preis} CHF / Stunde</p>
          {isAdmin && (
            <div className="button-group">
              <button onClick={handleEditToggle} className="edit-button">Bearbeiten</button>
              <button onClick={handleDelete} className="delete-button">Löschen</button>
            </div>
          )}
        </div>
      )}
      <Link to="/dienstleistungen" className="back-btn">&#8592; Zurück zu Dienstleistungen</Link>
    </div>
  );
};

export default ServiceDetail;
