import React, { useState, useEffect } from 'react';
import Keyboard from '../Kasse/Keyboard';
import './KundenSuche.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Artikelsuche = ({ onKassenModusChange }) => {
  const [activeField, setActiveField] = useState('article_short_text');
  const [formData, setFormData] = useState({
    article_number: '',
    article_short_text: '',
    barcode: '',
    manufacturer: '',
    category: '',
    artikelgruppe: '',
    artikelgruppe_nummer: '',
    hauptartikelgruppe: '',
    hauptartikelnummer: '',
    produktgruppe: '',
    produktgruppe_nummer: '',
    gueltig_ab: '',
    gueltig_bis: '',
    hauptaktivitaet: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onKassenModusChange(true);
    return () => {
      onKassenModusChange(false);
    };
  }, [onKassenModusChange]);

  useEffect(() => {
    document.getElementById('article_short_text').focus();
  }, []);

  const handleKeyPress = (key) => {
    if (!activeField) return;

    let value = formData[activeField];

    if (key === 'DELETE') {
      value = value.slice(0, -1);
    } else if (key === 'SPACE') {
      value += ' ';
    } else {
      value += key;
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
      alert("Bitte wählen Sie einen Artikel aus.");
      return;
    }
  
    const selectedArticle = searchResults[selectedRow];
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Fehler: Kein Token gefunden. Bitte erneut anmelden.");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/scan",
        { nummer: selectedArticle.article_number, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Artikel erfolgreich übernommen:", response.data);
  
      // Sende die gescannten Produkte an die Kasse
      onKassenModusChange(response.data.products);
  
      navigate('/kasse');
    } catch (error) {
      console.error("Fehler beim Übernehmen des Artikels:", error);
      alert("Fehler beim Übernehmen des Artikels.");
    }
  };
  

  
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("API Antwort:", response.data); // Debugging
  
      // Produkte aus Response holen
      const allResults = response.data.data || [];
  
      console.log("Gefundene Produkte:", allResults);
  
      // Wenn du NUR nach article_short_text suchen willst:
      const filteredResults = allResults.filter((product) => {
        return product.article_short_text
          ?.toLowerCase()
          .includes(formData.article_short_text.toLowerCase());
      });
  
      console.log("Gefilterte Artikel:", filteredResults);
  
      setSearchResults(filteredResults); // Ergebnisse setzen
    } catch (error) {
      console.error('Fehler beim Abrufen der Produkte:', error);
      alert('Fehler beim Abrufen der Produkte.');
    }
  };
  
  

  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  return (
    <div className="kundensuche-container">
      <div className="kundensuche-form">
        {['article_number', 'article_short_text', 'barcode', 'manufacturer', 'category', 'artikelgruppe', 'artikelgruppe_nummer', 'hauptartikelgruppe', 'hauptartikelnummer', 'produktgruppe', 'produktgruppe_nummer', 'gueltig_ab', 'gueltig_bis', 'hauptaktivitaet'].map((field) => (
          <div
            key={field}
            className={`input-field ${activeField === field ? 'active' : ''}`}
            onClick={() => setActiveField(field)}
          >
            <label>{field.toUpperCase()}</label>
            <input
              id={field}
              type="text"
              name={field}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              readOnly
              autoFocus={field === 'article_short_text'}
            />
          </div>
        ))}
      </div>

      <div className="bottom-buttons">
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button disabled className="icon-button">X</button>
        <button onClick={() => setFormData({ kundennr: '', name: '', plz: '', ort: '', strasse: '', telnr: '' })}>
          Filter löschen
        </button>
        <button disabled>Detail</button>
        <button onClick={handleSearch}>
          Suchen
        </button>
        <button onClick={handleÜbernehmen}>
          Übernehmen
        </button>
        <button onClick={goToKasse}>
          Exit
        </button>
      </div>

      <div className="result-table">
        <h3>Suchergebnisse</h3>
        <table>
          <thead>
            <tr>
              <th>Artikelnummer</th>
              <th>Artikelname</th>
              <th>Barcode</th>
              <th>Hersteller</th>
              <th>Preis</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((product, index) => (
                <tr
                  key={index}
                  className={selectedRow === index ? 'selected' : ''}
                  onClick={() => handleRowClick(index)}
                >
                  <td>{product.article_number}</td>
                  <td>{product.article_short_text}</td>
                  <td>{product.barcode}</td>
                  <td>{product.manufacturer}</td>
                  <td>{product.price} CHF</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Keine Ergebnisse gefunden</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
};

export default Artikelsuche;
