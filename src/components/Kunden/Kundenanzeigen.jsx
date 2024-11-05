import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaUndo, FaEdit, FaCopy } from 'react-icons/fa';
import './KundenAnzeigen.scss';

const KundenAnzeigen = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKunde() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const kunde = response.data.data;
        if (kunde) {
          setSelectedKunde(kunde);
          setOriginalData(kunde);
          setEditedData(kunde);
        } else {
          console.error('Kunde nicht gefunden');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Kunden:', error);
        alert('Fehler beim Abrufen der Kundendaten. Bitte versuche es später noch einmal.');
      } finally {
        setLoading(false);
      }
    }

    fetchKunde();
  }, [id]);

  const handleEdit = () => {
    setEditMode(true);
    setEditedData(selectedKunde);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, editedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Daten erfolgreich aktualisiert');
      setEditMode(false);
      setSelectedKunde(editedData);
      setOriginalData(editedData);
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
      alert('Fehler beim Speichern der Daten. Bitte versuche es später noch einmal.');
    }
  };

  const handleUndo = () => {
    if (originalData) {
      setEditedData(originalData);
      setEditMode(false);
    }
  };

  const copyLinkToClipboard = () => {
    const reviewLink = `${window.location.origin}/kundenbewertung/${selectedKunde.kundennummer}`;
    navigator.clipboard.writeText(reviewLink);
    alert('Link zum Bewerten wurde kopiert!');
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedKunde((prevKunde) => ({ ...prevKunde, status: newStatus }));
      alert(`Status erfolgreich auf ${newStatus} aktualisiert!`);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      alert('Fehler beim Aktualisieren des Status. Bitte versuche es später noch einmal.');
    }
  };

  if (loading) {
    return <div className="loading">Lade Kunde...</div>;
  }

  return (
    <div className="kunden-anzeigen-container">
      <h2>Kundendetails anzeigen</h2>
      {selectedKunde ? (
        <div>
          {editMode ? (
            <div>
              <div className="input-group">
                <label>Kundennummer:</label>
                <input
                  type="text"
                  name="kundennummer"
                  value={editedData.kundennummer || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Firma:</label>
                <input
                  type="text"
                  name="firma"
                  value={editedData.firma || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Vorname:</label>
                <input
                  type="text"
                  name="vorname"
                  value={editedData.vorname || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Nachname:</label>
                <input
                  type="text"
                  name="nachname"
                  value={editedData.nachname || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Mobil:</label>
                <input
                  type="tel"
                  name="mobil"
                  value={editedData.mobil || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Adresse:</label>
                <input
                  type="text"
                  name="strasseHausnummer"
                  value={editedData.strasseHausnummer || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>PLZ:</label>
                <input
                  type="text"
                  name="postleitzahl"
                  value={editedData.postleitzahl || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Ort:</label>
                <input
                  type="text"
                  name="ort"
                  value={editedData.ort || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button onClick={handleSave}>
                  <FaSave /> Speichern
                </button>
                <button onClick={handleUndo}>
                  <FaUndo /> Änderungen zurücksetzen
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Kundennummer:</strong> {selectedKunde.kundennummer}</p>
              <p><strong>Firma:</strong> {selectedKunde.firma}</p>
              <p><strong>Vorname:</strong> {selectedKunde.vorname}</p>
              <p><strong>Nachname:</strong> {selectedKunde.nachname}</p>
              <p><strong>Email:</strong> {selectedKunde.email}</p>
              <p><strong>Mobil:</strong> {selectedKunde.mobil}</p>
              <p><strong>Adresse:</strong> {selectedKunde.strasseHausnummer}</p>
              <p><strong>PLZ:</strong> {selectedKunde.postleitzahl}</p>
              <p><strong>Ort:</strong> {selectedKunde.ort}</p>
              <p><strong>Status:</strong> {selectedKunde.status}</p>
              <button onClick={handleEdit}>
                <FaEdit /> Bearbeiten
              </button>
            </div>
          )}



          {/* Status Buttons */}
          <div className="status-buttons">
            <h3>Status aktualisieren</h3>
            {['offen', 'inBearbeitung', 'abgeschlossen'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={selectedKunde.status === status ? 'active' : ''}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Display Bewertungen or Button for Link */}
{selectedKunde.bewertungen && selectedKunde.bewertungen.length > 0 ? (
  <div>
    <h3>Bewertungen:</h3>
    {selectedKunde.bewertungen.map((bewertung, index) => (
      <div key={index} className="bewertung">
        <p><strong>Arbeitsqualität:</strong> {bewertung.arbeitsqualität} ({bewertung.arbeitsqualität_rating})</p>
        <p><strong>Tempo:</strong> {bewertung.tempo} ({bewertung.tempo_rating})</p>
        <p><strong>Gesamt:</strong> {bewertung.gesamt} ({bewertung.gesamt_rating})</p>
        <p><strong>Freundlichkeit:</strong> {bewertung.freundlichkeit} ({bewertung.freundlichkeit_rating})</p>
        <p><strong>Zufriedenheit:</strong> {bewertung.zufriedenheit} ({bewertung.zufriedenheit_rating})</p>
        <p><strong>Gesamtrating:</strong> {bewertung.gesamtrating}</p>
        <p><strong>Bewertungstext:</strong> {bewertung.gesamttext}</p>
        <p><small>Erstellt am: {new Date(bewertung.created_at).toLocaleDateString()}</small></p>
      </div>
    ))}
  </div>
) : (
  <button onClick={copyLinkToClipboard} className="copy-link-button">
    <FaCopy /> Link zum Bewerten kopieren
  </button>
)}


          {/* Link Buttons */}
          <div className="link-button-container">
            <Link to={`/${id}/gesamtarbeitszeit`} className="link-button">
              Details anzeigen
            </Link>
          </div>
          <div className="link-button-container">
            <Link to={`/arbeitszeiten/${id}`} className="link-button">
              Arbeitszeiten anzeigen
            </Link>
          </div>

          {/* Dienstleistungen und Rechnungen anzeigen */}
          <div className="dienstleistungen-container">
            <h3>Verfügbare Dienstleistungen</h3>
            {selectedKunde.dienstleistungen && selectedKunde.dienstleistungen.length > 0 ? (
              <ul className="dienstleistungen-list">
                {selectedKunde.dienstleistungen.map((dienstleistung) => (
                  <li key={dienstleistung.id} className="dienstleistung-item">
                    <p>{dienstleistung.title}: {dienstleistung.beschreibung}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Keine Dienstleistungen verfügbar.</p>
            )}
          </div>

          <h3>Rechnungen</h3>
          {selectedKunde.rechnungen && selectedKunde.rechnungen.length > 0 ? (
            <ul className="rechnungen-list">
              {selectedKunde.rechnungen.map((rechnung) => (
                <li key={rechnung.id} className="rechnung-item">
                  <p>Rechnung #{rechnung.id}: {rechnung.betrag} € - Status: {rechnung.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine Rechnungen verfügbar.</p>
          )}
        </div>
      ) : (
        <p>Kunde nicht gefunden.</p>
      )}
    </div>
  );
};

export default KundenAnzeigen;
