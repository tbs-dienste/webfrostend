import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { Helmet } from "react-helmet";
import "./Dienstleistungen.scss";
import Loading from "../Loading/Loading";

const Dienstleistungen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const decoded = jwtDecode(token);
          setIsAdmin(decoded.userType === "admin");
        }

        const res = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung"
        );
        setServices(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Dienstleistung wirklich löschen?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="services-page">
      <Helmet>
        <title>Dienstleistungen | TBS Solutions</title>
      </Helmet>

      {/* HERO */}
      <section className="services-hero">
        <div className="hero-content">
          <h1>Unsere Dienstleistungen</h1>
          <p>
            Maßgeschneiderte digitale Lösungen für Unternehmen, die wachsen
            wollen.
          </p>

          {isAdmin && (
            <Link to="/service-create" className="hero-action">
              <FaPlus /> Neue Dienstleistung
            </Link>
          )}
        </div>
      </section>

      {/* LIST */}
      <section className="services-grid">
        {services.map((service) => (
          <article className="service-item" key={service.id}>
            <div className="service-media">
              {service.img ? (
                <img src={service.img} alt={service.title} />
              ) : (
                <div className="media-placeholder">Kein Bild</div>
              )}
            </div>

            <div className="service-body">
              <h2>{service.title}</h2>

              <p>
                {service.description?.length > 140
                  ? service.description.slice(0, 140) + "…"
                  : service.description}
              </p>

              <div className="service-footer">
                <Link to={`/service/${service.id}`} className="details-link">
                  Details ansehen →
                </Link>

                {isAdmin && (
                  <button
                    className="admin-delete"
                    onClick={() => handleDelete(service.id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Dienstleistungen;
