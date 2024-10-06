import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Importiere Axios
import './ServiceDetail.scss';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null); // Fehlerstatus

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`);
        setService(response.data.data); // Direkt setzen, weil wir nur ein Objekt erhalten
      } catch (error) {
        console.error("Fehler beim Laden der Dienstleistung:", error);
        setError("Dienstleistung nicht gefunden."); // Fehlerstatus setzen
      }
    };

    fetchService();
  }, [id]);

  if (error) {
    return <div>{error}</div>; // Fehler anzeigen
  }

  if (!service) {
    return <div>Lade Dienstleistung...</div>; // Ladeanzeige
  }

  return (
    <div className="service-detail-container">
      {service.img && <img src={service.img} alt="Service Bild" className="service-image" />}
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <p>Preis: {service.preis} CHF</p>
      <Link to="/dienstleistungen" className="back-btn">&#8592; Zurück zu Dienstleistungen</Link>
    </div>
  );
};

export default ServiceDetail;
