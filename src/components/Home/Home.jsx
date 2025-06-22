import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home">
      {/* Begrüßung */}
      <section className="intro">
        <h1>Willkommen bei TBs Solutions</h1>
        <p>
          Sie suchen klare Strukturen und einfache Abläufe im Alltag?  
          Wir unterstützen Sie dabei, Ihren Alltag leichter und effizienter zu gestalten – ganz ohne komplizierte Technik.
        </p>
        <p>
          Unser Angebot richtet sich an Menschen, die Wert auf Verlässlichkeit, persönlichen Service und echte Lösungen legen.  
          Keine langen Schulungen, keine unnötigen Fachbegriffe – nur das, was Sie wirklich brauchen.
        </p>
        <Link to="/kontakt" className="btn-start">Jetzt Kontakt aufnehmen</Link>
      </section>

      {/* Unser Angebot */}
      <section className="angebot">
        <h2>Was wir für Sie tun</h2>
        <p>
          Ob Beratung, Organisation oder praktische Unterstützung – wir helfen Ihnen, den Überblick zu behalten und Ihre Ziele zu erreichen.
          Mit unserem erfahrenen Team begleiten wir Sie persönlich und individuell, Schritt für Schritt.
        </p>
        <ul>
          <li><strong>Persönlicher Kontakt:</strong> Wir hören zu, verstehen Ihre Wünsche und finden passende Lösungen.</li>
          <li><strong>Praxisnah:</strong> Unsere Methoden sind leicht verständlich und sofort anwendbar.</li>
          <li><strong>Zuverlässigkeit:</strong> Wir sind für Sie da – wenn Sie uns brauchen.</li>
        </ul>
      </section>

      {/* Vertrauen */}
      <section className="vertrauen">
        <h2>Darauf können Sie vertrauen</h2>
        <ul>
          <li><strong>Diskretion:</strong> Ihre Anliegen behandeln wir vertraulich und mit Respekt.</li>
          <li><strong>Erfahrung:</strong> Jahrelange Praxis und zufriedene Kunden sprechen für uns.</li>
          <li><strong>Verständnis:</strong> Wir arbeiten mit Herz und Verstand für Ihren Erfolg.</li>
        </ul>
      </section>

      {/* Aufruf */}
      <section className="cta">
        <h2>Bereit für den nächsten Schritt?</h2>
        <p>Vereinbaren Sie ein unverbindliches Gespräch – persönlich, individuell und auf Augenhöhe.</p>
        <Link to="/kontakt" className="btn-kontakt">Jetzt anfragen</Link>
      </section>
    </div>
  );
};

export default Home;
