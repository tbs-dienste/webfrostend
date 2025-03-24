import React, { useState, useEffect } from 'react';
import Keyboard from '../Kasse/Keyboard'; // Importiere hier deine Tastatur-Komponente!
import './KundenSuche.scss'; // Optional für dein Styling
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

const KundenSuche = ({ onKassenModusChange }) => {
  const [activeField, setActiveField] = useState('name'); // Standardmäßig ist 'name' aktiv
  const [formData, setFormData] = useState({
    kundennr: '',
    name: '',
    plz: '',
    ort: '',
    strasse: '',
    telnr: '',
  });
  const [searchResults, setSearchResults] = useState([]); // Hier werden die Suchergebnisse gespeichert
  const navigate = useNavigate(); // Um zu Kasse zu navigieren

  // Kassenmodus aktivieren
  useEffect(() => {
    onKassenModusChange(true);
    return () => {
      onKassenModusChange(false); // Kassenmodus zurücksetzen
    };
  }, [onKassenModusChange]);

  // Fokus auf das 'name' Feld setzen, wenn die Komponente geladen wird
  useEffect(() => {
    document.getElementById('name').focus();
  }, []);

  // Handhabung der Tastenanschläge
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

  const goToKasse = () => {
    navigate('/kasse');
  };

  const handleSearch = () => {
    // Beispielhafte Daten für die Suche
    const allResults = [
      { kundennr: '1234', name: 'Max Mustermann', plz: '12345', ort: 'Musterstadt', strasse: 'Musterstraße 1', telnr: '0123456789' },
      { kundennr: '5678', name: 'Erika Mustermann', plz: '67890', ort: 'Beispielstadt', strasse: 'Beispielstraße 2', telnr: '0987654321' },
    ];

    // Filtert basierend auf Name und PLZ
    const filteredResults = allResults.filter((result) => {
      const nameMatches = result.name.toLowerCase().includes(formData.name.toLowerCase());
      const plzMatches = result.plz.includes(formData.plz);
      return (nameMatches && plzMatches); // Beide Kriterien müssen zutreffen
    });

    setSearchResults(filteredResults); // Zeigt die gefilterten Ergebnisse an
  };

  return (
    <div className="kundensuche-container">
      <div className="kundensuche-form">
        {['kundennr', 'name', 'plz', 'ort', 'strasse', 'telnr'].map((field) => (
          <div
            key={field}
            className={`input-field ${activeField === field ? 'active' : ''}`}
            onClick={() => setActiveField(field)} // Aktiviert das Eingabefeld
          >
            <label>{field.toUpperCase()}</label>
            <input
              id={field} // Setzt das ID-Attribut für jedes Eingabefeld
              type="text"
              name={field}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              readOnly={true} // Alle Felder sind readonly
              autoFocus={field === 'name'} // Setzt den Fokus auf das 'name' Feld
            />
          </div>
        ))}
      </div>

      <div className="bottom-buttons">
        <button disabled>X</button>
        <button disabled>X</button>
        <button disabled>X</button>
        <button disabled>X</button>
        <button disabled>X</button>
        <button onClick={() => setFormData({ kundennr: '', name: '', plz: '', ort: '', strasse: '', telnr: '' })}>
          Filter löschen
        </button>
        <button disabled>Detail</button>
        <button
          className="suche-button"
          onClick={handleSearch} // Trigger the search
        >
          Suchen
        </button>
        <button>Übernehmen</button>
        <button onClick={goToKasse}>Exit</button>
      </div>

      {/* Ergebnistabelle */}
      <div className="result-table">
        <h3>Suchergebnisse</h3>
        <table>
          <thead>
            <tr>
              <th>Kundennr</th>
              <th>Name</th>
              <th>PLZ</th>
              <th>Ort</th>
              <th>Straße</th>
              <th>Telefonnummer</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.kundennr}</td>
                  <td>{result.name}</td>
                  <td>{result.plz}</td>
                  <td>{result.ort}</td>
                  <td>{result.strasse}</td>
                  <td>{result.telnr}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Keine Ergebnisse gefunden</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Keyboard onKeyPress={handleKeyPress} /> {/* Tastatur-Komponente */}
    </div>
  );
};

export default KundenSuche;
