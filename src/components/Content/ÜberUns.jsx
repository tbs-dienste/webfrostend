import React from "react";
import "./ÜberUns.scss";

const ÜberUns = () => {
  const spender = [
    { name: "Johannes Meier", betrag: 1200, rang: "Platin", währung: "CHF" },
    { name: "Sophia Keller", betrag: 800, rang: "Platin", währung: "CHF" },
    { name: "Markus Schmid", betrag: 600, rang: "Gold", währung: "CHF" },
    { name: "Clara Huber", betrag: 300, rang: "Gold", währung: "CHF" },
    { name: "Daniel Weber", betrag: 150, rang: "Silber", währung: "CHF" },
    { name: "Lena Fischer", betrag: 75, rang: "Bronze", währung: "CHF" },
  ];

  const sponsoren = [
    { name: "Swisscom AG", betrag: 5000, rang: "Platin", währung: "CHF" },
    { name: "Digitec Galaxus AG", betrag: 3500, rang: "Gold", währung: "CHF" },
    { name: "PostFinance", betrag: 2000, rang: "Silber", währung: "CHF" },
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
        <strong>TBS Solutions</strong> ist ein Startup, das verschiedene Dienstleistungen anbietet.  
        Unser Ziel ist es, Unternehmen und Privatpersonen in technischen und digitalen Bereichen zu unterstützen.
      </p>

      <h2>Wie alles begann</h2>
      <p>
        Im Februar 2023 wurde ich von einer Kollegin gefragt, ob ich eine Diashow erstellen kann.  
        Das brachte mich auf die Idee, mehrere Dienstleistungen anzubieten.  
        Ich begann, die Website zu entwickeln – alles im Selbststudium.  
        Heute ist daraus ein komplettes System entstanden, inklusive eines Kassensystems.
      </p>
      <p>
        Ich arbeite derzeit allein und habe keine vollständige Ausbildung. Alles, was hier steht,  
        wurde von mir selbst aufgebaut – von der ersten Idee bis zum aktuellen System.
      </p>

      <h2>Unterstütze uns!</h2>
      <p>
        Als junges Startup freuen wir uns über jede Unterstützung. Falls du unsere Mission gut findest,  
        kannst du uns mit einer Spende helfen.
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