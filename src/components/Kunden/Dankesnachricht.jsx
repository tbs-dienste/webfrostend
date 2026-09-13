import React from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import "./Dankesnachricht.scss";

const Dankesnachricht = () => {
  return (
    <main className="dankesnachricht">
      {/* Hero / Header */}
      <section className="dankesnachricht-header">
        <div className="header-line"></div>

        <span className="header-label">
          KONTAKTANFRAGE
        </span>

        <h1>
          Vielen Dank für Ihre
          <span> Kontaktaufnahme.</span>
        </h1>

        <p>
          Ihre Anfrage wurde erfolgreich übermittelt.
        </p>
      </section>

      {/* Content */}
      <section className="dankesnachricht-content">
        <div className="success-indicator">
          <div className="success-icon">
            <FaCheck />
          </div>

          <div className="success-text">
            <strong>Anfrage erfolgreich gesendet</strong>
            <span>
              Wir haben Ihre Nachricht erhalten und kümmern uns
              schnellstmöglich um Ihr Anliegen.
            </span>
          </div>
        </div>

        <div className="message-content">
          <p>
            Vielen Dank für Ihr Vertrauen und Ihr Interesse an
            <strong> TBS Solutions</strong>.
          </p>

          <p>
            Ihre Anfrage ist bei uns eingegangen. Wir prüfen Ihre
            Angaben sorgfältig und werden uns in der Regel innerhalb
            von <strong>48 Stunden</strong> bei Ihnen melden.
          </p>

          <p>
            Sollten Sie zwischenzeitlich noch Fragen haben oder
            zusätzliche Informationen benötigen, können Sie uns
            jederzeit per E-Mail kontaktieren.
          </p>
        </div>

        {/* Kontakt */}
        <div className="contact-section">
          <div className="contact-icon">
            <FaEnvelope />
          </div>

          <div className="contact-information">
            <span className="contact-label">
              DIREKTER KONTAKT
            </span>

            <a href="mailto:tbs-solutions@gmx.net">
              tbs-solutions@gmx.net
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="dankesnachricht-footer">
          <Link to="/" className="back-home">
            <FaArrowLeft />
            <span>Zurück zur Startseite</span>
          </Link>

          <span className="footer-note">
            TBS Solutions
          </span>
        </div>
      </section>
    </main>
  );
};

export default Dankesnachricht;
