import React, { useState, useEffect } from 'react';
import Keyboard from '../Kasse/Keyboard';
import './KundenSuche.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KundenSuche = ({ onKassenModusChange }) => {
  const [activeField, setActiveField] = useState('name');
  const [formData, setFormData] = useState({
    kundennr: '',
    name: '',
    plz: '',
    ort: '',
    strasse: '',
    telnr: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onKassenModusChange(true);
    return () => onKassenModusChange(false);
  }, [onKassenModusChange]);

  useEffect(() => {
    document.getElementById('name')?.focus();
  }, []);

  const handleKeyPress = (key) => {
    if (!activeField) return;
    let value = formData[activeField];

    switch (key) {
      case 'DELETE':
        value = value.slice(0, -1);
        break;
      case 'SPACE':
        value += ' ';
        break;
      case 'TAB':
        focusNextField();
        return;
      case 'ENTER':
        handleSearch();
        return;
      default:
        value += key;
    }

    setFormData({ ...formData, [activeField]: value });
  };

  const focusNextField = () => {
    const fields = ['kundennr', 'name', 'plz', 'ort', 'strasse', 'telnr'];
    const currentIndex = fields.indexOf(activeField);
    const nextIndex = (currentIndex + 1) % fields.length;
    setActiveField(fields[nextIndex]);
    document.getElementById(fields[nextIndex])?.focus();
  };

  const handleRowClick = (index) => setSelectedRow(index);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'success') {
        const filtered = response.data.kundenkarten.filter((item) => {
          const fullName = `${item.vorname} ${item.nachname}`.toLowerCase();
          return fullName.includes(formData.name.toLowerCase()) &&
                 item.plz.includes(formData.plz);
        });
        setSearchResults(filtered);
        setSelectedRow(null); // Auswahl zurücksetzen
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Kundenkarten:', error);
    }
  };

  const handleÜbernehmen = async () => {
    if (selectedRow === null) return alert("Bitte wählen Sie einen Kunden aus.");
    const selectedCustomer = searchResults[selectedRow];
    const token = localStorage.getItem("token");
    if (!token) return alert("Fehler: Kein Token gefunden. Bitte erneut anmelden.");

    try {
      await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/scan",
        { kundenkartennummer: selectedCustomer.kundenkartennummer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onKassenModusChange({
        kundenkartennummer: selectedCustomer.kundenkartennummer,
        vorname: selectedCustomer.vorname,
        nachname: selectedCustomer.nachname,
        plz: selectedCustomer.plz,
        ort: selectedCustomer.ort,
      });

      navigate('/kasse');
    } catch (error) {
      console.error("Fehler beim Übernehmen der Kundenkarte:", error);
      alert("Fehler beim Übernehmen der Kundenkarte.");
    }
  };

  const resetFilters = () => setFormData({ kundennr: '', name: '', plz: '', ort: '', strasse: '', telnr: '' });

  return (
    <div className="kundensuche-container">
      <div className="kundensuche-form">
        {['kundennr', 'name', 'plz', 'ort', 'strasse', 'telnr'].map((field) => (
          <div
            key={field}
            className={`input-field ${activeField === field ? 'active' : ''}`}
            onClick={() => setActiveField(field)}
          >
            <label>{field.toUpperCase()}</label>
            <input
              id={field}
              type="text"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              readOnly
              autoFocus={field === 'name'}
            />
          </div>
        ))}
      </div>

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
                  className={selectedRow === index ? 'selected' : ''}
                  onClick={() => handleRowClick(index)}
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

      <Keyboard onKeyPress={handleKeyPress} />

      <div className="bottom-buttons">
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button onClick={resetFilters}>Filter löschen</button>
        <button disabled>Detail</button>
        <button onClick={handleSearch}>Suchen</button>
        <button onClick={handleÜbernehmen}>Übernehmen</button>
        <button onClick={() => navigate('/kasse')}>Exit</button>
      </div>
    </div>
  );
};

export default KundenSuche;
