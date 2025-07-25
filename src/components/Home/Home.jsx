import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Home.scss';

const Home = () => {
  return (
    <div className="home">
      {/* SEO-Meta-Tags */}
      <Helmet>
        <title>TBs Solutions – Alltag vereinfachen durch digitale Struktur</title>
        <meta name="description" content="TBs Solutions hilft Ihnen, mit digitalen Lösungen den Alltag effizient und einfach zu gestalten. Persönlich. Praxisnah. Verlässlich." />
        <meta name="keywords" content="Alltagshilfe, Struktur, Organisation, TBs Solutions, digitale Unterstützung, persönliche Beratung" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TBs Solutions" />

        {/* Open Graph für Facebook / LinkedIn */}
        <meta property="og:title" content="TBs Solutions – Struktur für Ihren Alltag" />
        <meta property="og:description" content="Wir bieten Ihnen einfache, persönliche Lösungen zur Alltagsorganisation – ohne komplizierte Technik." />
        <meta property="og:url" content="https://www.tbs-solutions.net" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.tbs-solutions.net/logo.png" />

        {/* JSON-LD Strukturierte Daten für Google */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TBs Solutions",
              "url": "https://www.tbs-solutions.net",
              "logo": "https://www.tbs-solutions.net/logo.png",
              "description": "Wir helfen Menschen, ihren Alltag mit digitalen Lösungen einfacher und strukturierter zu gestalten.",
              "sameAs": []
            }
          `}
        </script>
      </Helmet>

      {/* Begrüßung */}
      <section className="intro" id="start">
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
      <section className="angebot" id="leistungen">
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
      <section className="vertrauen" id="vertrauen">
        <h2>Darauf können Sie vertrauen</h2>
        <ul>
          <li><strong>Diskretion:</strong> Ihre Anliegen behandeln wir vertraulich und mit Respekt.</li>
          <li><strong>Erfahrung:</strong> Jahrelange Praxis und zufriedene Kunden sprechen für uns.</li>
          <li><strong>Verständnis:</strong> Wir arbeiten mit Herz und Verstand für Ihren Erfolg.</li>
        </ul>
      </section>

      {/* Aufruf */}
      <section className="cta" id="kontakt">
        <h2>Bereit für den nächsten Schritt?</h2>
        <p>Vereinbaren Sie ein unverbindliches Gespräch – persönlich, individuell und auf Augenhöhe.</p>
        <Link to="/kontakt" className="btn-kontakt">Jetzt anfragen</Link>
      </section>
    </div>
  );
};

export default Home;