import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { Helmet } from 'react-helmet-async';
import './Dienstleistungen.scss';
import Loading from '../Loading/Loading';

const Dienstleistungen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.userType === 'admin');
        }

        const response = await axios.get(
          'https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setServices(response.data.data);
      } catch (error) {
        console.error('Fehler beim Laden der Dienstleistungen:', error);
        setError('Fehler beim Laden der Dienstleistungen.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bist du sicher, dass du diesen Service löschen möchtest?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setServices(services.filter((service) => service.id !== id));
      } catch (error) {
        console.error('Fehler beim Löschen des Service:', error);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <main className="services-container">
      <Helmet>
        <title>Dienstleistungen | TBS Solutions</title>
        <meta
          name="description"
          content="Entdecken Sie die professionellen Dienstleistungen von TBS Solutions: Von IT-Beratung über digitale Lösungen bis hin zu maßgeschneiderten Support-Angeboten."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.tbssolutions.ch/dienstleistungen" />
      </Helmet>

      <header>
        <h1>
          Unsere Dienstleistungen
          {isAdmin && (
            <Link to="/service-create" className="add-button" aria-label="Neue Dienstleistung hinzufügen">+</Link>
          )}
        </h1>
      </header>

      <section className="services-list">
        {services.map((service) => (
          <article className="service-card" key={service.id}>
            <div className="service-image-wrapper">
              {service.img ? (
                <img
                  src={service.img}
                  alt={`Abbildung zur Dienstleistung ${service.title}`}
                  className="service-image"
                  loading="lazy"
                />
              ) : (
                <div className="fallback-image">Kein Bild verfügbar</div>
              )}
            </div>

            <div className="service-content">
              <h2>{service.title}</h2>
              <p>
                {service.description && service.description.length > 150
                  ? `${service.description.substring(0, 150)}...`
                  : service.description || 'Keine Beschreibung verfügbar'}
              </p>

              <Link
                to={`/service/${service.id}`}
                className="btn-more"
                aria-label={`Mehr über ${service.title} erfahren`}
              >
                Mehr erfahren
              </Link>

              {isAdmin && (
                <div className="admin-buttons">
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(service.id)}
                    aria-label="Dienstleistung löschen"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Dienstleistungen;