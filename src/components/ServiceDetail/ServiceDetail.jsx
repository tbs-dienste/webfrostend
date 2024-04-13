import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ServiceDetail.scss';

const ServiceDetail = () => {
  const { id } = useParams();

  const serviceDetails = {
    1: { title: "Webseite Programmieren", description: "Details zur Webseite Programmieren..." },
    2: { title: "Diashow erstellen", description: "Details zur Diashow erstellen..." },
    3: { title: "Gaming PC zusammenbauen", description: "Details zur Gaming PC Zusammenstellung: Teilen Sie uns einfach Ihr Budget mit, und wir stellen Ihnen einen passenden Gaming PC im gewünschten Budgetbereich zusammen. Bereit für grenzenloses Gaming-Vergnügen, abgestimmt auf Ihre Vorlieben und finanziellen Möglichkeiten."}
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
