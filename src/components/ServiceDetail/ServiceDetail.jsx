import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Importiere Axios
import './ServiceDetail.scss';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`);
        if (response.data.data.length > 0) {
          setService(response.data.data[0]);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Dienstleistung:", error);
      }
    };

    fetchService();
  }, [id]);

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
