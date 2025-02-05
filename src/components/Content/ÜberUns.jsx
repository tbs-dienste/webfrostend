import React from "react";
import "./ÜberUns.scss";

const ÜberUns = () => {
  const spender = [
    { name: "Max Mustermann", betrag: 1000, rang: "Platin", währung: "CHF" },
    { name: "Lisa Beispiel", betrag: 750, rang: "Platin", währung: "CHF" },
    { name: "Erik Code", betrag: 500, rang: "Gold", währung: "CHF" },
    { name: "Susi Support", betrag: 250, rang: "Gold", währung: "CHF" },
    { name: "Tom Tester", betrag: 100, rang: "Silber", währung: "CHF" },
    { name: "Anna Analyse", betrag: 50, rang: "Bronze", währung: "CHF" },
  ];

  const sponsoren = [
    { name: "Tech Corp", betrag: 5000, rang: "Gold", währung: "CHF" },
    { name: "Web Solutions GmbH", betrag: 3000, rang: "Platin", währung: "CHF" },
    { name: "Dev Innovations", betrag: 1500, rang: "Silber", währung: "CHF" },
  ];

  const farben = {
    Platin: "platin",
    Gold: "gold",
    Silber: "silber",
    Bronze: "bronze",
  };

  return (
    <div className="über-uns">
      <h1>Wer wir sind</h1>
      <p>
        <strong>TBS Solutions</strong> ist ein innovatives Startup für IT- und Softwarelösungen. 
        Unser Ziel ist es, Unternehmen und Privatpersonen mit moderner Technologie zu unterstützen.
      </p>

      <h2>Unsere Vision</h2>
      <p>
        Technologie ist die Zukunft – und wir möchten aktiv mitgestalten. Ob individuelle Softwareentwicklung, IT-Support oder digitale Automatisierungslösungen – 
        wir bieten smarte Lösungen für moderne Herausforderungen.
      </p>

      <h2>Unterstütze uns!</h2>
      <p>
        Als junges Startup freuen wir uns über jede Unterstützung. Falls du unsere Mission gut findest, kannst du uns mit einer Spende helfen.
      </p>

      <a href="https://www.paypal.com/donate" target="_blank" rel="noopener noreferrer" className="spenden-button">
        Jetzt spenden ❤️
      </a>

      <h2>Unsere Top-Spender</h2>
      <div className="spender-grid">
        {spender.map((s, index) => (
          <div key={index} className={`spender-card ${farben[s.rang]}`}>
            <div className="spender-header">{s.rang}</div>
            <div className="spender-body">
              <span className="spender-name">{s.name}</span>
              <span className="spender-betrag">{s.betrag} {s.währung}</span>
            </div>
          </div>
        ))}
      </div>

      <h2>Unsere Sponsoren</h2>
      <div className="spender-grid">
        {sponsoren.map((s, index) => (
          <div key={index} className={`spender-card ${farben[s.rang]}`}>
            <div className="spender-header">{s.rang}</div>
            <div className="spender-body">
              <span className="spender-name">{s.name}</span>
              <span className="spender-betrag">{s.betrag} {s.währung}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ÜberUns;