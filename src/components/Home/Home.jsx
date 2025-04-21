import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.scss';
import Loading from '../Loading/Loading';
import eroeffnung from './summersale.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
        setSlides(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Laden der Dienstleistungen:", error);
        setError("Fehler beim Laden der Dienstleistungen.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length * 2 - 1 : prevSlide - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % (slides.length * 2)); // Zweifache Anzahl der Slides
  };

  const setSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-container">
      <div className="slide-container">
        <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: 'transform 0.5s ease' }}>
          {/* Abwechselndes Bild (erstes Bild: eroeffnung.png) */}
          {Array.from({ length: slides.length * 2 }).map((_, index) => {
            const isEroffnung = index % 2 === 0; // Bestimmt, ob es das Eröffnungsbild oder ein Dienstleistungsbild ist
            const slideIndex = Math.floor(index / 2); // Bestimmt den Index der Dienstleistung, wenn es sich um ein Dienstleistungsbild handelt

            return (
              <div key={index} className="slide">
                {isEroffnung ? (
                  <img src={eroeffnung} alt="Eröffnung" className="slide-image" />
                ) : (
                  <img src={slides[slideIndex].img} alt={slides[slideIndex].title} className="slide-image" />
                )}
                {!isEroffnung && (
                  <div className="slide-content">
                    <h2>{slides[slideIndex].title}</h2>
                    <p className="slide-description">
                      {slides[slideIndex].description.length > 100
                        ? `${slides[slideIndex].description.substring(0, 100)}...`
                        : slides[slideIndex].description}
                    </p>
                    <Link to={`/service/${slides[slideIndex].id}`} className="btn-more">Mehr erfahren</Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="prev" onClick={prevSlide}>&#10094;</button>
        <button className="next" onClick={nextSlide}>&#10095;</button>
      </div>

      <div className="dots">
        {Array.from({ length: slides.length * 2 }).map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setSlide(index)}
          ></span>
        ))}
      </div>

      <div className="text-container">
        <div className="title">
          <h1>Erleben Sie unsere exklusiven Dienstleistungen</h1>
        </div>
        <div className="text">
          <p>
            Wir bieten Ihnen maßgeschneiderte Lösungen, die Ihre Bedürfnisse perfekt erfüllen. Unser Team von Experten steht Ihnen zur Seite, um Ihre Projekte mit höchster Qualität und Präzision umzusetzen. Egal, ob Sie eine innovative Diashow erstellen, eine beeindruckende Website gestalten oder einen leistungsstarken Gaming-PC zusammenstellen möchten – wir haben die richtige Lösung für Sie.
          </p>
          <p>
            Lassen Sie sich von unserem umfangreichen Angebot inspirieren und kontaktieren Sie uns noch heute, um mehr über unsere Dienstleistungen zu erfahren. Wir freuen uns darauf, mit Ihnen zusammenzuarbeiten und Ihre Ideen zum Leben zu erwecken.
          </p>
        </div>
        <div className="button-container">
          <Link to="/dienstleistungen" className="button">Jetzt entdecken</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
