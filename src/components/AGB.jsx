import React from 'react';
import './AGB.scss'; // Importiere die SCSS-Datei

const AGB = () => {
  return (
    <div className="agb-container">
      <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

      <h2>1. Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Dienstleistungen, die von TBS Solutions (im Folgenden „Anbieter“ genannt) erbracht werden. Mit der Kontaktaufnahme oder der Beauftragung eines Dienstes erklärt sich der Kunde mit diesen AGB einverstanden. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt diesen ausdrücklich schriftlich zu.
      </p>

      <h2>2. Vertragsabschluss</h2>
      <p>
        Der Vertrag zwischen dem Anbieter und dem Kunden kommt durch die Annahme des Angebots des Anbieters zustande. Angebote sind freibleibend und unverbindlich. Der Anbieter behält sich das Recht vor, Angebote ohne Angabe von Gründen abzulehnen. Eine Auftragsbestätigung durch den Anbieter erfolgt in schriftlicher Form per E-Mail.
      </p>

      <h2>3. Rücktrittsrecht</h2>
      <p>
        Der Kunde hat das Recht, innerhalb von 14 Tagen nach Kontaktaufnahme ohne Angabe von Gründen vom Vertrag zurückzutreten. Der Rücktritt muss schriftlich (z.B. per E-Mail) erklärt werden. Erfolgt kein Rücktritt innerhalb dieser Frist, verpflichtet sich der Kunde, die vereinbarten Arbeitszeiten zu bezahlen, unabhängig davon, ob die Dienstleistung bereits erbracht wurde.
      </p>

      <h2>4. Zahlungen</h2>
      <p>
        Die Bezahlung der Dienstleistungen erfolgt gemäß der im Angebot festgelegten Preise. Alle Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer. Zahlungen sind sofort nach Erhalt der Rechnung fällig. Der Anbieter behält sich das Recht vor, eine Vorauszahlung zu verlangen. Bei Zahlungsverzug behält sich der Anbieter das Recht vor, Verzugszinsen in Höhe von 5% über dem jeweiligen Basiszinssatz zu verlangen.
      </p>

      <h2>5. Leistungen</h2>
      <p>
        Der Anbieter erbringt die in den jeweiligen Angeboten beschriebenen Dienstleistungen. Der Anbieter bemüht sich, die Dienstleistungen nach besten Kräften zu erbringen, kann jedoch keine Garantie für den Erfolg der Dienstleistungen geben. Der Anbieter ist berechtigt, Subunternehmer mit der Erbringung von Dienstleistungen zu beauftragen.
      </p>

      <h2>6. Haftung</h2>
      <p>
        Der Anbieter haftet nur für Schäden, die vorsätzlich oder grob fahrlässig verursacht wurden. Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). In diesem Fall ist die Haftung des Anbieters auf den typischerweise vorhersehbaren Schaden begrenzt. Die Haftung für Schäden, die durch höhere Gewalt oder unvorhersehbare Ereignisse entstehen, ist ausgeschlossen.
      </p>

      <h2>7. Urheberrecht</h2>
      <p>
        Alle im Rahmen der Dienstleistungen erstellten Arbeiten, Designs und Materialien bleiben bis zur vollständigen Bezahlung im Eigentum des Anbieters. Der Kunde erhält lediglich ein einfaches, nicht übertragbares Nutzungsrecht an den erstellten Arbeiten, das auf den vertraglich festgelegten Zweck beschränkt ist. Eine Weitergabe an Dritte ist ohne ausdrückliche Zustimmung des Anbieters nicht gestattet.
      </p>

      <h2>8. Datenschutz</h2>
      <p>
        Der Anbieter verpflichtet sich, die personenbezogenen Daten des Kunden gemäß den geltenden Datenschutzgesetzen zu schützen. Die Daten werden ausschließlich zur Durchführung des Vertragsverhältnisses und zur Kommunikation mit dem Kunden verwendet. Weitere Informationen sind in der Datenschutzerklärung zu finden.
      </p>

      <h2>9. Vertraulichkeit</h2>
      <p>
        Beide Parteien verpflichten sich, alle im Rahmen der Zusammenarbeit erlangten Informationen, die als vertraulich gekennzeichnet sind oder aufgrund ihrer Natur als vertraulich angesehen werden können, geheim zu halten. Diese Verpflichtung bleibt auch nach Beendigung des Vertragsverhältnisses bestehen.
      </p>

      <h2>10. Schlussbestimmungen</h2>
      <p>
        Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch für die Änderung dieser Klausel. Sollte eine Bestimmung dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
      </p>
      <p>
        Es gilt das Recht der Schweiz. Gerichtsstand ist der Sitz des Anbieters, sofern der Kunde Kaufmann ist oder keinen allgemeinen Gerichtsstand in der Schweiz hat.
      </p>

      <p className="bold">
        Stand: Oktober 2024
      </p>
      
      <div className="footer">
        <p>&copy; 2024 TBS Solutions. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  );
};

export default AGB;
