import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-stars";
import "./DienstleistungsBewertungen.scss";

const DienstleistungsBewertungen = () => {
  const { dienstleistungId } = useParams();
  const [dienstleistung, setDienstleistung] = useState(null);
  const [bewertungen, setBewertungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fehler, setFehler] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/dienstleistungen/${dienstleistungId}`
        );

        setDienstleistung(res.data.data.dienstleistung);
        setBewertungen(res.data.data.bewertungen || []);
      } catch (err) {
        console.error(err);
        setFehler("Bewertungen konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dienstleistungId]);

  if (loading) {
    return <div className="db-loading">Bewertungen werden geladen…</div>;
  }

  if (fehler) {
    return <div className="db-error">{fehler}</div>;
  }

  return (
    <main className="db-page">
      {/* HEADER */}
      <header className="db-header">
        <h1>Bewertungen</h1>
        <p className="db-subtitle">
          {dienstleistung?.title || dienstleistung?.dienstleistung}
        </p>
      </header>

      {/* CONTENT */}
      <section className="db-content">
        {bewertungen.length === 0 ? (
          <div className="db-empty">
            Für diese Dienstleistung liegen noch keine Bewertungen vor.
          </div>
        ) : (
          <div className="db-grid">
            {bewertungen.map((b) => (
              <Link
                to={`/bewertungen/${b.id}`}
                className="db-card"
                key={b.id}
              >
                <div className="db-card-header">
                  <ReactStars
                    count={5}
                    value={b.gesamtrating}
                    size={26}
                    edit={false}
                    color2="#fbbf24"
                  />
                  <span className="db-score">{b.gesamtrating}/5</span>
                </div>

                <p className="db-text">
                  {b.gesamttext
                    ? `„${b.gesamttext}“`
                    : "Kein Kommentar vorhanden."}
                </p>

                <span className="db-id">Bewertung #{b.id}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default DienstleistungsBewertungen;
