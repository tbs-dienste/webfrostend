import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Link, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import './BewertungDetail.scss';

const BewertungDetail = () => {
  const { id } = useParams();
  const [bewertung, setBewertung] = useState(null);

  useEffect(() => {
    const fetchBewertung = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${id}`);
        if (response.data.data) {
          setBewertung(response.data.data);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Bewertung:', error);
        setBewertung(null);
      }
    };

    fetchBewertung();
  }, [id]);

  if (!bewertung) {
    return <div className="bewertung-loading">⏳ Bewertung wird geladen...</div>;
  }

  const bewertungsFelder = [
    { key: 'arbeitsqualitaet', label: 'Arbeitsqualität' },
    { key: 'tempo', label: 'Tempo' },
    { key: 'freundlichkeit', label: 'Freundlichkeit' },
    { key: 'zufriedenheit', label: 'Zufriedenheit' },
    { key: 'kommunikation', label: 'Kommunikation' },
    { key: 'zuverlaessigkeit', label: 'Zuverlässigkeit' },
    { key: 'professionalitaet', label: 'Professionalität' },
    { key: 'gesamtrating', label: 'Gesamtrating' },
  ];

  return (
    <div className="bewertung-page">
      <div className="bewertung-header">
        <Link to="/bewertungen" className="bewertung-back">
          <HiArrowLeft size={22} />
          <span>Zurück zur Übersicht</span>
        </Link>
        <h1>Bewertungsdetails</h1>
        <p className="dienstleistung-title">
          <strong>Dienstleistung:</strong> {bewertung.dienstleistung_title}
        </p>
      </div>

      <div className="bewertung-content">
        {bewertungsFelder.map(({ key, label }) => {
          const ratingValue = bewertung[`${key}_rating`] !== undefined
            ? parseFloat(bewertung[`${key}_rating`]) || 0
            : parseFloat(bewertung[key]) || 0;

          const textValue = bewertung[key] && typeof bewertung[key] === 'string'
            ? bewertung[key]
            : null;

          return (
            <div key={key} className="bewertung-card">
              <div className="card-header">
                <h2>{label}</h2>
                <ReactStars
                  count={5}
                  value={ratingValue}
                  size={28}
                  color2={'#fbbf24'}
                  edit={false}
                />
              </div>
              {textValue && (
                <p className="bewertung-score">„{textValue}“</p>
              )}
            </div>
          );
        })}

        <div className="bewertung-card bewertung-kommentar">
          <h2>Gesamtkommentar</h2>
          <p>{bewertung.gesamttext || 'Kein Kommentar vorhanden.'}</p>
        </div>
      </div>
    </div>
  );
};

export default BewertungDetail;
