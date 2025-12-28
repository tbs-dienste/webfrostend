import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Home.scss";
import SimpleChatbot from "../Chatbot/SimpleChatbot";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>TBS Solutions – Digitale Struktur für Ihren Alltag</title>
        <meta
          name="description"
          content="TBS Solutions unterstützt Sie mit klaren, digitalen Lösungen für mehr Struktur, Effizienz und Übersicht im Alltag."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="home-page">
        {/* HERO */}
        <section className="home-hero">
          <div className="hero-inner">
            <h1>
              Digitale Struktur.
              <br />
              <span>Einfach. Persönlich. Verlässlich.</span>
            </h1>

            <p>
              Wir helfen Ihnen, Ordnung und Effizienz in Ihren Alltag zu bringen –
              ohne komplizierte Technik, ohne Fachchinesisch.
            </p>

            <div className="hero-actions">
              <Link to="/kontakt" className="btn-primary">
                Kontakt aufnehmen
              </Link>
              <Link to="/dienstleistungen" className="btn-secondary">
                Leistungen entdecken
              </Link>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="home-values">
          <h2>Was TBS Solutions auszeichnet</h2>

          <div className="values-grid">
            <div className="value-card">
              <h3>Persönliche Betreuung</h3>
              <p>
                Wir nehmen uns Zeit, hören zu und entwickeln Lösungen, die wirklich
                zu Ihnen passen.
              </p>
            </div>

            <div className="value-card">
              <h3>Einfache Lösungen</h3>
              <p>
                Keine unnötige Technik – nur klare, verständliche und sofort
                nutzbare Konzepte.
              </p>
            </div>

            <div className="value-card">
              <h3>Zuverlässigkeit</h3>
              <p>
                Sie können sich auf uns verlassen – transparent, ehrlich und
                langfristig.
              </p>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="home-trust">
          <div className="trust-inner">
            <h2>Darauf können Sie sich verlassen</h2>

            <ul>
              <li>✔ Diskreter Umgang mit Ihren Anliegen</li>
              <li>✔ Langjährige Erfahrung & Praxisnähe</li>
              <li>✔ Verständnis für individuelle Situationen</li>
              <li>✔ Klare Kommunikation ohne Fachbegriffe</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta">
          <h2>Bereit für mehr Klarheit im Alltag?</h2>
          <p>
            Lassen Sie uns gemeinsam eine Lösung finden – unverbindlich,
            persönlich und auf Augenhöhe.
          </p>
          <Link to="/kontakt" className="btn-primary large">
            Jetzt unverbindlich anfragen
          </Link>
        </section>
      </main>

      {/* ✅ CHATBOT GLOBAL & IMMER SICHTBAR */}
      <SimpleChatbot />
    </>
  );
};

export default Home;
