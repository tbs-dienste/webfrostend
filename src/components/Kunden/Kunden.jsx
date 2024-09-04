import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaClock, FaFileInvoice, FaUser, FaFileAlt, FaFileSignature, FaTrash, FaChevronDown } from 'react-icons/fa';
import './Kunden.scss';

const Kunden = () => {
  const [kunden, setKunden] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('alle');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedDienstleistungen, setSelectedDienstleistungen] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);

  const auftragsTypFarben = {
    "Webseite Programmieren": "#3498db",
    "Diashow erstellen": "#2ecc71",
    "Gaming PC zusammenbauen": "#e74c3c",
    "Visitenkarten": "#f1c40f",
    "Flyer erstellen": "#9b59b6",
    "IT-Support": "#e67e22",
    "Eventplanung": "#1abc9c",
    "Mockup Erstellen": "#34495e",
    "Notentool für Lehrbetriebe und Unternehmen": "#16a085",
    "Office-Kurse für Schüler": "#27ae60",
    "Office-Kurse für Unternehmen": "#2980b9",
    "default": "#bdc3c7"
  };

  const dienstleistungsTypen = Object.keys(auftragsTypFarben);

  useEffect(() => {
    const fetchKunden = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden');
        const data = response.data.data;

        if (Array.isArray(data)) {
          setKunden(data);
        } else {
          console.error('Erwartet ein Array, aber erhalten:', data);
          setKunden([]);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Kunden:', error);
        alert('Fehler beim Abrufen der Kunden. Bitte versuche es später noch einmal.');
        setKunden([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKunden();
  }, []);

  const handleShowConfirmationModal = (id) => {
    setShowConfirmationModal(true);
    setCustomerIdToDelete(id);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${customerIdToDelete}`);
      const updatedKunden = kunden.filter(kunde => kunde.id !== customerIdToDelete);
      setKunden(updatedKunden);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Fehler beim Löschen des Kunden:', error);
      alert('Fehler beim Löschen des Kunden. Bitte versuche es später noch einmal.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setCustomerIdToDelete(null);
  };

  const handleDienstleistungsChange = (dienstleistung) => {
    setSelectedDienstleistungen(prevSelected =>
      prevSelected.includes(dienstleistung)
        ? prevSelected.filter(item => item !== dienstleistung)
        : [...prevSelected, dienstleistung]
    );
  };

  const filteredKunden = kunden.filter((kunde) => {
    const fullName = `${kunde.vorname} ${kunde.nachname}`;
    const status = kunde.rechnungGestellt ? (kunde.rechnungBezahlt ? 'bezahlt' : 'offen') : 'entwurf';
    const dienstleistungsFilter = selectedDienstleistungen.length === 0 || selectedDienstleistungen.includes(kunde.auftragsTyp);

    return (
      (kunde.id.toString().includes(searchTerm) ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'alle' || status === statusFilter) &&
      (showArchived ? kunde.archiviert : !kunde.archiviert) &&
      dienstleistungsFilter
    );
  });

  return (
    <div className="kunden-container">
      <h2 className="kunden-title">Kunden</h2>

      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Kundennummer, Vorname, Nachname oder Auftragsnummer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="alle">Alle Status</option>
          <option value="bezahlt">Bezahlt</option>
          <option value="offen">Offen</option>
          <option value="entwurf">Entwurf</option>
        </select>

        <div className="archiv-filter">
          <label>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={() => setShowArchived(!showArchived)}
            />
            Archivierte Kunden anzeigen
          </label>
        </div>

        <div className="dropdown-filter">
          <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
            Dienstleistung <FaChevronDown />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {dienstleistungsTypen.map((typ) => (
                <label key={typ} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={selectedDienstleistungen.includes(typ)}
                    onChange={() => handleDienstleistungsChange(typ)}
                  />
                  {typ}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p>Lade Kunden...</p>
      ) : (
        <div className="kunden-liste">
          {filteredKunden.length > 0 ? (
            filteredKunden.map((kunde) => {
              const dienstleistungsFarbe = auftragsTypFarben[kunde.auftragsTyp] || auftragsTypFarben["default"];
              
              return (
                <div key={kunde.id} className="kunden-box">
                  <p className="kunden-nummer">Kundennummer: {kunde.kundennummer}</p>
                  <p className="kunden-name">{kunde.vorname} {kunde.nachname}</p>
                  <div className="kunden-buttons">
                    <Link to={`/zeiterfassung/${kunde.id}`} className="kunden-button">
                      <FaClock /> Arbeitszeit
                    </Link>
                    <Link to={`/rechnung/${kunde.id}`} className="kunden-button">
                      <FaFileInvoice /> Rechnung erstellen
                    </Link>
                    <Link to={`/kunden/${kunde.id}`} className="kunden-button">
                      <FaUser /> Kunden anzeigen
                    </Link>
                    <Link to={`/auftragsbestaetigung/${kunde.id}`} className="kunden-button">
                      <FaFileAlt /> Auftragsbestätigung
                    </Link>
                    <Link to={`/vertrag/${kunde.id}?code=${kunde.verificationCode || ''}`} className="kunden-button">
                      <FaFileSignature /> Vertrag
                    </Link>
                    <button onClick={() => handleShowConfirmationModal(kunde.id)} className="kunden-button">
                      <FaTrash /> Kunde löschen
                    </button>
                  </div>
                  <div className="status-und-typ">
                    <div className="dienstleistung" style={{ backgroundColor: dienstleistungsFarbe }}>
                      {kunde.auftragsTyp}
                    </div>
                    <div className={`rechnungs-status ${kunde.rechnungGestellt ? (kunde.rechnungBezahlt ? 'bezahlt' : 'offen') : 'entwurf'}`}>
                      {kunde.rechnungGestellt ? (
                        kunde.rechnungBezahlt ? 'Bezahlt' : 'Offen'
                      ) : (
                        'Entwurf'
                      )}
                    </div>
                  </div>
                  {kunde.archiviert ? <span className="archiviert-label">Archiviert</span> : null}
                </div>
              );
            })
          ) : (
            <p className="no-results">Keine Ergebnisse gefunden.</p>
          )}
        </div>
      )}

      {showConfirmationModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>Bist du sicher, dass du diesen Kunden löschen möchtest?</p>
            <div>
              <button onClick={handleDeleteConfirmation}>Ja</button>
              <button onClick={handleCancelDelete}>Nein</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kunden;
