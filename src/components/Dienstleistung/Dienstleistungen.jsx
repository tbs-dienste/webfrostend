import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dienstleistungen.scss';

const Dienstleistungen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
        setServices(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Laden der Dienstleistungen:", error);
        setError("Fehler beim Laden der Dienstleistungen.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="services-container">
      <h1>Unsere Dienstleistungen</h1>
      <div className="services-list">
        {services.map(service => (
          <div className="service" key={service.id}>
            <h2>{service.title}</h2>
            <p>{service.description.length > 100 ? `${service.description.substring(0, 100)}...` : service.description}</p>
            <Link to={`/service/${service.id}`} className="btn-more">Mehr erfahren</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dienstleistungen;
