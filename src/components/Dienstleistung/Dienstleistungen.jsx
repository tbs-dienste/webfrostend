import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Icons importieren
import { jwtDecode } from 'jwt-decode'; // jwt-decode importieren
import './Dienstleistungen.scss';
import Loading from '../Loading/Loading';

const Dienstleistungen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State für Admin-Status

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Token aus localStorage abrufen
        const token = localStorage.getItem('token');

        // Überprüfen, ob ein Token vorhanden ist
        if (token) {
          // Benutzerinformationen aus dem Token dekodieren
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.userType === 'admin'); // Benutzerstatus setzen
        }

        // Axios GET-Request mit Token im Header
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung', {
          headers: {
            Authorization: `Bearer ${token}`, // Token im Header setzen
          },
        });
        setServices(response.data.data);
      } catch (error) {
        console.error("Fehler beim Laden der Dienstleistungen:", error);
        setError("Fehler beim Laden der Dienstleistungen.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bist du sicher, dass du diesen Service löschen möchtest?")) {
      try {
        // Token aus localStorage abrufen
        const token = localStorage.getItem('token');

        // Axios DELETE-Request mit Token im Header
        await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Token im Header setzen
          },
        });
        setServices(services.filter(service => service.id !== id));
      } catch (error) {
        console.error("Fehler beim Löschen des Service:", error);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="services-container">
      <h1>
        Unsere Dienstleistungen
        {isAdmin && (
          <Link to="/service-create" className="add-button">+</Link>
        )}
      </h1>
  
      <div className="services-list">
        {services.map(service => (
          <div className="service-card" key={service.id}>
            <div className="service-image-wrapper">
              {service.img && <img src={service.img} alt={service.title} className="service-image" />}
            </div>
            <div className="service-content">
              <h2>{service.title}</h2>
              <p>
                {service.description && service.description.length > 150
                  ? `${service.description.substring(0, 150)}...`
                  : service.description || "Keine Beschreibung verfügbar"}
              </p>
              <Link to={`/service/${service.id}`} className="btn-more">Mehr erfahren</Link>
              {isAdmin && ( // Admin-Schaltflächen nur für Admins anzeigen
                <div className="admin-buttons">
                  <Link to={`/service-edit/${service.id}`} className="edit-button">
                    <FaEdit />
                  </Link>
                  <button className="delete-button" onClick={() => handleDelete(service.id)}>
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dienstleistungen;
