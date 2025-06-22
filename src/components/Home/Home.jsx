import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home">
      {/* Begrüßung */}
      <section className="intro">
        <h1>Willkommen.</h1>
        <p>
          Sie wollen Ordnung, Übersicht und einfache Abläufe – ohne lange Einarbeitung?  
          Dann sind Sie bei uns richtig.
        </p>
        <p>
          Unsere Software ist für Menschen gemacht, nicht für Technik-Freaks.  
          Schnell erklärt, sofort einsetzbar – genau wie Sie es brauchen.
        </p>
        <Link to="/kontakt" className="btn-start">Jetzt Kontakt aufnehmen</Link>
      </section>

      {/* Vertrauen */}
      <section className="vertrauen">
        <h2>Was uns wichtig ist</h2>
        <ul>
          <li><strong>Einfachheit:</strong> Kein Fachchinesisch. Klare Abläufe, klare Bedienung.</li>
          <li><strong>Zuverlässigkeit:</strong> Sie arbeiten täglich – wir liefern täglich.</li>
          <li><strong>Vertraulichkeit:</strong> Ihre Daten gehören Ihnen – Punkt.</li>
        </ul>
      </section>

      {/* Aufruf */}
      <section className="cta">
        <h2>Bereit für den nächsten Schritt?</h2>
        <p>Wir nehmen uns Zeit für Sie. Unverbindlich. Persönlich. Klar.</p>
        <Link to="/kontakt" className="btn-kontakt">Unverbindlich anfragen</Link>
      </section>
    </div>
  );
};

export default Home;
