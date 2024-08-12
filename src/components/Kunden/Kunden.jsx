import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Kunden.scss';

const Kunden = () => {
  const [kunden, setKunden] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('alle');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);

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

  const filteredKunden = kunden.filter((kunde) => {
    const fullName = `${kunde.vorname} ${kunde.nachname}`;
    const status = kunde.rechnungGestellt ? (kunde.rechnungBezahlt ? 'bezahlt' : 'offen') : 'entwurf';
    return (
      (kunde.id.toString().includes(searchTerm) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'alle' || status === statusFilter) &&
      (showArchived ? kunde.archiviert : !kunde.archiviert)
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
      </div>

      {loading ? (
        <p>Lade Kunden...</p>
      ) : (
        <div className="kunden-liste">
          {filteredKunden.length > 0 ? (
            filteredKunden.map((kunde) => (
              <div key={kunde.id} className="kunden-box">
                <p className="kunden-nummer">Kundennummer: {kunde.id}</p>
                <p className="kunden-name">{kunde.vorname} {kunde.nachname}</p>
                <div className="kunden-buttons">
                  <Link to={`/zeiterfassung/${kunde.id}`} className="kunden-button">
                    Arbeitszeit
                  </Link>
                  <Link to={`/rechnung/${kunde.id}`} className="kunden-button">
                    Rechnung erstellen
                  </Link>
                  <Link to={`/kunden/${kunde.id}`} className="kunden-button">
                    Kunden anzeigen
                  </Link>
                  <Link to={`/auftragsbestaetigung/${kunde.id}`} className="kunden-button">
                    Auftragsbestätigung
                  </Link>
                  <Link to={`/vertrag/${kunde.id}?code=${kunde.verificationCode}`} className="kunden-button">
                    Vertrag
                  </Link>
                  <button onClick={() => handleShowConfirmationModal(kunde.id)} className="kunden-button">
                    Kunde löschen
                  </button>
                  <div className={`rechnungs-status ${kunde.rechnungGestellt ? (kunde.rechnungBezahlt ? 'bezahlt' : 'offen') : 'entwurf'}`}>
                    {kunde.rechnungGestellt ? (
                      kunde.rechnungBezahlt ? 'Bezahlt' : 'Offen'
                    ) : (
                      'Entwurf'
                    )}
                  </div>
                  {kunde.archiviert && <span className="archiviert-label">Archiviert</span>}
                </div>
              </div>
            ))
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
