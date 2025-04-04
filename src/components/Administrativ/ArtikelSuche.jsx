import React, { useState, useEffect } from 'react';
import Keyboard from '../Kasse/Keyboard'; // Importiere hier deine Tastatur-Komponente!
import './KundenSuche.scss'; // Optional für dein Styling
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate
import axios from 'axios';

const ArtikelSuche = ({ onKassenModusChange }) => {
  const [activeField, setActiveField] = useState('artikelnr'); // Standardmäßig ist 'artikelnr' aktiv
  const [formData, setFormData] = useState({
    artikelnr: '',
    artikelbezeichnung: '',
    hauptaktivitaet: '',
    von: '',
    bis: '',
    agnr: '',
    artikelgruppe: '',
    hgnr: '',
    hauptartikelgruppe: '',
    wgnr: '',
    warengruppe: '',
  });
  const [searchResults, setSearchResults] = useState([]); // Hier werden die Suchergebnisse gespeichert
  const [selectedRow, setSelectedRow] = useState(null); // Zustand für die markierte Zeile
  const navigate = useNavigate(); // Um zu Kasse zu navigieren

  // Kassenmodus aktivieren
  useEffect(() => {
    onKassenModusChange(true);
    return () => {
      onKassenModusChange(false); // Kassenmodus zurücksetzen
    };
  }, [onKassenModusChange]);

  // Fokus auf das 'artikelnr' Feld setzen, wenn die Komponente geladen wird
  useEffect(() => {
    const artikelnrInput = document.getElementById('artikelnr');
    if (artikelnrInput) {
      artikelnrInput.focus();
    }
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

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/products', {
        headers: { Authorization: `Bearer ${token}` },
        params: { artikelnr: formData.artikelnr, artikelbezeichnung: formData.artikelbezeichnung, ...formData }
      });

      console.log("API Antwort:", response.data); // Debugging

      if (response.data.status === 'success') {
        const allResults = response.data.artikel;

        console.log("Gefundene Artikel:", allResults); // Debugging

        setSearchResults(allResults); // Ergebnisse setzen
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Artikel:', error);
    }
  };

  // Funktion zum Markieren der Zeile
  const handleRowClick = (index) => {
    setSelectedRow(index); // Setzt die markierte Zeile
  };

  return (
    <div className="kundensuche-container">
      <div className="kundensuche-form">
        {['artikelnr', 'artikelbezeichnung', 'hauptaktivitaet', 'von', 'bis', 'agnr', 'artikelgruppe', 'hgnr', 'hauptartikelgruppe', 'wgnr', 'warengruppe'].map((field) => (
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
              autoFocus={field === 'artikelnr'} // Setzt den Fokus auf das 'artikelnr' Feld
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
        <button onClick={() => setFormData({ artikelnr: '', artikelbezeichnung: '', hauptaktivitaet: '', von: '', bis: '', agnr: '', artikelgruppe: '', hgnr: '', hauptartikelgruppe: '', wgnr: '', warengruppe: '' })}>
          Filter löschen
        </button>
        <button disabled>Detail</button>
        <button
          className="suche-button"
          onClick={handleSearch} // Trigger the search
        >
          Suchen
        </button>
        <button onClick={goToKasse}>Exit</button>
      </div>

      {/* Ergebnistabelle */}
      <div className="result-table">
        <h3>Suchergebnisse</h3>
        <table>
          <thead>
            <tr>
              <th>Artikel-Nr.</th>
              <th>Bezeichnung</th>
              <th>Hauptaktivität</th>
              <th>Gültig von</th>
              <th>Gültig bis</th>
              <th>Preis</th>
              <th>AGNR</th>
              <th>Artikelgruppe</th>
              <th>HGNR</th>
              <th>Hauptartikelgruppe</th>
              <th>WGN</th>
              <th>Warengruppe</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <tr
                  key={index}
                  className={selectedRow === index ? 'selected' : ''} // Zeile hervorheben, wenn sie ausgewählt ist
                  onClick={() => handleRowClick(index)} // Markiert die Zeile beim Klicken
                >
                  <td>{result.artikelnr}</td>
                  <td>{result.artikelbezeichnung}</td>
                  <td>{result.hauptaktivitaet}</td>
                  <td>{result.von}</td>
                  <td>{result.bis}</td>
                  <td>{result.preis}</td>
                  <td>{result.agnr}</td>
                  <td>{result.artikelgruppe}</td>
                  <td>{result.hgnr}</td>
                  <td>{result.hauptartikelgruppe}</td>
                  <td>{result.wgnr}</td>
                  <td>{result.warengruppe}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">Keine Ergebnisse gefunden</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Keyboard onKeyPress={handleKeyPress} /> {/* Tastatur-Komponente */}
    </div>
  );
};

export default ArtikelSuche;
