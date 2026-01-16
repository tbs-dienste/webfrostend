import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaServer, FaDatabase, FaTools } from "react-icons/fa";
import "./Preisinformationen.scss";

const Preisinformationen = ({ isAdmin }) => {
  const [backendPakete, setBackendPakete] = useState([]);
  const [datenbankPakete, setDatenbankPakete] = useState([]);
  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [backendRes, dbRes, serviceRes] = await Promise.all([
          axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete"),
          axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/datenbankpakete"),
          axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung"),
        ]);

        setBackendPakete(Array.isArray(backendRes.data) ? backendRes.data : backendRes.data.data || []);
        setDatenbankPakete(Array.isArray(dbRes.data) ? dbRes.data : dbRes.data.data || []);
        setDienstleistungen(Array.isArray(serviceRes.data) ? serviceRes.data : serviceRes.data.data || []);
      } catch (err) {
        console.error("Fehler beim Laden der Preisdaten:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const price = (v) => `${Number(v || 0).toFixed(2)} CHF`;

  if (loading) {
    return (
      <main className="pricing-page">
        <section className="pricing-hero">
          <h1>Preisinformationen</h1>
          <p>Lade Preisdaten…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="pricing-page">
      {/* HERO */}
      <section className="pricing-hero">
        <h1>Preisinformationen</h1>
        <p>Transparente Preise, skalierbare Lösungen, professionelle Services.</p>
      </section>

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <section className="admin-actions">
          <Link to="/datenbankpaketerstellen">
            <FaPlus /> Datenbankpaket
          </Link>
          <Link to="/backendpaketerstellen">
            <FaPlus /> Backendpaket
          </Link>
        </section>
      )}

      {/* DIENSTLEISTUNGEN */}
      <section className="pricing-section">
        <h2>
          <FaTools /> Dienstleistungen
        </h2>

        <div className="service-grid">
          {dienstleistungen.length === 0 && (
            <p className="empty-text">Keine Dienstleistungen verfügbar.</p>
          )}

          {dienstleistungen.map((d) => (
            <article key={d.id} className="service-card">
              <h3>{d.title}</h3>
              <p className="service-price">{price(d.preis)} / Stunde</p>
            </article>
          ))}
        </div>
      </section>

      {/* BACKEND PAKETE */}
      <section className="pricing-section">
        <h2>
          <FaServer /> Backend Pakete
        </h2>

        <div className="pricing-grid">
          {backendPakete.length === 0 && (
            <p className="empty-text">Keine Backend-Pakete verfügbar.</p>
          )}

          {backendPakete.map((p) => (
            <article
              key={p.id}
              className={`pricing-card ${p.empfohlen === 1 ? "recommended" : ""}`}
            >
              {p.empfohlen === 1 && <span className="badge">Empfohlen</span>}

              <h3>{p.name}</h3>
              <p className="price">{price(p.vk_preis)} / Monat</p>

              <ul>
                <li>{p.cpu} CPU</li>
                <li>{p.ram} RAM</li>
                <li>{price(p.vk_preis * 12)} / Jahr</li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* DATENBANK PAKETE */}
      <section className="pricing-section">
        <h2>
          <FaDatabase /> Datenbank Pakete
        </h2>

        <div className="pricing-grid">
          {datenbankPakete.length === 0 && (
            <p className="empty-text">Keine Datenbank-Pakete verfügbar.</p>
          )}

          {datenbankPakete.map((p) => (
            <article
              key={p.id}
              className={`pricing-card ${p.empfohlen === 1 ? "recommended" : ""}`}
            >
              {p.empfohlen === 1 && <span className="badge">Empfohlen</span>}

              <h3>{p.name}</h3>
              <p className="price">{price(p.vk_preis)} / Monat</p>

              <ul>
                <li>{p.maxDBSize} GB Speicher</li>
                <li>{p.memory} GB Memory</li>
                <li>{price(p.vk_preis * 12)} / Jahr</li>
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Preisinformationen;
