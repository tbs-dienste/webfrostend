import React from "react";
import "./UeberUnsContent.scss"; // Importiere das SCSS-Stylesheet

const UeberUnsContent = () => {
  // Beispielhafte Top-Spender-Liste (kann später aus einer API geladen werden)
  const spender = [
    { name: "Max Mustermann", betrag: 500, rang: "Platin" },
    { name: "Lisa Beispiel", betrag: 250, rang: "Gold" },
    { name: "Erik Code", betrag: 100, rang: "Silber" },
    { name: "Susi Support", betrag: 50, rang: "Bronze" },
    { name: "Lenen. Amen.", betrag: "???", rang: "Geheim" }
  ];

  return (
    <div className="über-uns">
      <h1>Wer wir sind</h1>
      <p>
        <strong>TBS Solutions</strong> ist ein innovatives Startup, das sich auf 
        Software- und IT-Lösungen spezialisiert hat. Unser Ziel ist es, 
        moderne Technologien für Unternehmen und Privatpersonen zugänglich zu machen 
        und Prozesse effizienter zu gestalten.
      </p>

      <h2>Unsere Vision</h2>
      <p>
        Wir glauben daran, dass Technologie die Zukunft ist – und wir möchten aktiv 
        daran mitwirken. Ob individuelle Softwareentwicklung, IT-Support oder digitale 
        Automatisierungslösungen – wir bieten smarte Lösungen für die Herausforderungen 
        von heute und morgen.
      </p>

      <h2>Unterstütze uns!</h2>
      <p>
        Als junges Startup freuen wir uns über jede Unterstützung.  
        Falls du unsere Mission gut findest und uns helfen möchtest, kannst du uns mit einer Spende unterstützen.  
      </p>

      <a href="https://www.paypal.com/donate" target="_blank" rel="noopener noreferrer" className="spenden-button">
        Jetzt spenden ❤️
      </a>

      <h2>Unsere Top-Spender</h2>
      <ul className="spender-liste">
        {spender.map((s, index) => (
          <li key={index} className={`spender spender-${s.rang.toLowerCase()}`}>
            <span className="spender-name">{s.name}</span> – <span className="spender-betrag">{s.betrag}€</span> 
            <span className="spender-rang">({s.rang})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ÜberUns;