import React from "react";
import "./UeberUns.scss";

const UeberUns = () => {
  return (
    <div className="ueber-uns">
      <h1>Wer wir sind</h1>
      <p>
        <strong>TBS Solutions</strong> ist ein Startup, das verschiedene Dienstleistungen anbietet. Unser Ziel ist es, Unternehmen und Privatpersonen in technischen und digitalen Bereichen zu unterstützen.
      </p>

      <h2>Wie alles begann</h2>
      <p>
        Im Februar 2023 wurde ich von einer Kollegin gefragt, ob ich eine Diashow erstellen kann. Das brachte mich auf die Idee, mehrere Dienstleistungen anzubieten. Ich begann, die Website zu entwickeln – alles im Selbststudium. Heute ist daraus ein komplettes System entstanden, inklusive eines Kassensystems.
      </p>
      <p>
        Ich arbeite derzeit allein und habe keine vollständige Ausbildung. Alles, was hier steht, wurde von mir selbst aufgebaut – von der ersten Idee bis zum aktuellen System.
      </p>

      <h2>Unsere Philosophie</h2>
      <p>
        Wir glauben an Innovation, Nachhaltigkeit und die Kraft der Technologie. Unser Ziel ist es, Lösungen zu schaffen, die nicht nur technisch fortschrittlich sind, sondern auch einen positiven Einfluss auf die Gesellschaft und die Umwelt haben.
      </p>

      <h2>Unsere Mission</h2>
      <p>
        Unsere Mission ist es, kleinen und mittelständischen Unternehmen sowie Privatpersonen durch maßgeschneiderte Softwarelösungen und IT-Services zu helfen, ihre Ziele effizienter zu erreichen.
      </p>

      <h2>Warum TBS Solutions?</h2>
      <p>
        TBS Solutions steht für mehr als nur Technologie. Es geht uns darum, mit unseren Kunden auf Augenhöhe zu kommunizieren und Lösungen zu entwickeln, die ihren Bedürfnissen entsprechen.
      </p>

      <h2>Unsere Werte im Detail</h2>
      <ul>
        <li><strong>Innovation:</strong> Wir entwickeln Lösungen, die den Fortschritt fördern.</li>
        <li><strong>Zuverlässigkeit:</strong> Auf uns kann man sich verlassen – in Technik und Kommunikation.</li>
        <li><strong>Engagement:</strong> Wir setzen uns voll und ganz für die Visionen unserer Kunden ein.</li>
      </ul>

      <h2>Partnerschaften und Kooperationen</h2>
      <p>
        Wir arbeiten mit Unternehmen zusammen, die unsere Werte teilen. Diese Partnerschaften ermöglichen ein besseres Serviceangebot und innovative Lösungen.
      </p>

      <h2>Ein Blick in die Zukunft</h2>
      <p>
        TBS Solutions steht erst am Anfang. Wir planen, unser Portfolio zu erweitern, innovative Produkte zu entwickeln und ein starkes Netzwerk aufzubauen.
      </p>

      <h2>Feedback unserer Kunden</h2>
      <div className="feedback-section">
        <div className="feedback-card">
          <p>
            "TBS Solutions hat uns mit einer maßgeschneiderten Softwarelösung unterstützt, die unsere Prozesse erheblich vereinfacht hat."
            <em>– Kundenzitat</em>
          </p>
        </div>
        <div className="feedback-card">
          <p>
            "Die individuelle Beratung und schnelle Reaktionszeit haben uns beeindruckt."
            <em>– Kundenzitat</em>
          </p>
        </div>
      </div>

      <h2>Werde ein Partner!</h2>
      <div className="partner-section">
        <p>
          Wir suchen Influencer, Streamer oder Content-Creator, die unsere Vision teilen!  
          Interesse? Schreib uns an <strong>info@tbsolutions.ch</strong>
        </p>
      </div>
    </div>
  );
};

export default UeberUns;
