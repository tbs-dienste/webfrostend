import React, { useState } from 'react';
import Keyboard from '../Kasse/Keyboard'; // Importiere hier deine Tastatur-Komponente!
import './KundenSuche.scss'; // Optional für dein Styling

const KundenSuche = () => {
  const [activeField, setActiveField] = useState(null); // Speichert das aktuell aktive Eingabefeld
  const [formData, setFormData] = useState({
    kundennr: '',
    name: '',
    plz: '',
    ort: '',
    strasse: '',
    telnr: '',
  });

  const handleKeyPress = (key) => {
    if (!activeField) return;

    let value = formData[activeField];

    if (key === 'DELETE') {
      value = value.slice(0, -1); // Löscht das letzte Zeichen
    } else if (key === 'SPACE') {
      value += ' '; // Fügt ein Leerzeichen hinzu
    } else if (key === 'ENTER') {
      // Optional: Handle Enter
    } else if (key === 'TAB') {
      // Optional: Wechsel zum nächsten Feld
    } else {
      value += key; // Fügt den gedrückten Key hinzu
    }

    setFormData({
      ...formData,
      [activeField]: value,
    });
  };

  return (
    <div className="kundensuche-container">
      <div className="kundensuche-form">
        <h2>Kundensuche</h2>

        <div
          className={`input-field ${activeField === 'kundennr' ? 'active' : ''}`}
          onClick={() => setActiveField('kundennr')} // Aktiviert das Eingabefeld
        >
          <label>KUNDENNR</label>
          <input
            type="text"
            name="kundennr"
            value={formData.kundennr}
            onChange={(e) => setFormData({ ...formData, kundennr: e.target.value })}
            readOnly
          />
        </div>

        <div
          className={`input-field ${activeField === 'name' ? 'active' : ''}`}
          onClick={() => setActiveField('name')}
        >
          <label>NAME</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            readOnly
          />
        </div>

        <div
          className={`input-field ${activeField === 'plz' ? 'active' : ''}`}
          onClick={() => setActiveField('plz')}
        >
          <label>PLZ</label>
          <input
            type="text"
            name="plz"
            value={formData.plz}
            onChange={(e) => setFormData({ ...formData, plz: e.target.value })}
            readOnly
          />
        </div>

        <div
          className={`input-field ${activeField === 'ort' ? 'active' : ''}`}
          onClick={() => setActiveField('ort')}
        >
          <label>ORT</label>
          <input
            type="text"
            name="ort"
            value={formData.ort}
            onChange={(e) => setFormData({ ...formData, ort: e.target.value })}
            readOnly
          />
        </div>

        <div
          className={`input-field ${activeField === 'strasse' ? 'active' : ''}`}
          onClick={() => setActiveField('strasse')}
        >
          <label>STRASSE</label>
          <input
            type="text"
            name="strasse"
            value={formData.strasse}
            onChange={(e) => setFormData({ ...formData, strasse: e.target.value })}
            readOnly
          />
        </div>

        <div
          className={`input-field ${activeField === 'telnr' ? 'active' : ''}`}
          onClick={() => setActiveField('telnr')}
        >
          <label>TELNR</label>
          <input
            type="text"
            name="telnr"
            value={formData.telnr}
            onChange={(e) => setFormData({ ...formData, telnr: e.target.value })}
            readOnly
          />
        </div>

        <button
          className="suche-button"
          onClick={() => console.log('Suchen mit:', formData)}
        >
          Suchen
        </button>
      </div>

      <Keyboard onKeyPress={handleKeyPress} /> {/* Tastatur-Komponente */}
    </div>
  );
};

export default KundenSuche;
