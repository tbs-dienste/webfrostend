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
    { id: 1, gesamt: "Sehr gut", gesamtrating: 4.5 }
  ];

  return (
    <div className="kunden-bewertungen">
      <section className="header">
        <h1>Kundenbewertungen</h1>
        <p>Erfahren Sie, wie Kunden unsere Leistungen bewerten</p>
      </section>

      <section className="durchschnitt-box">
        <ReactStars count={5} value={parseFloat(durchschnitt)} size={48} color2={'#FFD700'} edit={false} />
        <div className="score">{durchschnitt} / 5</div>
      </section>

      <section className="bewertungen-grid">
        {bewertungen.map(b => (
          <Link to={`/bewertung/${b.id}`} className="bewertung-card" key={b.id}>
            <div className="bewertung-title">
              <h3>{b.gesamt}</h3>
              <ReactStars count={5} value={parseFloat(b.gesamtrating)} size={20} color2={'#FFD700'} edit={false} />
            </div>
            <p className="mehr">➤ Bewertung ansehen</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default KundenBewertungen;
