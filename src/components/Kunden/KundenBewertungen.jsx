import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Link } from 'react-router-dom';
import './KundenBewertungen.scss';

const KundenBewertungen = () => {
  const [bewertungen, setBewertungen] = useState([]);
  const [durchschnitt, setDurchschnitt] = useState(0);

  useEffect(() => {
    const fetchBewertungen = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen');
        const bewertungenData = response.data.data || [];
        setBewertungen(bewertungenData);
        setDurchschnitt(calculateDurchschnitt(bewertungenData));
      } catch (error) {
        console.error('Fehler beim Laden der Bewertungen:', error);
        setBewertungen(dummyBewertungen);
        setDurchschnitt(calculateDurchschnitt(dummyBewertungen));
      }
    };

    fetchBewertungen();
  }, []);

  const calculateDurchschnitt = (bewertungen) => {
    if (!bewertungen.length) return 0;
    const total = bewertungen.reduce((sum, bewertung) => sum + parseFloat(bewertung.gesamtrating), 0);
    return (total / bewertungen.length).toFixed(1);
  };

  const dummyBewertungen = [
    {
      id: 1,
      gesamt: "Sehr gut",
      gesamtrating: 4.5
    }
  ];

  return (
    <div className="bewertung-app">
      <div className="header">
        <h1>Kundenbewertungen</h1>
        <p>Erfahren Sie, was unsere Kunden sagen</p>
      </div>
      
      <div className="durchschnitt-rating">
        <ReactStars
          count={5}
          value={parseFloat(durchschnitt)}
          size={50}
          color2={'#FFD700'}
          edit={false}
        />
        <span className="rating-value">{durchschnitt}</span>
      </div>
      
      <div className="bewertungen-container">
        {bewertungen.map(bewertung => (
          <Link to={`/bewertung/${bewertung.id}`} key={bewertung.id} className="bewertung-box">
            <div className="bewertung-header">
              <p className="bewertung-text">{bewertung.gesamt}</p>
              <ReactStars
                count={5}
                value={parseFloat(bewertung.gesamtrating)}
                size={24}
                color2={'#FFD700'}
                edit={false}
              />
            </div>
            <div className="bewertung-details">
              <p className="bewertung-summary">Lesen Sie mehr...</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KundenBewertungen;
