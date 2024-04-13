import React from 'react';
import { Link } from 'react-router-dom';
import './Dienstleistungen.scss';

const Dienstleistungen = () => {
  const services = [
    { id: 1, title: "Webseite Programmieren", description: "Lassen Sie uns Ihre Webseite programmieren." },
    { id: 2, title: "Diashow erstellen", description: "Lassen Sie uns Ihre wertvollen Erinnerungen in einer professionellen Diashow zum Leben erwecken." },
    { id: 3, title: "Gaming PC zusammenbauen", description: "Bereit für das ultimative Gaming-Erlebnis? Lassen Sie sich von uns beraten, um Ihren eigenen Gaming PC zu bauen. Maßgeschneidert nach Ihren Wünschen für maximale Leistung und unvergleichliche Gaming-Sessions. " }
    // Weitere Dienstleistungen können hier hinzugefügt werden
  ];

  return (
    <div className="services-container">
      <h1>Unsere Dienstleistungen</h1>
      <div className="services-list">
        {services.map(service => (
          <div className="service" key={service.id}>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <Link to={`/service/${service.id}`} className="btn-more">Mehr erfahren</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dienstleistungen;
