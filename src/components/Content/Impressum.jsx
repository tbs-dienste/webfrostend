import React from 'react';
import './Impressum.scss';

const Impressum = () => {
  return (
    <div className="impressum-container">
      <h1 className="impressum-title">Impressum</h1>
      <div className="impressum-content">
        <div className="impressum-section">
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            Timo Blumer <br />
            3001 Bern <br />
            
            
          </p>
        </div>
        <div className="impressum-section">
          <h2>Kontakt</h2>
          <p>
            Telefon: +41 79 809 00 55 <br />
            E-Mail: timo.blumer@gmx.ch
          </p>
        </div>
        <div className="impressum-section">
          <h2>Verantwortlich für den Inhalt</h2>
          <p>
            Timo Blumer <br />
            3001 Bern <br />
          </p>
        </div>
        <div className="impressum-section">
          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </div>
        <div className="impressum-section">
          <h2>EU-Cookie-Richtlinien</h2>
          <p>
            Diese Webseite verwendet Cookies, um die Benutzererfahrung zu verbessern. Gemäß der EU-Richtlinie 2009/136/EG sind wir verpflichtet,
            die Zustimmung der Besucher zur Speicherung von Cookies auf ihrem Endgerät einzuholen. Durch die Nutzung dieser Webseite stimmen Sie der
            Verwendung von Cookies zu. Sie können jederzeit Ihre Cookie-Einstellungen in Ihrem Browser ändern, um zu steuern, wie Cookies verwendet werden.
          </p>
        </div>
        <div className="impressum-section">
          <h2>Webseiten-Erstellung</h2>
          <p>
            Diese Webseite wurde von <strong>TBS Solutions</strong> erstellt.
          </p>
        </div>
        <div className="impressum-section">
          <h2>Copyright</h2>
          <p>
            © 2024 TBS Solutions. Alle Rechte vorbehalten. Die Inhalte dieser Webseite, einschließlich Texte, Bilder, Grafiken und Designelemente,
            unterliegen dem Urheberrecht. Jede Art der Vervielfältigung, Bearbeitung, Verbreitung und Verwertung bedarf der schriftlichen Zustimmung
            des jeweiligen Autors oder Erstellers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
