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

      <h2>Unsere Philosophie</h2>
      <p>
        Wir glauben an Innovation, Nachhaltigkeit und die Kraft der Technologie. Unser Ziel ist es, Lösungen zu schaffen, die nicht nur technisch fortschrittlich sind, sondern auch einen positiven Einfluss auf die Gesellschaft und die Umwelt haben.
      </p>

      <h2>Unsere Mission</h2>
      <p>
        Unsere Mission ist es, kleinen und mittelständischen Unternehmen sowie Privatpersonen durch maßgeschneiderte Softwarelösungen und IT-Services zu helfen, ihre Ziele effizienter zu erreichen. Wir streben danach, technologische Barrieren abzubauen und eine benutzerfreundliche, zugängliche Lösung für alle anzubieten.
      </p>

      <h2>Warum TBS Solutions?</h2>
      <p>
        TBS Solutions steht für mehr als nur Technologie. Es geht uns darum, mit unseren Kunden auf Augenhöhe zu kommunizieren und maßgeschneiderte Lösungen zu entwickeln, die wirklich ihren Bedürfnissen entsprechen. Wir verstehen uns als Partner – nicht nur als Dienstleister.
      </p>

      <h2>Unsere Werte im Detail</h2>
      <p>
        - **Innovation:** Wir entwickeln Lösungen, die den technologischen Fortschritt fördern.  
        - **Zuverlässigkeit:** Auf uns kann man sich verlassen, sowohl in der Qualität unserer Produkte als auch in der Kommunikation mit unseren Kunden.  
        - **Engagement:** Wir setzen uns voll und ganz für die Bedürfnisse unserer Kunden ein, um ihre Visionen zu verwirklichen.
      </p>

      <h2>Partnerschaften und Kooperationen</h2>
      <p>
        Wir sind stolz darauf, mit verschiedenen Unternehmen zusammenzuarbeiten, die unsere Werte teilen. Unsere Partnerschaften ermöglichen es uns, ein noch besseres Serviceangebot bereitzustellen und die bestmöglichen Lösungen für unsere Kunden zu entwickeln.
      </p>

      <h2>Ein Blick in die Zukunft</h2>
      <p>
        TBS Solutions befindet sich noch am Anfang einer aufregenden Reise. In der Zukunft planen wir, unser Portfolio zu erweitern, innovative Produkte zu entwickeln und ein starkes Netzwerk von Partnern und Kunden aufzubauen, das unsere Werte teilt.
      </p>

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

      <h2>Feedback unserer Kunden</h2>
      <p>
        "TBS Solutions hat uns mit einer maßgeschneiderten Softwarelösung unterstützt, die unsere Prozesse erheblich vereinfacht hat. Die Zusammenarbeit war professionell und transparent." - <em>Kundenzitat</em>
      </p>
      <p>
        "Die Unterstützung von TBS Solutions war unersetzlich. Die individuelle Beratung und die schnelle Reaktionszeit haben uns beeindruckt." - <em>Kundenzitat</em>
      </p>

      <h2>Werde ein Partner!</h2>
      <p>
        Wir suchen auch Influencer, Streamer oder andere Content-Creator, die unsere Vision teilen und uns bei der Verbreitung unserer Nachricht unterstützen möchten!  
        Wenn du Interesse hast, uns zu unterstützen und Werbung zu machen, melde dich bitte per E-Mail an <strong>info@tbsolutions.ch</strong>.
      </p>
    </div>
  );
};

export default ÜberUns;