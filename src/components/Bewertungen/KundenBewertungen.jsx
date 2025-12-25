import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactStars from "react-stars";
import { Link } from "react-router-dom";
import "./KundenBewertungen.scss";

const KundenBewertungen = () => {
  const [daten, setDaten] = useState([]);
  const [durchschnitt, setDurchschnitt] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBewertungen = async () => {
      try {
        const res = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen"
        );

        const list = (res.data?.data || []).filter(
          (d) => Number(d.anzahl_bewertungen) > 0
        );

        setDaten(list);
        setDurchschnitt(berechneGesamt(list));
      } catch (err) {
        console.error(err);
        setDaten([]);
      } finally {
        setLoading(false);
      }
    };

    loadBewertungen();
  }, []);

  const berechneGesamt = (arr) => {
    if (!arr.length) return 0;
    const sum = arr.reduce(
      (acc, d) => acc + Number(d.durchschnitt_rating_dienstleistung),
      0
    );
    return (sum / arr.length).toFixed(1);
  };

  if (loading) {
    return <div className="bewertung-loading">Bewertungen werden geladen …</div>;
  }

  return (
    <div className="bewertung-detail">
      {/* HERO */}
      <section className="bewertung-hero">
        <h1>Kundenbewertungen</h1>
        <span className="dienstleistung">
          Transparente Erfahrungen mit unseren Dienstleistungen
        </span>
      </section>

      {/* CONTENT */}
      <section className="bewertung-content">
        {/* GESAMT */}
        <div className="rating-card" style={{ marginBottom: "40px" }}>
          <div className="rating-header">
            <h3>Gesamtbewertung</h3>
            <ReactStars
              count={5}
              value={Number(durchschnitt)}
              size={28}
              color2="#fbbf24"
              edit={false}
            />
          </div>

          <p className="rating-text">
            Durchschnitt aus allen abgegebenen Kundenbewertungen
          </p>

          <strong style={{ fontSize: "26px", color: "#4f46e5" }}>
            {durchschnitt} / 5
          </strong>
        </div>

        {/* GRID */}
        <div className="ratings-grid">
          {daten.map((d) => (
            <Link
              key={d.dienstleistung_id}
              to={`/dienstleistung/${d.dienstleistung_id}`}
              className="rating-card"
              style={{ textDecoration: "none" }}
            >
              <div className="rating-header">
                <h3>{d.dienstleistung}</h3>
                <ReactStars
                  count={5}
                  value={Number(d.durchschnitt_rating_dienstleistung)}
                  size={20}
                  color2="#fbbf24"
                  edit={false}
                />
              </div>

              <p className="rating-text">
                {Number(d.durchschnitt_rating_dienstleistung).toFixed(1)} / 5
                aus {d.anzahl_bewertungen} Bewertung
                {d.anzahl_bewertungen !== 1 && "en"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KundenBewertungen;
