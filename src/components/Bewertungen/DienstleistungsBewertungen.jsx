import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
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
        const res = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/dienstleistungen/${dienstleistungId}`);
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

  if (loading) return <div className="bewertungen-wrapper">Lade Bewertungen...</div>;
  if (fehler) return <div className="bewertungen-wrapper error">{fehler}</div>;

  return (
    <div className="bewertungen-wrapper">
      <h2>Bewertungen für: {dienstleistung?.title || dienstleistung?.dienstleistung}</h2>

      {bewertungen.length === 0 ? (
        <p className="leer">Keine Bewertungen vorhanden.</p>
      ) : (
        <div className="bewertungen-liste">
          {bewertungen.map((b) => (
            <Link to={`/bewertungen/${b.id}`} className="bewertung-card" key={b.id}>
              <div className="rating">⭐ {b.gesamtrating}/5</div>
              <p className="text">{b.gesamttext}</p>
              <span className="id">#ID: {b.id}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DienstleistungsBewertungen;
