import React, { useState, useEffect } from 'react';
import './Home.scss';
import SimpleChatbot from '../Chatbot/SimpleChatbot';
import { Link } from 'react-router-dom';

import Programmieren from './programmieren.png';
import DiaShow from './diashow.jpg';
import GamingPC from './gamingpc.jpeg';
import Musik from './musik.jpeg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState([
    { id: 1, image: Programmieren, title: "Website Programmieren", description: "Lassen Sie uns Ihre Website programmieren" },
    { id: 2, image: DiaShow, title: "Diashow erstellen", description: "Lassen Sie uns Ihre wertvollen Erinnerungen in einer professionellen Diashow zum Leben erwecken." },
    { id: 3, image: GamingPC, title: "Gaming PC", description: "Lassen Sie sich beraten für einen optimal passenden Gaming PC, der in Ihrem Budget liegt." },
    { id: 4, image: Musik, title: "Musik und Sounddesign", description: "Erhalten Sie persönliche Musik und Soundeffekte, die zu Ihrem Projekt passen." },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

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
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
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
      <div className='text-container'>
        <div className='titel'>
          <h1>Unsere Dienstleistungen</h1>
        </div>
        <div className='text'>
          <p>
            Wir bieten eine breite Palette von Dienstleistungen an, die Ihre Bedürfnisse erfüllen. Von der Webseitenprogrammierung bis zur Erstellung professioneller Diashows und der Zusammenstellung eines optimal passenden Gaming-PCs stehen wir Ihnen zur Verfügung.
          </p>
          <p>
            Unser erfahrenes Team wird sicherstellen, dass Ihre Anforderungen mit hoher Qualität und Präzision erfüllt werden.
          </p>
          <p>
            Kontaktieren Sie uns noch heute, um mehr über unsere Dienstleistungen zu erfahren und wie wir Ihnen helfen können.
          </p>
        </div>
        <div className="button-container">
        <Link to="/dienstleistungen" className="button">Mehr Erfahren</Link>
        </div>
      </div>
      <SimpleChatbot />
    </div>
  );
};

export default Home;
