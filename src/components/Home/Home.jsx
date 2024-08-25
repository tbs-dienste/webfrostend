import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.scss';
import Loading from '../Loading/Loading';

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
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const setSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-container">
      <div className="slide-container">
        <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <img src={slide.img} alt={slide.title} className="slide-image" />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p className="slide-description">
                  {slide.description.length > 100 ? `${slide.description.substring(0, 100)}...` : slide.description}
                </p>
                <Link to={`/service/${slide.id}`} className="btn-more">Mehr erfahren</Link>
              </div>
            </div>
          ))}
        </div>
        <button className="prev" onClick={prevSlide}>&#10094;</button>
        <button className="next" onClick={nextSlide}>&#10095;</button>
      </div>
      <div className="dots">
        {slides.map((_, index) => (
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
