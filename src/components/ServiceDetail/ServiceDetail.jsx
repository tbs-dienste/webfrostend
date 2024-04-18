import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ServiceDetail.scss';
import webseite from './webseite.jpeg'; // Pfad zum Bild anpassen
import pc from './pc.jpeg'; // Pfad zum Bild anpassen
import diashow from './diashow.jpeg'; // Pfad zum Bild anpassen

const ServiceDetail = () => {
  const { id } = useParams();

  const serviceDetails = {
    1: {
      img: webseite,
      title: "Webseite Programmieren", 
      description: "Details zur Webseite Programmieren: Möchten Sie eine professionelle Online-Präsenz für Ihr Unternehmen oder Ihre persönlichen Projekte? Wir bieten maßgeschneiderte Webseiten-Entwicklungsdienstleistungen, die auf Ihre spezifischen Anforderungen zugeschnitten sind. Von der Konzeption bis zur Umsetzung kümmern wir uns um jeden Schritt des Prozesses, um sicherzustellen, dass Ihre Webseite modern, benutzerfreundlich und funktional ist. Egal ob es sich um eine Unternehmenswebsite, einen Blog, einen Online-Shop oder eine Portfolio-Website handelt - wir machen es möglich! Kontaktieren Sie uns noch heute, um Ihre Vision in die Realität umzusetzen."
    },
    
    2: {
      img: diashow,
      title: "Diashow erstellen",
      description: "Details zur Diashow erstellen: Mit unserer Diashow-Erstellungs-Dienstleistung machen wir Ihre besonderen Momente unvergesslich! Egal ob für Hochzeiten, Konfirmationen, Geburtstage oder andere Anlässe - wir verwandeln Ihre Fotos und Videos in eine atemberaubende Diashow. Von der Auswahl der Musik bis zur Bearbeitung der Bilder kümmern wir uns um jedes Detail, um eine Diashow zu erstellen, die Ihre Erwartungen übertrifft. Teilen Sie uns einfach Ihre Vorstellungen mit, und wir kreieren eine maßgeschneiderte Diashow, die Ihre persönliche Geschichte zum Leben erweckt."
    },

    3: { 
      img: pc,
      title: "Gaming PC zusammenbauen", 
      description: "Details zur Gaming PC Zusammenstellung: Teilen Sie uns einfach Ihr Budget mit, und wir stellen Ihnen einen passenden Gaming PC im gewünschten Budgetbereich zusammen. Bereit für grenzenloses Gaming-Vergnügen, abgestimmt auf Ihre Vorlieben und finanziellen Möglichkeiten." 
    }
  };

  const service = serviceDetails[id];

  if (!service) {
    return <div>Dienstleistung nicht gefunden</div>;
  }

  return (
    <div className="service-detail-container">
      <img src={service.img} alt="Service Bild" className="service-image" />
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <Link to="/dienstleistungen" className="back-btn">&#8592; Zurück zu Dienstleistungen</Link>
    </div>
  );
};

export default ServiceDetail;
