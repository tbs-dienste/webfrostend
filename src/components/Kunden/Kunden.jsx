import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Kunden.scss';

const Kunden = () => {
  const [kunden, setKunden] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);

  useEffect(() => {
    async function fetchKunden() {
      try {
        const response = await axios.get('https://backend-1-cix8.onrender.com/api/v1/kunden');
        console.log('API-Daten:', response.data.data);
        setKunden(response.data.data);
      } catch (error) {
        console.error('Error fetching kunden:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchKunden();
  }, []);

  const handleShowConfirmationModal = (id) => {
    setShowConfirmationModal(true);
    setCustomerIdToDelete(id);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`https://backend-1-cix8.onrender.com/api/v1/kunden/${customerIdToDelete}`);
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

  return (
    <div className="kunden-container">
      <h2 className="kunden-title">Gespeicherte Kunden</h2>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Kundennummer, Vorname, Nachname oder Auftragsnummer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Lade Kunden...</p>
      ) : (
        <div className="kunden-liste">
          {kunden.length > 0 ? (
            kunden
              .filter((kunde) => {
                const fullName = `${kunde.vorname} ${kunde.nachname}`;
                return (
                  kunde.kundennummer.toString().includes(searchTerm) ||
                  fullName.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((kunde) => (
                <div key={kunde.id} className="kunden-box">
                  <p className="kunden-nummer">Kundennummer: {kunde.kundennummer}</p>
                  <p className="kunden-name">{kunde.vorname} {kunde.nachname}</p>
                  <div className="kunden-buttons">
                    <Link to={`/zeiterfassung/${kunde.id}`} className="kunden-button">
                      Arbeitszeit
                    </Link>
                    <Link to={`/rechnung/${kunde.id}`} className="kunden-button">
                      Rechnung erstellen
                    </Link>
                    <Link to={`/auftrag/${kunde.id}`} className="kunden-button">
                      Auftrag
                    </Link>
                    <Link to={`/kunden/${kunde.id}`} className="kunden-button">
                      Kunden anzeigen
                    </Link>
                    <button onClick={() => handleShowConfirmationModal(kunde.id)} className="kunden-button">
                      Kunde löschen
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p>Keine Kunden gefunden.</p>
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
