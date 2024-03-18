import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ServiceDetail.scss';

const ServiceDetail = () => {
  const { id } = useParams();

  const serviceDetails = {
    1: { title: "Webseite Programmieren", description: "Details zur Webseite Programmieren..." },
    2: { title: "Diashow erstellen", description: "Details zur Diashow erstellen..." }
    // Weitere Service-Details hinzufügen, falls benötigt
  };

  const service = serviceDetails[id];

  if (!service) {
    return <div>Dienstleistung nicht gefunden</div>;
  }

  return (
    <div className="service-detail-container">
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <Link to="/dienstleistungen" className="back-btn">&#8592; Zurück zu Dienstleistungen</Link>
    </div>
  );
};

export default ServiceDetail;
