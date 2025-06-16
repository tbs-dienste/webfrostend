import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import './KundeBewertungformular.scss';

const BewertungFelder = [
  'arbeitsqualität',
  'tempo',
  'freundlichkeit',
  'zufriedenheit',
  'kommunikation',
  'zuverlässigkeit',
  'professionalität',
  'gesamt'
];

const KundeBewertungformular = () => {
  const { kundennummer } = useParams();

  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [aktuelleDienstleistungIndex, setAktuelleDienstleistungIndex] = useState(0);
  const [formValuesList, setFormValuesList] = useState([]);
  const [fehler, setFehler] = useState('');
  const [alleBewertungenAbgeschlossen, setAlleBewertungenAbgeschlossen] = useState(false);

  useEffect(() => {
    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${kundennummer}/dienstleistungen`);
        const dienstList = response.data.data || [];

        setDienstleistungen(dienstList);

        // Init form values, auch gesamttext dabei
        const initialFormValues = dienstList.map(dienst => {
          const obj = {};
          BewertungFelder.forEach(feld => {
            obj[feld] = dienst.bewertungen ? dienst.bewertungen[feld] || '' : '';
            obj[`${feld}_rating`] = dienst.bewertungen ? dienst.bewertungen[`${feld}_rating`] || 0 : 0;
          });
          obj['gesamttext'] = dienst.bewertungen ? dienst.bewertungen['gesamttext'] || '' : '';
          return obj;
        });

        setFormValuesList(initialFormValues);
      } catch (error) {
        console.error(error);
        setFehler('Fehler beim Laden der Dienstleistungsdaten.');
      }
    };

    fetchDienstleistungen();
  }, [kundennummer]);

  if (dienstleistungen.length === 0) {
    return <div>Keine Dienstleistungen zum Bewerten gefunden.</div>;
  }

  const aktuelleDienstleistung = dienstleistungen[aktuelleDienstleistungIndex];
  const formValues = formValuesList[aktuelleDienstleistungIndex] || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValuesList(prev => {
      const copy = [...prev];
      copy[aktuelleDienstleistungIndex] = { ...copy[aktuelleDienstleistungIndex], [name]: value };
      return copy;
    });
  };

  const handleRatingChange = (newRating, name) => {
    setFormValuesList(prev => {
      const copy = [...prev];
      copy[aktuelleDienstleistungIndex] = { ...copy[aktuelleDienstleistungIndex], [name]: newRating };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFehler('');

    // Alle Ratings prüfen
    const allRatingsSet = BewertungFelder.every(feld => formValues[`${feld}_rating`] > 0);
    if (!allRatingsSet) {
      setFehler('Bitte geben Sie für alle Felder eine Bewertung ab.');
      return;
    }

    // gesamttext prüfen
    if (!formValues.gesamttext || formValues.gesamttext.trim() === '') {
      setFehler('Bitte geben Sie auch einen Gesamttext ein.');
      return;
    }

    // Payload mit dienstleistung_id und allem aus formValues inklusive gesamttext
    const payload = {
      dienstleistung_id: aktuelleDienstleistung.id,
      ...formValues
    };

    try {
      await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${kundennummer}`, payload);
      alert(`Bewertung für Dienstleistung "${aktuelleDienstleistung.name}" erfolgreich gespeichert.`);

      if (aktuelleDienstleistungIndex < dienstleistungen.length - 1) {
        setAktuelleDienstleistungIndex(prev => prev + 1);
      } else {
        setAlleBewertungenAbgeschlossen(true);
      }
    } catch (error) {
      console.error(error);
      setFehler(error?.response?.data?.message || 'Fehler beim Speichern der Bewertung.');
    }
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  if (alleBewertungenAbgeschlossen) {
    return (
      <div className="bewertung-container">
        <h2>Vielen Dank für Ihre Bewertungen!</h2>
      </div>
    );
  }

  return (
    <div className="bewertung-container">
      <h2>Bewertung für Dienstleistung: {aktuelleDienstleistung.name}</h2>
      <form onSubmit={handleSubmit} className="bewertung-form">
        {BewertungFelder.map(feld => (
          <div className="bewertung-feld" key={feld}>
            <div className="label-und-rating">
              <label htmlFor={feld}>{capitalizeFirstLetter(feld)}:</label>
              <ReactStars
                count={5}
                value={formValues[`${feld}_rating`] || 0}
                onChange={(newRating) => handleRatingChange(newRating, `${feld}_rating`)}
                size={30}
                activeColor="#ffca2c"
                isHalf={true}
                classNames="bewertung-sterne"
              />
            </div>
            <textarea
              id={feld}
              name={feld}
              value={formValues[feld] || ''}
              onChange={handleChange}
              placeholder={`Ihre Bewertung zu ${capitalizeFirstLetter(feld)}`}
              className="bewertung-input"
              required
            />
          </div>
        ))}

    
        <button type="submit" className="submit-button">
          {aktuelleDienstleistungIndex < dienstleistungen.length - 1 ? 'Weiter zur nächsten Dienstleistung' : 'Absenden'}
        </button>

        {fehler && <div className="fehler-nachricht">{fehler}</div>}
      </form>
    </div>
  );
};

export default KundeBewertungformular;
