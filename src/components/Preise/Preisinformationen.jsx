import React, { useEffect, useState } from 'react';
import './Preisinformationen.scss';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importiere Link von react-router-dom

const Preisinformationen = ({ isAdmin }) => {
  const [backendPakete, setBackendPakete] = useState([]);
  const [datenbankPakete, setDatenbankPakete] = useState([]);

  useEffect(() => {
    const fetchBackendPakete = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete');
        if (response.data && response.data.data) {
          setBackendPakete(response.data.data);
        } else {
          console.error('Unerwartetes Antwortformat für Backend-Pakete:', response.data);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Backend-Pakete:', error);
      }
    };

    const fetchDatenbankPakete = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/datenbankpakete');
        if (response.data && response.data.data) {
          setDatenbankPakete(response.data.data);
        } else {
          console.error('Unerwartetes Antwortformat für Datenbank-Pakete:', response.data);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Datenbank-Pakete:', error);
      }
    };

    fetchBackendPakete();
    fetchDatenbankPakete();
  }, []);

  const formatPreis = (preis) => {
    const numPreis = parseFloat(preis);
    return isNaN(numPreis) ? '0.00' : numPreis.toFixed(2);
  };

  return (
    <div className="preisinformationen">
      <h1>Preisinformationen</h1>
      <p>Unsere Dienstleistungen werden nach einem individuell mit den Kunden vereinbarten Stundensatz berechnet. Die Kosten für Backend-Entwicklung und Datenbank sind ebenfalls aufgeführt.</p>

      <div className="legend">
        <h2>Legende</h2>
        <p><strong>Empfohlen:</strong> Diese Pakete sind für die meisten Kunden die beste Wahl basierend auf Preis-Leistungs-Verhältnis.</p>
      </div>
      {isAdmin && (
        <div className="action-buttons">
          <Link to="/datenbankpaketerstellen" className="add-btn">
            <FaPlus /> Neuer Datenbankeintrag
          </Link>
          <Link to="/backendpaketerstellen" className="add-btn">
            <FaPlus /> Neuer Backendeintrag
          </Link>
        </div>
      )}

      <div className="tables">
        <div className="table-container">
          <h2>Stundensatz</h2>
          <table>
            <thead>
              <tr>
                <th>Leistung</th>
                <th>Preis pro Stunde</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Entwicklung</td>
                <td>Individuell</td>
              </tr>
              <tr>
                <td>Design</td>
                <td>Individuell</td>
              </tr>
              <tr>
                <td>Beratung</td>
                <td>Individuell</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>Backend-Kosten</h2>
          <table>
            <thead>
              <tr>
                <th>Paket</th>
                <th>RAM</th>
                <th>CPU</th>
                <th>Preis pro Monat</th>
                <th>Preis pro Jahr</th>
              </tr>
            </thead>
            <tbody>
              {backendPakete.map((paket) => (
                <tr key={paket.id} className={paket.empfohlen ? 'empfohlen' : ''}>
                  <td>{paket.name}</td>
                  <td>{paket.ram}</td>
                  <td>{paket.cpu}</td>
                  <td>{formatPreis(paket.preis)} CHF</td>
                  <td>{formatPreis(paket.preis * 12)} CHF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>Datenbank-Kosten</h2>
          <table>
            <thead>
              <tr>
                <th>Leistung</th>
                <th>Speicher</th>
                <th>Memory</th>
                <th>Preis pro Monat</th>
                <th>Preis pro Jahr</th>
              </tr>
            </thead>
            <tbody>
              {datenbankPakete.map((paket) => (
                <tr key={paket.id} className={paket.empfohlen ? 'empfohlen' : ''}>
                  <td>{paket.name}</td>
                  <td>{paket.maxDBSize} GB</td>
                  <td>{paket.memory} GB</td>
                  <td>{formatPreis(paket.preis)} CHF</td>
                  <td>{formatPreis(paket.preis * 12)} CHF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Preisinformationen;
