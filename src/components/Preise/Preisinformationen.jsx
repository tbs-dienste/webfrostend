import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaServer,
  FaDatabase,
  FaTools,
  FaArrowRight,
  FaCheck
} from "react-icons/fa";
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
          axios.get(
            "https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete"
          ),
          axios.get(
            "https://tbsdigitalsolutionsbackend.onrender.com/api/datenbankpakete"
          ),
          axios.get(
            "https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung"
          )
        ]);

        setBackendPakete(
          Array.isArray(backendRes.data)
            ? backendRes.data
            : backendRes.data.data || []
        );

        setDatenbankPakete(
          Array.isArray(dbRes.data)
            ? dbRes.data
            : dbRes.data.data || []
        );

        setDienstleistungen(
          Array.isArray(serviceRes.data)
            ? serviceRes.data
            : serviceRes.data.data || []
        );
      } catch (err) {
        console.error("Fehler beim Laden der Preisdaten:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const price = (value) => {
    return `${Number(value || 0).toFixed(2)} CHF`;
  };

  if (loading) {
    return (
      <main className="price-overview">
        <section className="price-loading">
          <span className="price-loading-line" />
          <p>Preisinformationen werden geladen</p>
        </section>
      </main>
    );
  }

  return (
    <main className="price-overview">

      {/* =====================================================
          INTRO
      ===================================================== */}
      <section className="price-intro">
        <div className="price-intro-top">
          <span className="price-eyebrow">
            TBS SOLUTIONS / PREISE
          </span>

          <span className="price-intro-number">
            01
          </span>
        </div>

        <div className="price-intro-content">
          <div>
            <h1>
              Klare Preise.
              <br />
              <span>Klare Entscheidungen.</span>
            </h1>
          </div>

          <div className="price-intro-description">
            <p>
              Transparente Preise für digitale Dienstleistungen,
              Backend-Infrastruktur und Datenbanklösungen.
            </p>

            <p>
              Sie bezahlen nur für das, was Sie tatsächlich benötigen.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ADMIN
      ===================================================== */}
      {isAdmin && (
        <section className="price-admin">
          <div className="price-admin-label">
            Administration
          </div>

          <div className="price-admin-actions">
            <Link to="/datenbankpaketerstellen">
              <FaPlus />
              <span>Datenbankpaket erstellen</span>
            </Link>

            <Link to="/backendpaketerstellen">
              <FaPlus />
              <span>Backendpaket erstellen</span>
            </Link>
          </div>
        </section>
      )}

      {/* =====================================================
          DIENSTLEISTUNGEN
      ===================================================== */}
      <section className="price-block">

        <div className="price-block-heading">
          <div className="price-block-icon">
            <FaTools />
          </div>

          <div>
            <span className="price-block-number">02</span>
            <h2>Dienstleistungen</h2>
          </div>

          <p>
            Individuelle Unterstützung und digitale
            Dienstleistungen nach Aufwand.
          </p>
        </div>

        {dienstleistungen.length === 0 ? (
          <div className="price-empty">
            Keine Dienstleistungen verfügbar.
          </div>
        ) : (
          <div className="service-list">
            {dienstleistungen.map((service, index) => (
              <article
                key={service.id}
                className="service-line"
              >
                <span className="service-line-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="service-line-name">
                  <h3>{service.title}</h3>
                  <span>Individuelle Dienstleistung</span>
                </div>

                <div className="service-line-price">
                  <strong>{price(service.preis)}</strong>
                  <span>/ Stunde</span>
                </div>

                <FaArrowRight className="service-line-arrow" />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          BACKEND
      ===================================================== */}
      <section className="price-block">

        <div className="price-block-heading">
          <div className="price-block-icon">
            <FaServer />
          </div>

          <div>
            <span className="price-block-number">03</span>
            <h2>Backend Pakete</h2>
          </div>

          <p>
            Leistungsfähige Backend-Infrastruktur
            für moderne digitale Anwendungen.
          </p>
        </div>

        {backendPakete.length === 0 ? (
          <div className="price-empty">
            Keine Backend-Pakete verfügbar.
          </div>
        ) : (
          <div className="package-list">
            {backendPakete.map((packageItem) => {
              const recommended = packageItem.empfohlen === 1;

              return (
                <article
                  key={packageItem.id}
                  className={`package-row ${
                    recommended ? "is-recommended" : ""
                  }`}
                >
                  <div className="package-main">
                    <div className="package-title">
                      <span>
                        {recommended
                          ? "EMPFOHLEN"
                          : "BACKEND PAKET"}
                      </span>

                      <h3>{packageItem.name}</h3>
                    </div>

                    <div className="package-price">
                      <strong>
                        {price(packageItem.vk_preis)}
                      </strong>
                      <span>/ Monat</span>
                    </div>
                  </div>

                  <div className="package-details">
                    <div>
                      <span>CPU</span>
                      <strong>{packageItem.cpu}</strong>
                    </div>

                    <div>
                      <span>RAM</span>
                      <strong>{packageItem.ram}</strong>
                    </div>

                    <div>
                      <span>Jahrespreis</span>
                      <strong>
                        {price(packageItem.vk_preis * 12)}
                      </strong>
                    </div>
                  </div>

                  {recommended && (
                    <div className="package-check">
                      <FaCheck />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================
          DATENBANK
      ===================================================== */}
      <section className="price-block">

        <div className="price-block-heading">
          <div className="price-block-icon">
            <FaDatabase />
          </div>

          <div>
            <span className="price-block-number">04</span>
            <h2>Datenbank Pakete</h2>
          </div>

          <p>
            Flexible Speicherlösungen für strukturierte
            und zuverlässige Datenverwaltung.
          </p>
        </div>

        {datenbankPakete.length === 0 ? (
          <div className="price-empty">
            Keine Datenbank-Pakete verfügbar.
          </div>
        ) : (
          <div className="package-list">
            {datenbankPakete.map((packageItem) => {
              const recommended = packageItem.empfohlen === 1;

              return (
                <article
                  key={packageItem.id}
                  className={`package-row ${
                    recommended ? "is-recommended" : ""
                  }`}
                >
                  <div className="package-main">
                    <div className="package-title">
                      <span>
                        {recommended
                          ? "EMPFOHLEN"
                          : "DATENBANK PAKET"}
                      </span>

                      <h3>{packageItem.name}</h3>
                    </div>

                    <div className="package-price">
                      <strong>
                        {price(packageItem.vk_preis)}
                      </strong>
                      <span>/ Monat</span>
                    </div>
                  </div>

                  <div className="package-details">
                    <div>
                      <span>Speicher</span>
                      <strong>
                        {packageItem.maxDBSize} GB
                      </strong>
                    </div>

                    <div>
                      <span>Memory</span>
                      <strong>
                        {packageItem.memory} GB
                      </strong>
                    </div>

                    <div>
                      <span>Jahrespreis</span>
                      <strong>
                        {price(packageItem.vk_preis * 12)}
                      </strong>
                    </div>
                  </div>

                  {recommended && (
                    <div className="package-check">
                      <FaCheck />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================
          FOOTER STATEMENT
      ===================================================== */}
      <section className="price-statement">
        <div className="price-statement-number">
          05
        </div>

        <div className="price-statement-content">
          <span>INDIVIDUELLE LÖSUNGEN</span>

          <h2>
            Nicht sicher,
            <br />
            was Sie benötigen?
          </h2>

          <p>
            Wir finden gemeinsam die passende Lösung
            für Ihr Projekt.
          </p>

          <Link to="/kontakt">
            Kontakt aufnehmen
            <FaArrowRight />
          </Link>
        </div>
      </section>

    </main>
  );
};

export default Preisinformationen;

