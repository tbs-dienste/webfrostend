import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Stelle sicher, dass axios importiert ist
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
        setKunden(response.data);
      } catch (error) {
        console.error('Error fetching kunden:', error);
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
      console.error('Error deleting kunde:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setCustomerIdToDelete(null);
  };

  // Filter- und Sortierlogik
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
                  <button onClick={() => handleShowConfirmationModal(kunde.id)} className="kunden-button">
                    Kunde löschen
                  </button>
                  {/* Anzeige des Rechnungsstatus */}
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
          ) : showMusterKunde ? (
            <div className="muster-kunde">
              <p>Keine Kunden vorhanden. Hier ist ein Muster-Kunde:</p>
              <div className="kunden-box">
                <p className="kunden-nummer">Kundennummer: 0000</p>
                <p className="kunden-name">Max Mustermann</p>
                <div className="kunden-buttons">
                  <Link to={`/zeiterfassung/0`} className="kunden-button">
                    Arbeitszeit
                  </Link>
                  <Link to={`/rechnung/0`} className="kunden-button">
                    Rechnung erstellen
                  </Link>
                  <Link to={`/kunden/0`} className="kunden-button">
                    Kunden anzeigen
                  </Link>
                </div>
              </div>
            </div>
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
