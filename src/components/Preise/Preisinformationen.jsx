import React, { useEffect, useState } from 'react';
import './Preisinformationen.scss';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Preisinformationen = ({ isAdmin }) => {
  const [backendPakete, setBackendPakete] = useState([]);
  const [datenbankPakete, setDatenbankPakete] = useState([]);
  const [dienstleistungen, setDienstleistungen] = useState([]);

  useEffect(() => {
    const fetchBackendPakete = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete');
        if (Array.isArray(response.data)) {
          setBackendPakete(response.data);
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

    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
        if (response.data && response.data.data) {
          setDienstleistungen(response.data.data);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Dienstleistungen:', error);
      }
    };

    fetchDienstleistungen();
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
      <p>Unsere Dienstleistungen werden zu festen Stundenpreisen angeboten. [...]</p>

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
        {/* Dienstleistungen */}
        <div className="table-container">
          <h2>Dienstleistungen & Preise</h2>
          <table>
            <thead>
              <tr>
                <th>Leistung</th>
                <th>Preis</th>
              </tr>
            </thead>
            <tbody>
              {dienstleistungen.length > 0 ? (
                dienstleistungen.map((dienstleistung) => (
                  <tr key={dienstleistung.id}>
                    <td>{dienstleistung.title}</td>
                    <td>{formatPreis(dienstleistung.preis)} CHF</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2">Keine Dienstleistungen verfügbar</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Backend-Pakete */}
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
              {backendPakete.length > 0 ? (
                backendPakete.map((paket) => (
                  <tr key={paket.id} className={paket.empfohlen === 1 ? 'empfohlen' : ''}>
                    <td>
                      {paket.name}
                      {paket.empfohlen === 1 && <span title="Empfohlen"> ⭐</span>}
                    </td>
                    <td>{paket.ram}</td>
                    <td>{paket.cpu} CPU</td>
                    <td>{formatPreis(paket.vk_preis)} CHF</td>
                    <td>{formatPreis(parseFloat(paket.vk_preis) * 12)} CHF</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">Keine Backend-Pakete verfügbar</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Datenbank-Pakete */}
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
              {datenbankPakete.length > 0 ? (
                datenbankPakete.map((paket) => (
                  <tr key={paket.id} className={paket.empfohlen === 1 ? 'empfohlen' : ''}>
                    <td>
                      {paket.name}
                      {paket.empfohlen === 1 && <span title="Empfohlen"> ⭐</span>}
                    </td>
                    <td>{paket.maxDBSize} GB</td>
                    <td>{paket.memory} GB</td>
                    <td>{formatPreis(paket.vk_preis)} CHF</td>
                    <td>{formatPreis(parseFloat(paket.vk_preis) * 12)} CHF</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">Keine Datenbank-Pakete verfügbar</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Preisinformationen;
