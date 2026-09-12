
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { Helmet } from "react-helmet";

import Loading from "../Loading/Loading";
import "./Dienstleistungen.scss";

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

        setServices(res.data || res.data.data);
      } catch (err) {
        console.error(
          "Fehler beim Laden der Dienstleistungen:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Dienstleistung wirklich löschen?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setServices((prev) =>
        prev.filter((service) => service.id !== id)
      );
    } catch (err) {
      console.error(
        "Fehler beim Löschen:",
        err
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>Dienstleistungen | TBS Solutions</title>

        <meta
          name="description"
          content="Entdecken Sie die digitalen Dienstleistungen von TBS Solutions – persönlich, klar und zuverlässig."
        />
      </Helmet>

      <main className="offer-page">

        {/* =====================================================
            INTRO / HERO
        ===================================================== */}

        <section className="offer-introduction">

          <div className="offer-introduction-inner">

            <div className="offer-introduction-label">
              <span />
              TBS SOLUTIONS
            </div>

            <div className="offer-introduction-layout">

              <div className="offer-introduction-title">

                <span className="offer-index">
                  01 — LEISTUNGEN
                </span>

                <h1>
                  Was wir
                  <br />
                  <strong>für Sie</strong>
                  <br />
                  entwickeln.
                </h1>

              </div>


              <div className="offer-introduction-copy">

                <p>
                  Digitale Lösungen müssen nicht kompliziert
                  sein. Wir entwickeln moderne, verständliche
                  und auf Ihre Anforderungen abgestimmte
                  Lösungen.
                </p>

                {isAdmin && (
                  <Link
                    to="/service-create"
                    className="offer-create"
                  >
                    <FaPlus />
                    <span>
                      Neue Dienstleistung
                    </span>
                  </Link>
                )}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SERVICE OVERVIEW
        ===================================================== */}

        <section className="offer-catalog">

          <div className="offer-catalog-header">

            <div>
              <span>
                UNSERE ANGEBOTE
              </span>

              <h2>
                Lösungen mit
                <em> System.</em>
              </h2>
            </div>

            <p>
              Von einzelnen digitalen Projekten bis zu
              individuellen Lösungen begleiten wir Sie
              persönlich und transparent.
            </p>

          </div>


          {services.length === 0 ? (

            <div className="offer-empty">

              <span>
                00
              </span>

              <h3>
                Keine Dienstleistungen verfügbar.
              </h3>

              <p>
                Aktuell sind keine Leistungen hinterlegt.
              </p>

            </div>

          ) : (

            <div className="offer-collection">

              {services.map((service, index) => (

                <article
                  className="offer-entry"
                  key={service.id}
                >

                  <div className="offer-entry-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>


                  <div className="offer-entry-image">

                    {service.bild ? (

                      <img
                        src={`data:image/png;base64,${service.bild}`}
                        alt={service.title}
                      />

                    ) : (

                      <div className="offer-image-empty">
                        <span>
                          TBS
                        </span>
                      </div>

                    )}

                  </div>


                  <div className="offer-entry-content">

                    <span className="offer-entry-category">
                      TBS SOLUTIONS
                    </span>

                    <h3>
                      {service.title}
                    </h3>

                    <p>
                      {service.description?.length > 190
                        ? `${service.description.slice(0, 190)}…`
                        : service.description}
                    </p>


                    <div className="offer-entry-bottom">

                      <Link
                        to={`/service/${service.id}`}
                        className="offer-details"
                      >
                        <span>
                          Leistung entdecken
                        </span>

                        <strong>
                          ↗
                        </strong>
                      </Link>


                      {isAdmin && (

                        <button
                          type="button"
                          className="offer-remove"
                          onClick={() =>
                            handleDelete(service.id)
                          }
                          title="Dienstleistung löschen"
                        >
                          <FaTrash />
                        </button>

                      )}

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>


        {/* =====================================================
            BOTTOM STATEMENT
        ===================================================== */}

        <section className="offer-statement">

          <div className="offer-statement-inner">

            <span>
              TBS SOLUTIONS — DIGITAL SERVICES
            </span>

            <h2>
              Sie haben eine Idee?
              <br />
              <em>Wir machen sie digital.</em>
            </h2>

            <Link
              to="/kontakt"
              className="offer-contact"
            >
              Projekt besprechen
              <strong>↗</strong>
            </Link>

          </div>

        </section>

      </main>
    </>
  );
};

export default Dienstleistungen;
