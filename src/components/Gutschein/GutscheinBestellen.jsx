import React, { useState } from 'react';
import './GutscheinBestellung.scss'; // Importieren Sie das SCSS-Styling

const GutscheinBestellung = () => {
  const [guthabenOptionen] = useState([
    { id: 1, betrag: 10, text: '10 €' },
    { id: 2, betrag: 25, text: '25 €' },
    { id: 3, betrag: 50, text: '50 €' },
    { id: 4, betrag: 100, text: '100 €' }
  ]);
  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');

  const addOneYear = (dateString) => {
    const currentDate = new Date(dateString);
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    return currentDate.toISOString().split('T')[0];
  };

  const generateGutscheincode = () => {
    // Dummy implementation: Generate a random alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 8;
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleBestellung = (selectedGuthaben) => {
    if (name && senderName && selectedGuthaben) {
      const gueltigBisDate = addOneYear(new Date().toISOString().split('T')[0]);
      const gutscheincode = generateGutscheincode();
      const gutschein = {
        id: selectedGuthaben.id,
        titel: `Gutschein ${selectedGuthaben.betrag} €`,
        preis: selectedGuthaben.betrag,
        betrag: selectedGuthaben.betrag, // Speichern Sie den Betrag im Gutscheinobjekt
        gueltigBis: gueltigBisDate, // Gültigkeitsdatum setzen
        gutscheincode: gutscheincode, // Gutscheincode setzen
        empfaenger: name, // Empfängername hinzufügen
        absender: senderName // Absendername hinzufügen
      };

      // Gutscheininformationen im Local Storage speichern
      localStorage.setItem('gutschein', JSON.stringify(gutschein));

      // Optional: Feedback an den Benutzer geben, dass der Gutschein erfolgreich hinzugefügt wurde
      alert(`Der Gutschein ${gutschein.titel} wurde erfolgreich zum Warenkorb hinzugefügt. Ihr Gutscheincode lautet: ${gutschein.gutscheincode}`);
    } else {
      alert('Bitte füllen Sie alle Felder aus und wählen Sie ein Guthaben aus, bevor Sie bestellen.');
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
        <p>Wählen Sie das gewünschte Guthaben aus:</p>
        <div className="guthaben-options">
          {guthabenOptionen.map((option) => (
            <button
              key={option.id}
              onClick={() => handleBestellung(option)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default GutscheinBestellung;
