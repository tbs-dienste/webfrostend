import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dienstleistungen.scss';

const Dienstleistungen = ({ isAdmin }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
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

  if (loading) return <div className="loading">Lädt...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="services-container">
      <h1>Unsere Dienstleistungen</h1>
      {isAdmin && (
        <Link to="/service-create" className="add-button">+</Link>
      )}
      <div className="services-list">
        {services.map(service => (
          <div className="service" key={service.id}>
            {service.img && <img src={service.img} alt={service.title} className="service-image" />}
            <div className="service-content">
              <h2>{service.title}</h2>
              <p>{service.description.length > 150 ? `${service.description.substring(0, 150)}...` : service.description}</p>
              <Link to={`/service/${service.id}`} className="btn-more">Mehr erfahren</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dienstleistungen;
