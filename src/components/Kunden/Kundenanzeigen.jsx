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
              {[
                { label: 'Kundennummer', name: 'kundennummer' },
                { label: 'Firma', name: 'firma' },
                { label: 'Vorname', name: 'vorname' },
                { label: 'Nachname', name: 'nachname' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Mobil', name: 'mobil', type: 'tel' },
                { label: 'Adresse', name: 'strasseHausnummer' },
                { label: 'PLZ', name: 'postleitzahl' },
                { label: 'Ort', name: 'ort' }
              ].map(({ label, name, type = 'text' }) => (
                <div className="input-group" key={name}>
                  <label>{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={editedData[name] || ''}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="button-group">
                <button onClick={handleSave}><FaSave /> Speichern</button>
                <button onClick={handleUndo}><FaUndo /> Änderungen zurücksetzen</button>
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
              <button onClick={handleEdit}><FaEdit /> Bearbeiten</button>
            </div>
          )}

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

          {selectedKunde.status === 'abgeschlossen' && (
            <>
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
            </>
          )}

          <div className="link-button-container">
            <Link to={`/arbeitszeiten/${id}`} className="link-button">
              Arbeitszeiten anzeigen
            </Link>
          </div>

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

          <div className="dienstleistungen-container">
            <h3>Unterschrift</h3>
            {selectedKunde.unterschrift ? (
              <img
                src={`data:image/png;base64,${selectedKunde.unterschrift}`}
                alt="Unterschrift"
                className="unterschrift-bild"
              />
            ) : (
              <p>Keine Unterschrift vorhanden.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Kunde nicht gefunden.</p>
      )}
    </div>
  );
};

export default KundenAnzeigen;
