import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerCards.scss';

const CustomerCards = () => {
  const [kundenkarten, setKundenkarten] = useState([]);
  const [filteredKarten, setFilteredKarten] = useState([]);

  const [filterVorname, setFilterVorname] = useState('');
  const [filterNachname, setFilterNachname] = useState('');
  const [filterOrt, setFilterOrt] = useState('');
  const [filterKartennummer, setFilterKartennummer] = useState('');
  const [filterPLZ, setFilterPLZ] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Für Navigation zu Detailseiten

  useEffect(() => {
    const fetchCustomerCards = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {
          setKundenkarten(response.data.kundenkarten);
          setFilteredKarten(response.data.kundenkarten);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Kundenkarten:', error);
      }
    };

    fetchCustomerCards();
  }, [token]);

  const handleSearch = () => {
    const filtered = kundenkarten.filter((karte) => {
      return (
        karte.vorname.toLowerCase().includes(filterVorname.toLowerCase()) &&
        karte.nachname.toLowerCase().includes(filterNachname.toLowerCase()) &&
        karte.ort.toLowerCase().includes(filterOrt.toLowerCase()) &&
        karte.kundenkartennummer.includes(filterKartennummer) &&
        karte.plz.toString().includes(filterPLZ) &&
        karte.status.toLowerCase().includes(filterStatus.toLowerCase())
      );
    });

    setFilteredKarten(filtered);
  };

  const handleReset = () => {
    setFilterVorname('');
    setFilterNachname('');
    setFilterOrt('');
    setFilterKartennummer('');
    setFilterPLZ('');
    setFilterStatus('');
    setFilteredKarten(kundenkarten);
  };

  // Hier mit kundenkartennummer statt id
  const handleView = (kundenkartennummer) => {
    navigate(`/kundenkarte/${kundenkartennummer}`);
  };

  return (
    <div className="customer-card-container">
      <div className="header">
        <h2>Kundenkarten Übersicht</h2>
        <Link to="/add-points" className="btn-primary">
          ➕ Punkte Nachtragen
        </Link>
        <Link to="/createKundenkarte" className="btn-primary">
          ➕ Kundenkarte erstellen
        </Link>
      </div>

      {/* Filter-Felder */}
      <div className="filter-fields">
        <input
          type="text"
          placeholder="Kartennummer"
          value={filterKartennummer}
          onChange={(e) => setFilterKartennummer(e.target.value)}
        />
        <input
          type="text"
          placeholder="Vorname"
          value={filterVorname}
          onChange={(e) => setFilterVorname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nachname"
          value={filterNachname}
          onChange={(e) => setFilterNachname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ort"
          value={filterOrt}
          onChange={(e) => setFilterOrt(e.target.value)}
        />
        <input
          type="text"
          placeholder="PLZ"
          value={filterPLZ}
          onChange={(e) => setFilterPLZ(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status (Gold/Silber/Normal)"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        />

        <button className="btn-search" onClick={handleSearch}>
          🔍 Suchen
        </button>
        <button className="btn-reset" onClick={handleReset}>
          ❌ Zurücksetzen
        </button>
      </div>

      {/* Tabelle */}
      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Kartennummer</th>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>PLZ</th>
              <th>Ort</th>
              <th>Punkte</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredKarten.length > 0 ? (
              filteredKarten.map((karte) => (
                <tr key={karte.kundenkartennummer}>
                  <td>{karte.kundenkartennummer}</td>
                  <td>{karte.vorname}</td>
                  <td>{karte.nachname}</td>
                  <td>{karte.plz}</td>
                  <td>{karte.ort}</td>
                  <td>{karte.punkte}</td>
                  <td>
                    <span
                      className={`status ${
                        karte.status.toLowerCase() === 'gold'
                          ? 'gold'
                          : karte.status.toLowerCase() === 'silber'
                          ? 'silver'
                          : 'normal'
                      }`}
                    >
                      {karte.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleView(karte.kundenkartennummer)}
                    >
                      👁️ Ansehen
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  Keine Kundenkarten gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerCards;
