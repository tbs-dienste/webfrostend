import React, { useState } from 'react';
import './GutscheinBestellung.scss';
import axios from 'axios';

const GutscheinBestellung = () => {
  const [guthabenOptionen] = useState([
    { id: 1, betrag: 10, text: '10 CHF' },
    { id: 2, betrag: 25, text: '25 CHF' },
    { id: 3, betrag: 50, text: '50 CHF' },
    { id: 4, betrag: 100, text: '100 CHF' }
  ]);
  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [benutzerdefinierterBetrag, setBenutzerdefinierterBetrag] = useState('');
  const [ausgewahltesGuthaben, setAusgewahltesGuthaben] = useState(null);

  const addOneYear = (dateString) => {
    const currentDate = new Date(dateString);
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    return currentDate.toISOString().split('T')[0];
  };

  const generateGutscheincode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 8;
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleBestellung = async () => {
    if (name && senderName && (ausgewahltesGuthaben || benutzerdefinierterBetrag >= 20)) {
      const gueltigBisDate = addOneYear(new Date().toISOString().split('T')[0]);
      const gutscheincode = generateGutscheincode();
      const betrag = ausgewahltesGuthaben ? ausgewahltesGuthaben.betrag : benutzerdefinierterBetrag;
      const titel = `Gutschein ${betrag} CHF`;
      const gutschein = {
        titel,
        preis: betrag,
        betrag,
        gueltigBis: gueltigBisDate,
        gutscheincode,
        empfaenger: name,
        absender: senderName
      };

      try {
        await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine', gutschein);
        alert(`Der Gutschein ${gutschein.titel} wurde erfolgreich erstellt. Ihr Gutscheincode lautet: ${gutschein.gutscheincode}`);
      } catch (error) {
        console.error(error);
        alert('Es gab ein Problem beim Erstellen des Gutscheins. Bitte versuchen Sie es später erneut.');
      }
    } else {
      alert('Bitte füllen Sie alle Felder aus und wählen Sie ein Guthaben aus oder geben Sie einen benutzerdefinierten Betrag ein (mindestens 20 CHF), bevor Sie bestellen.');
    }
  };

  return (
    <div className="gutschein-bestellung">
      <h2>Gutschein bestellen</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="name">Ihr Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="senderName">Absender des Gutscheins:</label>
          <input
            type="text"
            id="senderName"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
        </div>
        <p>Wählen Sie das gewünschte Guthaben aus oder geben Sie einen benutzerdefinierten Betrag ein:</p>
        <div className="guthaben-options">
          {guthabenOptionen.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setAusgewahltesGuthaben(option)}
            >
              {option.text}
            </button>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="customAmount">Benutzerdefinierter Betrag (mindestens 20 CHF):</label>
          <input
            type="number"
            id="customAmount"
            value={benutzerdefinierterBetrag}
            onChange={(e) => setBenutzerdefinierterBetrag(parseFloat(e.target.value))}
            min="20"
          />
        </div>
        <button type="button" onClick={handleBestellung}>
          Gutschein bestellen
        </button>
      </form>
    </div>
  );
};

export default GutscheinBestellung;
