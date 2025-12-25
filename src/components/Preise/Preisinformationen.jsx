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
    axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete")
      .then(res => Array.isArray(res.data) && setBackendPakete(res.data));

    axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/datenbankpakete")
      .then(res => res.data?.data && setDatenbankPakete(res.data.data));

    axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung")
      .then(res => res.data?.data && setDienstleistungen(res.data.data));
  }, []);

  const price = (v) => `${Number(v || 0).toFixed(2)} CHF`;

  return (
    <main className="pricing-page">
      {/* HERO */}
      <section className="pricing-hero">
        <h1>Preisinformationen</h1>
        <p>
          Transparente Preise, klare Leistungen – ohne versteckte Kosten.
        </p>
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
          {dienstleistungen.map(d => (
            <li key={d.id}>
              <span>{d.title}</span>
              <strong>{price(d.preis)}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* BACKEND */}
      <section className="pricing-section">
        <h2>Backend Pakete</h2>

        <div className="pricing-grid">
          {backendPakete.map(p => (
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

      {/* DATENBANK */}
      <section className="pricing-section">
        <h2>Datenbank Pakete</h2>

        <div className="pricing-grid">
          {datenbankPakete.map(p => (
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
