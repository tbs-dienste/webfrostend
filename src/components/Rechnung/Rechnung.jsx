// Rechnung.jsx

import React, { useState, useEffect } from 'react';
import './Rechnung.scss';

const Rechnung = () => {
  const [kunden, setKunden] = useState([]);
  const [selectedKunde, setSelectedKunde] = useState('');
  const [betrag, setBetrag] = useState('');
  const [datum, setDatum] = useState('');
  const [positionen, setPositionen] = useState([]);
  const [positionName, setPositionName] = useState('');
  const [positionBetrag, setPositionBetrag] = useState('');

  useEffect(() => {
    const storedKunden = localStorage.getItem('kunden');
    if (storedKunden) {
      setKunden(JSON.parse(storedKunden));
    }
  }, []);

  const handlePositionHinzufügen = () => {
    setPositionen([...positionen, { name: positionName, betrag: positionBetrag }]);
    setPositionName('');
    setPositionBetrag('');
  };

  const handleRechnungErstellen = () => {
    console.log("Rechnung erstellen für Kunde:", selectedKunde);
    console.log("Betrag:", betrag);
    console.log("Datum:", datum);
    console.log("Positionen:", positionen);

    setSelectedKunde('');
    setBetrag('');
    setDatum('');
    setPositionen([]);
    setPositionName('');
    setPositionBetrag('');
  };

  return (
    <div className="rechnung">
      <h2>Rechnung erstellen</h2>
      <div className="formular">
        <div className="formular-gruppe">
          <label htmlFor="kunde">Kunde:</label>
          <select
            id="kunde"
            value={selectedKunde}
            onChange={(e) => setSelectedKunde(e.target.value)}
          >
            <option value="">Bitte wählen</option>
            {kunden.map((kunde, index) => (
              <option key={index} value={kunde.vorname + ' ' + kunde.nachname}>
                {kunde.vorname} {kunde.nachname}
              </option>
            ))}
          </select>
        </div>
        {/* Weitere Formularelemente hier */}
        <button onClick={handlePositionHinzufügen}>Position hinzufügen</button>
        <button onClick={handleRechnungErstellen}>Rechnung erstellen</button>
      </div>
    </div>
  );
};

export default Rechnung;
