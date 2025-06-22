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
    const fetchBewertungen = async () => {
      try {
        const res = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/dienstleistungen/${dienstleistungId}`
        );
        setDienstleistung(res.data.data.dienstleistung);
        setBewertungen(res.data.data.bewertungen);
        setLoading(false);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
        setFehler("Fehler beim Laden der Bewertungen.");
        setLoading(false);
      }
    };

    fetchBewertungen();
  }, [dienstleistungId]);

  return (
    <div className="bewertungen-wrapper">
      {loading ? (
        <div className="loading-spinner">⏳ Bewertungen werden geladen...</div>
      ) : fehler ? (
        <div className="error-message">{fehler}</div>
      ) : (
        <>
          <h2>
            Bewertungen für:{" "}
            <span className="dienstleistungs-title">
              {dienstleistung?.title || dienstleistung?.dienstleistung}
            </span>
          </h2>

          {bewertungen.length === 0 ? (
            <p className="leer">Für diese Dienstleistung wurden noch keine Bewertungen abgegeben.</p>
          ) : (
            <div className="bewertungen-liste">
              {bewertungen.map((b) => (
                <Link to={`/bewertungen/${b.id}`} className="bewertung-card" key={b.id}>
                  <div className="rating">
                    <ReactStars
                      count={5}
                      size={24}
                      color2={"#fbbf24"}
                      value={b.gesamtrating}
                      edit={false}
                    />
                    <span className="score">{b.gesamtrating}/5</span>
                  </div>
                  <p className="text">„{b.gesamttext}“</p>
                  <span className="id">Bewertung #{b.id}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DienstleistungsBewertungen;
