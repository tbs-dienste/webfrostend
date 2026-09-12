import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import {
  FiArrowUpRight,
  FiCheck,
  FiLayers,
  FiMonitor,
  FiSettings,
  FiShield,
  FiMessageSquare
} from "react-icons/fi";

import "./Home.scss";
import SimpleChatbot from "../Chatbot/SimpleChatbot";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>TBS Solutions – Digitale Struktur für Ihren Alltag</title>

        <meta
          name="description"
          content="TBS Solutions entwickelt klare, persönliche und zuverlässige digitale Lösungen für Unternehmen und den Alltag."
        />

        <meta
          name="robots"
          content="index, follow"
        />
      </Helmet>

      <main className="home-page">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="home-hero">

          <div className="hero-background">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
          </div>

          <div className="hero-container">

            <div className="hero-content">

              <div className="hero-label">
                <span className="hero-label-dot" />
                TBS SOLUTIONS
              </div>

              <h1>
                Digitale Lösungen,
                <br />
                <span>die Klarheit schaffen.</span>
              </h1>

              <p className="hero-description">
                Wir entwickeln digitale Lösungen, die Ihren Alltag
                einfacher, strukturierter und effizienter machen.
                Persönlich begleitet und verständlich umgesetzt.
              </p>

              <div className="hero-actions">

                <Link
                  to="/kontakt"
                  className="hero-button primary"
                >
                  Kontakt aufnehmen
                  <FiArrowUpRight />
                </Link>

                <Link
                  to="/dienstleistungen"
                  className="hero-button secondary"
                >
                  Leistungen ansehen
                </Link>

              </div>

              <div className="hero-note">
                <FiShield />
                <span>
                  Persönlich. Transparent. Verlässlich.
                </span>
              </div>

            </div>


            <div className="hero-visual">

              <div className="visual-main">

                <div className="visual-top">

                  <div className="visual-brand">
                    <span>TBS</span>
                    <small>SOLUTIONS</small>
                  </div>

                  <div className="visual-status">
                    <span />
                    DIGITAL
                  </div>

                </div>


                <div className="visual-heading">
                  <small>IHRE DIGITALE STRUKTUR</small>

                  <strong>
                    Einfach.
                    <br />
                    Persönlich.
                    <br />
                    Verlässlich.
                  </strong>
                </div>


                <div className="visual-lines">

                  <div>
                    <span />
                    <span />
                  </div>

                  <div>
                    <span />
                    <span />
                  </div>

                  <div>
                    <span />
                    <span />
                  </div>

                </div>


                <div className="visual-footer">
                  <span>STRUKTUR</span>
                  <span>EFFIZIENZ</span>
                  <span>ÜBERSICHT</span>
                </div>

              </div>


              <div className="visual-floating-card">
                <FiLayers />

                <div>
                  <strong>
                    Digitale Ordnung
                  </strong>

                  <span>
                    Klar strukturiert
                  </span>
                </div>
              </div>

            </div>

          </div>


          <div className="hero-scroll">
            <span />
            Entdecken
          </div>

        </section>


        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="home-intro">

          <div className="intro-label">
            <span>01</span>
            UNSER ANSATZ
          </div>

          <div className="intro-content">

            <h2>
              Technologie muss
              <span> verständlich </span>
              sein.
            </h2>

            <div className="intro-text">

              <p>
                Digitale Lösungen sollen nicht komplizierter
                machen, sondern vereinfachen.
              </p>

              <p>
                Deshalb setzen wir auf klare Strukturen,
                persönliche Kommunikation und Lösungen,
                die zu den tatsächlichen Anforderungen
                unserer Kunden passen.
              </p>

              <Link
                to="/ueber-uns"
                className="text-link"
              >
                Mehr über TBS Solutions
                <FiArrowUpRight />
              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section className="home-services">

          <div className="section-heading">

            <div className="section-number">
              02
            </div>

            <div>
              <span className="section-label">
                WAS WIR TUN
              </span>

              <h2>
                Digitale Lösungen
                <br />
                mit System.
              </h2>
            </div>

            <p>
              Von modernen Websites bis zu individuellen
              digitalen Anwendungen – wir entwickeln Lösungen
              mit einem klaren Ziel: weniger Komplexität.
            </p>

          </div>


          <div className="services-list">

            <Link
              to="/dienstleistungen"
              className="service-item"
            >

              <div className="service-number">
                01
              </div>

              <div className="service-icon">
                <FiMonitor />
              </div>

              <div className="service-content">

                <span>
                  WEB
                </span>

                <h3>
                  Moderne Websites
                </h3>

                <p>
                  Professionelle Webauftritte, die
                  Unternehmen modern und klar präsentieren.
                </p>

              </div>

              <FiArrowUpRight className="service-arrow" />

            </Link>


            <Link
              to="/dienstleistungen"
              className="service-item"
            >

              <div className="service-number">
                02
              </div>

              <div className="service-icon">
                <FiLayers />
              </div>

              <div className="service-content">

                <span>
                  DIGITAL
                </span>

                <h3>
                  Digitale Lösungen
                </h3>

                <p>
                  Individuelle Systeme und Anwendungen,
                  abgestimmt auf Ihre Anforderungen.
                </p>

              </div>

              <FiArrowUpRight className="service-arrow" />

            </Link>


            <Link
              to="/dienstleistungen"
              className="service-item"
            >

              <div className="service-number">
                03
              </div>

              <div className="service-icon">
                <FiSettings />
              </div>

              <div className="service-content">

                <span>
                  IT & SERVICES
                </span>

                <h3>
                  Betreuung & Support
                </h3>

                <p>
                  Persönliche Unterstützung und zuverlässige
                  Begleitung auch nach der Umsetzung.
                </p>

              </div>

              <FiArrowUpRight className="service-arrow" />

            </Link>

          </div>

        </section>


        {/* =====================================================
            VALUES
        ===================================================== */}

        <section className="home-values">

          <div className="values-header">

            <span className="section-label">
              03 — UNSERE WERTE
            </span>

            <h2>
              Gute digitale Arbeit
              <br />
              beginnt mit <em>Vertrauen.</em>
            </h2>

          </div>


          <div className="values-grid">

            <article className="value-item">

              <div className="value-icon">
                <FiMessageSquare />
              </div>

              <span>
                01
              </span>

              <h3>
                Persönlich
              </h3>

              <p>
                Direkte Kommunikation statt anonymer
                Prozesse. Wir hören zu und verstehen,
                was wirklich gebraucht wird.
              </p>

            </article>


            <article className="value-item">

              <div className="value-icon">
                <FiLayers />
              </div>

              <span>
                02
              </span>

              <h3>
                Einfach
              </h3>

              <p>
                Keine unnötige Komplexität. Unsere Lösungen
                sollen verständlich und im Alltag einfach
                nutzbar sein.
              </p>

            </article>


            <article className="value-item">

              <div className="value-icon">
                <FiShield />
              </div>

              <span>
                03
              </span>

              <h3>
                Verlässlich
              </h3>

              <p>
                Klare Kommunikation, transparente Abläufe
                und eine Zusammenarbeit, auf die Sie
                sich verlassen können.
              </p>

            </article>

          </div>

        </section>


        {/* =====================================================
            CHECK SECTION
        ===================================================== */}

        <section className="home-focus">

          <div className="focus-inner">

            <div className="focus-left">

              <span className="section-label">
                04 — UNSER VERSPRECHEN
              </span>

              <h2>
                Digital.
                <br />
                Aber
                <br />
                <span>menschlich.</span>
              </h2>

            </div>


            <div className="focus-right">

              <p className="focus-intro">
                Wir glauben, dass gute digitale Lösungen
                nicht nur technisch funktionieren müssen.
                Sie müssen sich auch richtig anfühlen.
              </p>


              <div className="focus-list">

                <div>
                  <FiCheck />
                  <span>
                    Klare Kommunikation
                  </span>
                </div>

                <div>
                  <FiCheck />
                  <span>
                    Individuelle Lösungen
                  </span>
                </div>

                <div>
                  <FiCheck />
                  <span>
                    Verständliche Prozesse
                  </span>
                </div>

                <div>
                  <FiCheck />
                  <span>
                    Persönliche Betreuung
                  </span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="home-cta">

          <div className="cta-background">
            <span />
            <span />
            <span />
          </div>

          <div className="cta-content">

            <span className="section-label">
              05 — DER NÄCHSTE SCHRITT
            </span>

            <h2>
              Lassen Sie uns
              <br />
              etwas <span>Besseres</span> schaffen.
            </h2>

            <p>
              Sie haben eine Idee, ein bestehendes Problem
              oder möchten Ihren digitalen Auftritt verbessern?
              Sprechen Sie mit uns.
            </p>

            <Link
              to="/kontakt"
              className="cta-button"
            >
              Gespräch starten
              <FiArrowUpRight />
            </Link>

          </div>

        </section>

      </main>


      <SimpleChatbot />
    </>
  );
};

export default Home;

