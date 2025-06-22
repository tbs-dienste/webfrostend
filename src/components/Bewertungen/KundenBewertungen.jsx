import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Link } from 'react-router-dom';
import './KundenBewertungen.scss';

const KundenBewertungen = () => {
  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [gesamtDurchschnitt, setGesamtDurchschnitt] = useState(0);

  useEffect(() => {
    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen');
        const data = response.data.data || [];
        const gefiltert = data.filter(d => d.anzahl_bewertungen > 0);
        const gesamt = calculateDurchschnitt(gefiltert);

        setDienstleistungen(gefiltert);
        setGesamtDurchschnitt(gesamt);
      } catch (error) {
        console.error('Fehler beim Laden der Bewertungen:', error);
        setDienstleistungen([]);
        setGesamtDurchschnitt(0);
      }
    };

    fetchDienstleistungen();
  }, []);

  const calculateDurchschnitt = (arr) => {
    if (!arr.length) return 0;
    const sum = arr.reduce((total, d) => total + parseFloat(d.durchschnitt_rating_dienstleistung), 0);
    return (sum / arr.length).toFixed(1);
  };

  return (
    <div className="kunden-bewertungen">
      <section className="header">
        <h1>⭐ Kundenbewertungen</h1>
        <p>Wie unsere Kunden die Dienstleistungen erlebt haben</p>
      </section>

      <section className="gesamt-rating-box">
        <ReactStars 
          count={5} 
          value={parseFloat(gesamtDurchschnitt)} 
          size={42} 
          color2={'#fbbf24'} 
          edit={false} 
        />
        <div className="score">{gesamtDurchschnitt} / 5 Gesamtbewertung</div>
        <p className="info">Durchschnitt aus allen bewerteten Dienstleistungen</p>
      </section>

      <section className="bewertungen-grid">
        {dienstleistungen.map(d => (
          <Link to={`/dienstleistung/${d.dienstleistung_id}`} className="bewertung-card" key={d.dienstleistung_id}>
            <div className="bewertung-title">
              <h3>{d.dienstleistung}</h3>
              <ReactStars 
                count={5} 
                value={parseFloat(d.durchschnitt_rating_dienstleistung)} 
                size={24} 
                color2={'#fbbf24'} 
                edit={false} 
              />
              <div className="score">
                {parseFloat(d.durchschnitt_rating_dienstleistung).toFixed(1)} / 5
              </div>
              <div className="anzahl">
                {d.anzahl_bewertungen} Bewertung{d.anzahl_bewertungen !== 1 ? 'en' : ''}
              </div>
            </div>
            <p className="mehr">➤ Jetzt ansehen</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default KundenBewertungen;
