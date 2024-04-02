import React, { useState } from 'react';

const GutscheinBestellung = () => {
  const [guthabenOptionen] = useState([
    { id: 1, betrag: 10, text: '10 €' },
    { id: 2, betrag: 25, text: '25 €' },
    { id: 3, betrag: 50, text: '50 €' },
    { id: 4, betrag: 100, text: '100 €' }
  ]);
  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [gueltigBis, setGueltigBis] = useState('');

  const handleBestellung = (selectedGuthaben) => {
    if (name && senderName && gueltigBis && selectedGuthaben) {
      const gutschein = {
        id: selectedGuthaben.id,
        titel: `Gutschein ${selectedGuthaben.betrag} €`,
        preis: selectedGuthaben.betrag
      };
  
      // Gutschein im Local Storage speichern
      localStorage.setItem('gutschein', JSON.stringify(gutschein));
  
      // Optional: Feedback an den Benutzer geben, dass der Gutschein erfolgreich hinzugefügt wurde
      alert('Der Gutschein wurde erfolgreich zum Warenkorb hinzugefügt.');
    } else {
      alert('Bitte füllen Sie alle Felder aus und wählen Sie ein Guthaben aus, bevor Sie bestellen.');
    }
  };
  
  return (
    <div className="gutschein-bestellung">
      <h2>Gutschein bestellen</h2>
      <label htmlFor="name">Ihr Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="senderName">Absender des Gutscheins:</label>
      <input
        type="text"
        id="senderName"
        value={senderName}
        onChange={(e) => setSenderName(e.target.value)}
      />
      <label htmlFor="gueltigBis">Gültig bis:</label>
      <input
        type="date"
        id="gueltigBis"
        value={gueltigBis}
        onChange={(e) => setGueltigBis(e.target.value)}
      />
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
    </div>
  );
};

export default GutscheinBestellung;
