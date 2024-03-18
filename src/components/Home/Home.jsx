import React, { useState, useEffect } from 'react';
import './Home.scss';

import Programmieren from './programmieren.png';
import DiaShow from './diashow.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    { id: 1, image: Programmieren, title: "Webseite Programmieren", description: "Lassen Sie uns Ihre Webseite programmieren" },
    { id: 2, image: DiaShow, title: "Diashow erstellen", description: "Lassen Sie uns Ihre wertvollen Erinnerungen in einer professionellen Diashow zum Leben erwecken." },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="container">
      <div className="slide-container">
        <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={slide.id} className="slide">
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
          
          
              
            </div>
          ))}
        </div>
      
      </div>
      <div className='text-container'>
                  <div className='titel'>
                    <h1>Unsere Dienstleistungen</h1>
                    <p>Wir möchten dich herzlich einladen zu unserer Hochzeit.</p>
                  </div>
                </div>
    </div>
  );
};

export default Home;
