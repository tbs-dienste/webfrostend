// Verbesserte MitarbeiterAnzeigen-Komponente mit Dropdown

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './MitarbeiterAnzeigen.scss';
import logo from '../../logo.png'; // Import des Logos
import axios from 'axios';

function MitarbeiterAnzeigen() {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedMitarbeiter, setSelectedMitarbeiter] = useState(null);
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    const fetchMitarbeiter = async () => {
      try {
        const response = await axios.get('https://backend-1-cix8.onrender.com/api/v1/mitarbeiter');
        setMitarbeiterListe(response.data.data);
        // Hier könntest du die Dropdown-Optionen aus den Mitarbeiterdaten extrahieren und setzen
        const options = response.data.data.map(mitarbeiter => ({
          value: mitarbeiter.id,
          label: `${mitarbeiter.vorname} ${mitarbeiter.nachname}`
        }));
        setDropdownOptions(options);
      } catch (error) {
        console.error('Fehler beim Laden der Mitarbeiterdaten:', error);
      }
    };

    fetchMitarbeiter();
  }, []);

  const generatePDF = async (mitarbeiter) => {
    if (!mitarbeiter || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    const doc = new jsPDF();
    // PDF-Generierungslogik hier...

    setIsGeneratingPDF(false);
  };

  const handleMitarbeiterLoeschen = async (id) => {
    try {
      await axios.delete(`https://backend-1-cix8.onrender.com/api/v1/mitarbeiter/${id}`);
      const updatedList = mitarbeiterListe.filter(mitarbeiter => mitarbeiter.id !== id);
      setMitarbeiterListe(updatedList);
      localStorage.setItem('mitarbeiter', JSON.stringify(updatedList));
    } catch (error) {
      console.error('Fehler beim Löschen des Mitarbeiters:', error);
    }
  };

  const toggleDetailsVisibility = () => {
    setIsDetailsVisible(!isDetailsVisible);
    if (!isDetailsVisible) {
      setSelectedMitarbeiter(null);
    }
  };

  const handleMitarbeiterClick = (mitarbeiter) => {
    setSelectedMitarbeiter(mitarbeiter);
    setIsDetailsVisible(true);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownSelect = (option) => {
    // Logik für die Dropdown-Auswahl hier...
  };

  return (
    <div className="mitarbeiter-anzeigen-container">
      <h2 className="mitarbeiter-anzeigen-title">Mitarbeiter anzeigen</h2>
      <div className="dropdown-container">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          Dropdown {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            {dropdownOptions.map(option => (
              <div key={option.value} className="dropdown-item" onClick={() => handleDropdownSelect(option)}>
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <ul className="mitarbeiter-liste">
        {mitarbeiterListe && mitarbeiterListe.map((mitarbeiter) => (
          <li key={mitarbeiter.id} className="mitarbeiter-list-item" onClick={() => handleMitarbeiterClick(mitarbeiter)}>
            <span className="mitarbeiter-name">{mitarbeiter.vorname} {mitarbeiter.nachname}</span>
            <span className="mitarbeiter-status">{mitarbeiter.online ? 'Online' : 'Offline'}</span>
            <button onClick={() => generatePDF(mitarbeiter)}>PDF</button>
            <button onClick={() => handleMitarbeiterLoeschen(mitarbeiter.id)}>Löschen</button>
            <div className="arrow-icon" onClick={toggleDetailsVisibility}>
              {isDetailsVisible ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
        ))}
      </ul>
      {isDetailsVisible && selectedMitarbeiter && (
        <div className="mitarbeiter-details">
          <h3>Mitarbeiterdetails</h3>
          <div><strong>Vorname:</strong> {selectedMitarbeiter.vorname}</div>
          <div><strong>Nachname:</strong> {selectedMitarbeiter.nachname}</div>
          <div><strong>IBAN:</strong> {selectedMitarbeiter.iban}</div>
          <div><strong>Adresse:</strong> {selectedMitarbeiter.strasseHausnummer}</div>
          <div><strong>Benutzername:</strong> {selectedMitarbeiter.benutzername}</div>
          <div><strong>Passwort:</strong> {selectedMitarbeiter.passwort}</div>
          <div><strong>Status:</strong> {selectedMitarbeiter.online ? 'Online' : 'Offline'}</div>
        </div>
      )}
    </div>
  );
}

export default MitarbeiterAnzeigen;
