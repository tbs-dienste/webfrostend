import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Link, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import './BewertungDetail.scss';

const BewertungDetail = () => {
  const { id } = useParams();
  const [bewertung, setBewertung] = useState(null);
  const [fakeName, setFakeName] = useState('');

  useEffect(() => {
    const fetchBewertung = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${id}`);
        if (response.data.data && response.data.data.length > 0) {
          setBewertung(response.data.data[0]);
          generateFakeName();
        } else {
          setBewertung(null);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Bewertung:', error);
        setBewertung(null);
      }
    };

    const generateFakeName = () => {
      const vornamen = ['Noah', 'Luca', 'Lea', 'Mia', 'Liam', 'Sophie', 'Nico', 'Elin', 'Jonas', 'Lara'];
      const nachnamen = ['Hänni', 'Meier', 'Schmid', 'Keller', 'Fischer', 'Gerber', 'Baumann', 'Moser', 'Huber', 'Zimmermann'];
      const vorname = vornamen[Math.floor(Math.random() * vornamen.length)];
      const nachname = nachnamen[Math.floor(Math.random() * nachnamen.length)];
      setFakeName(`${vorname} ${nachname}`);
    };

    fetchBewertung();
  }, [id]);

  if (!bewertung) {
    return <div className="bewertung-loading">Lade Bewertung...</div>;
  }

  return (
    <div className="bewertung-page">
      <div className="bewertung-header">
        <Link to="/bewertungen" className="bewertung-back">
          <HiArrowLeft size={22} />
          <span>Zurück zur Übersicht</span>
        </Link>
        <h1>Bewertung im Detail</h1>
      </div>

      <div className="bewertung-fake-name">
        <h2>{fakeName}</h2>
        <p className="fake-hinweis">Name geändert aus Datenschutzgründen</p>
      </div>

      <div className="bewertung-content">
        {['arbeitsqualität', 'tempo', 'gesamt', 'freundlichkeit', 'zufriedenheit'].map((field) => (
          <div key={field} className="bewertung-card">
            <h2>{capitalizeFirstLetter(field)}</h2>
            <ReactStars
              count={5}
              value={parseFloat(bewertung[`${field}_rating`])}
              size={28}
              color2={'#fbbf24'}
              edit={false}
            />
            <p className="bewertung-score">Wertung: {bewertung[field]}</p>
          </div>
        ))}

        <div className="bewertung-card bewertung-kommentar">
          <h2>Kommentar</h2>
          <p>{bewertung.gesamttext || 'Kein Kommentar vorhanden.'}</p>
        </div>
      </div>
    </div>
  );
};

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default BewertungDetail;
