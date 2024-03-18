import React from 'react';
import './Dankesnachricht.scss'; // Importiere das SCSS-Styling

const Dankesnachricht = () => {
  return (
    <div className="dankesnachricht-container">
      <h2>Vielen Dank für Ihre Kontaktaufnahme!</h2>
      <p>
        Wir möchten uns herzlich bei Ihnen dafür bedanken, dass Sie uns kontaktiert haben. Ihre Anfrage ist uns sehr wichtig und wir werden uns bemühen, Ihnen so schnell wie möglich zu antworten.
      </p>
      <p>
        Ein Mitarbeiter wird sich innerhalb der nächsten 48 Stunden mit Ihnen in Verbindung setzen, um Ihre Anfrage zu besprechen und Ihnen bei allem, was Sie benötigen, behilflich zu sein.
      </p>
      <p>
        In der Zwischenzeit stehen wir Ihnen gerne zur Verfügung, wenn Sie weitere Fragen haben. Sie können uns per E-Mail unter kontakt@unternehmen.com oder telefonisch unter +49 123 456789 erreichen.
      </p>
      <p>
        Nochmals vielen Dank für Ihr Interesse an unserem Unternehmen. Wir freuen uns darauf, von Ihnen zu hören!
      </p>
    </div>
  );
};

export default Dankesnachricht;
