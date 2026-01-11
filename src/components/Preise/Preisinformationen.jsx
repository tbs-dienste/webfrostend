import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import "./Preisinformationen.scss";

const Preisinformationen = ({ isAdmin }) => {
  const [backendPakete, setBackendPakete] = useState([]);
  const [datenbankPakete, setDatenbankPakete] = useState([]);
  const [dienstleistungen, setDienstleistungen] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [backendRes, dbRes, serviceRes] = await Promise.all([
          axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete"),
          axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/datenbankpakete"),
          axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung"),
        ]);

        // Prüfen, ob Daten vorhanden sind
        setBackendPakete(Array.isArray(backendRes.data) ? backendRes.data : backendRes.data.data || []);
        setDatenbankPakete(dbRes.data.data || []);
        setDienstleistungen(serviceRes.data.data || []);
      } catch (err) {
        console.error("Fehler beim Laden der Preise:", err);
      }
    };

    fetchData();
  }, []);

  const price = (v) => {
    if (v === undefined || v === null) return "0.00 CHF";
    return `${Number(v).toFixed(2)} CHF`;
  };

  return (
    <main className="pricing-page">
      {/* HERO */}
      <section className="pricing-hero">
        <h1>Preisinformationen</h1>
        <p>Transparente Preise, klare Leistungen – ohne versteckte Kosten.</p>
      </section>

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <div className="admin-actions">
          <Link to="/datenbankpaketerstellen">
            <FaPlus /> Datenbankpaket
          </Link>
          <Link to="/backendpaketerstellen">
            <FaPlus /> Backendpaket
          </Link>
        </div>
      )}

      {/* DIENSTLEISTUNGEN */}
      <section className="pricing-section">
        <h2>Dienstleistungen</h2>
        <ul className="service-list">
          {dienstleistungen.length === 0 && <li>Keine Dienstleistungen verfügbar.</li>}
          {dienstleistungen.map((d) => (
            <li key={d.id}>
              <span>{d.title}</span>
              <strong>{price(d.preis)}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* BACKEND PAKETE */}
      <section className="pricing-section">
        <h2>Backend Pakete</h2>
        <div className="pricing-grid">
          {backendPakete.length === 0 && <p>Keine Backend-Pakete verfügbar.</p>}
          {backendPakete.map((p) => (
            <div
              key={p.id}
              className={`pricing-card ${p.empfohlen === 1 ? "recommended" : ""}`}
            >
              <h3>{p.name}</h3>
              <p className="price">{price(p.vk_preis)} / Monat</p>
              <ul>
                <li>{p.cpu} CPU</li>
                <li>{p.ram} RAM</li>
                <li>{price(p.vk_preis * 12)} / Jahr</li>
              </ul>
              {p.empfohlen === 1 && <span className="badge">Empfohlen</span>}
            </div>
          ))}
        </div>
      </section>

      {/* DATENBANK PAKETE */}
      <section className="pricing-section">
        <h2>Datenbank Pakete</h2>
        <div className="pricing-grid">
          {datenbankPakete.length === 0 && <p>Keine Datenbank-Pakete verfügbar.</p>}
          {datenbankPakete.map((p) => (
            <div
              key={p.id}
              className={`pricing-card ${p.empfohlen === 1 ? "recommended" : ""}`}
            >
              <h3>{p.name}</h3>
              <p className="price">{price(p.vk_preis)} / Monat</p>
              <ul>
                <li>{p.maxDBSize} GB Speicher</li>
                <li>{p.memory} GB Memory</li>
                <li>{price(p.vk_preis * 12)} / Jahr</li>
              </ul>
              {p.empfohlen === 1 && <span className="badge">Empfohlen</span>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Preisinformationen;
