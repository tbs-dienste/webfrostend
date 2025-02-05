import React from "react";
import "./ÜberUns.scss"; // Importiere das SCSS-Stylesheet

const ÜberUns = () => {
  // Beispielhafte Top-Spender-Liste (später dynamisch über API erweiterbar)
  const spender = [
    { name: "Max Mustermann", betrag: 1000, rang: "Platin", währung: "CHF" },
    { name: "Lisa Beispiel", betrag: 750, rang: "Platin", währung: "CHF" },
    { name: "Erik Code", betrag: 500, rang: "Gold", währung: "CHF" },
    { name: "Susi Support", betrag: 250, rang: "Gold", währung: "CHF" },
    { name: "Tom Tester", betrag: 100, rang: "Silber", währung: "CHF" },
    { name: "Anna Analyse", betrag: 50, rang: "Bronze", währung: "CHF" },
  ];

  // Spender nach Rang gruppieren
  const gruppierteSpender = {
    Platin: spender.filter((s) => s.rang === "Platin"),
    Gold: spender.filter((s) => s.rang === "Gold"),
    Silber: spender.filter((s) => s.rang === "Silber"),
    Bronze: spender.filter((s) => s.rang === "Bronze"),
  };

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
      <div className="spender-container">
        {Object.entries(gruppierteSpender).map(([rang, spenderListe]) => (
          <div key={rang} className={`spender-rang spender-${rang.toLowerCase()}`}>
            <h3>{rang}</h3>
            {spenderListe.map((s, index) => (
              <div key={index} className="spender">
                <span className="spender-name">{s.name}</span>
                <span className="spender-betrag">{s.betrag} {s.währung}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ÜberUns;