import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaClock, FaFileInvoice, FaUser, FaFileAlt, FaFileSignature, FaTrash } from 'react-icons/fa';
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
        const token = localStorage.getItem('token'); // Token aus localStorage holen
        const archiviertParam = showArchived ? 'true' : 'false'; // Den archiviert-Status in der Anfrage berücksichtigen

        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden?archiviert=${archiviertParam}`, {
          headers: {
            Authorization: `Bearer ${token}` // Token im Header einfügen
          }
        });

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
  }, [showArchived]); // Der Effekt wird jedes Mal ausgeführt, wenn sich der archiviert-Status ändert.

  const handleShowConfirmationModal = (id) => {
    setShowConfirmationModal(true);
    setCustomerIdToDelete(id);
  };

  // Prüft ob eine Farbe dunkel ist
  const isDarkColor = (hex) => {
    if (!hex) return false;

    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Wahrgenommene Helligkeit (WCAG-Formel)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 140; // Schwellenwert
  };

  const handleDeleteConfirmation = async () => {
    try {
      const token = localStorage.getItem('token'); // Token aus localStorage holen
      await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${customerIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}` // Token im Header einfügen
        }
      });
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
      (statusFilter === 'alle' || status === statusFilter)
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
            filteredKunden.map((kunde) => {
              const dienstleistungen = kunde.dienstleistungen || [];

              return (
                <div key={kunde.id} className="kunden-box">
                  <p className="kunden-nummer">Kundennummer: {kunde.kundennummer}</p>
                  <p className="kunden-name">{kunde.vorname} {kunde.nachname}</p>
                  <div className="kunden-buttons">
                    <Link to={`/zeiterfassung/${kunde.id}`} className="kunden-button">
                      <FaClock /> Arbeitszeit
                    </Link>

                    <Link to={`/kunden/${kunde.id}`} className="kunden-button">
                      <FaUser /> Kunden anzeigen
                    </Link>
                    <Link to={`/aufgaben/${kunde.id}`} className="kunden-button">
                      Aufgaben
                    </Link>
                    <button onClick={() => handleShowConfirmationModal(kunde.id)} className="kunden-button">
                      <FaTrash /> Kunde löschen
                    </button>
                  </div>

                  <div className="dienstleistungen">
                    {dienstleistungen.map((dienstleistung) => {
                      const farbe = dienstleistung.farbe || "#cccccc"; // Fallback-Farbe

                      return (
                        <div
                          key={dienstleistung.id}
                          className={`dienstleistung ${isDarkColor(farbe) ? 'dark' : 'light'}`}
                          style={{ backgroundColor: farbe }}
                        >
                          {dienstleistung.title}
                        </div>

                      );
                    })}
                  </div>

                  <div className={`rechnungs-status ${kunde.rechnungGestellt ? (kunde.rechnungBezahlt ? 'bezahlt' : 'offen') : 'entwurf'}`}>
                    {kunde.rechnungGestellt ? (
                      kunde.rechnungBezahlt ? 'Bezahlt' : 'Offen'
                    ) : (
                      'Entwurf'
                    )}
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
          <p>Bist du sicher, dass du diesen Kunden löschen möchtest?</p>
          <button onClick={handleDeleteConfirmation}>Ja</button>
          <button onClick={handleCancelDelete}>Nein</button>
        </div>
      )}
    </div>
  );
};

export default Kunden;
