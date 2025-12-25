import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactStars from "react-stars";
import { Link, useParams } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import "./BewertungDetail.scss";

const BewertungDetail = () => {
  const { id } = useParams();
  const [bewertung, setBewertung] = useState(null);

  useEffect(() => {
    const fetchBewertung = async () => {
      try {
        const res = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${id}`
        );
        setBewertung(res.data.data);
      } catch (err) {
        console.error(err);
        setBewertung(null);
      }
    };

    fetchBewertung();
  }, [id]);

  if (!bewertung) {
    return <div className="bewertung-loading">Bewertung wird geladen…</div>;
  }

  const felder = [
    { key: "arbeitsqualitaet", label: "Arbeitsqualität" },
    { key: "tempo", label: "Tempo" },
    { key: "freundlichkeit", label: "Freundlichkeit" },
    { key: "zufriedenheit", label: "Zufriedenheit" },
    { key: "kommunikation", label: "Kommunikation" },
    { key: "zuverlaessigkeit", label: "Zuverlässigkeit" },
    { key: "professionalitaet", label: "Professionalität" },
    { key: "gesamtrating", label: "Gesamtrating" }
  ];

  return (
    <main className="bewertung-detail">
      {/* HERO */}
      <section className="bewertung-hero">
        <Link to="/bewertungen" className="back-link">
          <HiArrowLeft size={22} /> Zurück zur Übersicht
        </Link>

        <h1>Bewertungsdetails</h1>
        <span className="dienstleistung">
          {bewertung.dienstleistung_title}
        </span>
      </section>

      {/* CONTENT */}
      <section className="bewertung-content">
        <div className="ratings-grid">
          {felder.map(({ key, label }) => {
            const rating =
              parseFloat(bewertung[`${key}_rating`]) ||
              parseFloat(bewertung[key]) ||
              0;

            const text =
              typeof bewertung[key] === "string" ? bewertung[key] : null;

            return (
              <div className="rating-card" key={key}>
                <div className="rating-header">
                  <h3>{label}</h3>
                  <ReactStars
                    count={5}
                    value={rating}
                    size={26}
                    edit={false}
                    color2="#fbbf24"
                  />
                </div>

                {text && <p className="rating-text">„{text}“</p>}
              </div>
            );
          })}
        </div>

        <div className="comment-card">
          <h3>Gesamtkommentar</h3>
          <p>{bewertung.gesamttext || "Kein Kommentar vorhanden."}</p>
        </div>
      </section>
    </main>
  );
};

export default BewertungDetail;
