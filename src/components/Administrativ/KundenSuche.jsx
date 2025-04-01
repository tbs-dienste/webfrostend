import React, { useState, useEffect } from 'react';
import Keyboard from '../Kasse/Keyboard'; // Importiere hier deine Tastatur-Komponente!
import './KundenSuche.scss'; // Optional für dein Styling
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate
import axios from 'axios';

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
  const [selectedRow, setSelectedRow] = useState(null); // Zustand für die markierte Zeile
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
  
  const handleÜbernehmen = async () => {
    if (selectedRow === null) {
      alert("Bitte wählen Sie einen Kunden aus.");
      return;
    }

    const selectedCustomer = searchResults[selectedRow]; // Zugriff auf den ausgewählten Kunden
    const token = localStorage.getItem("token"); // Token aus localStorage abrufen
  
    if (!token) {
      alert("Fehler: Kein Token gefunden. Bitte erneut anmelden.");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/scan",
        { kundenkartennummer: selectedCustomer?.kundenkartennummer }, // optional chaining für sichereren Zugriff
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Kundenkarte erfolgreich übernommen und gescannt:", response.data);
  
      // Kassenmodus aktualisieren und zur Kasse weiterleiten
      onKassenModusChange({
        kundenkartennummer: selectedCustomer?.kundenkartennummer,
        vorname: selectedCustomer?.vorname,
        nachname: selectedCustomer?.nachname,
        plz: selectedCustomer?.plz,
        ort: selectedCustomer?.ort,
      });
  
      navigate('/kasse');
  
    } catch (error) {
      console.error("Fehler beim Übernehmen der Kundenkarte:", error);
      alert("Fehler beim Übernehmen der Kundenkarte.");
    }
  };
  
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("API Antwort:", response.data); // Debugging

      if (response.data.status === 'success') {
        const allResults = response.data.kundenkarten;

        console.log("Gefundene Kundenkarten:", allResults); // Debugging

        // Filter nach Name und PLZ
        const filteredResults = allResults.filter((result) => {
          const fullName = `${result.vorname} ${result.nachname}`.toLowerCase();
          const nameMatches = fullName.includes(formData.name.toLowerCase());
          const plzMatches = result.plz.includes(formData.plz);

          console.log(`Vergleiche: '${fullName}' mit '${formData.name.toLowerCase()}' und '${result.plz}' mit '${formData.plz}'`);

          return nameMatches && plzMatches;
        });

        console.log("Gefilterte Kundenkarten:", filteredResults); // Debugging

        setSearchResults(filteredResults); // Ergebnisse setzen
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Kundenkarten:', error);
    }
  };

  // Funktion zum Markieren der Zeile
  const handleRowClick = (index) => {
    setSelectedRow(index); // Setzt die markierte Zeile
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
        <button onClick={handleÜbernehmen}>Übernehmen</button>
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
              <th>Straße</th>
              <th>PLZ</th>
              <th>Ort</th>
              <th>Telefonnummer</th>
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
                  <td>{result.kundenkartennummer}</td>
                  <td>{`${result.vorname} ${result.nachname}`}</td>
                  <td>{result.adresse}</td>
                  <td>{result.plz}</td>
                  <td>{result.ort}</td>
                  <td>{result.telefonnummer}</td>
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
