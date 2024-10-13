import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaUndo, FaEdit } from 'react-icons/fa';
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
    setEditedData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, editedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Serverantwort:', response);
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
              {/* Hier die Eingabefelder für die Kundendetails */}
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
                <label>Straße und Hausnummer:</label>
                <input
                  type="text"
                  name="strasseHausnummer"
                  value={editedData.strasseHausnummer || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Postleitzahl:</label>
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
              <div className="input-group">
                <label>Land:</label>
                <input
                  type="text"
                  name="land"
                  value={editedData.land || ''}
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
                  type="text"
                  name="mobil"
                  value={editedData.mobil || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Geschlecht:</label>
                <input
                  type="text"
                  name="geschlecht"
                  value={editedData.geschlecht || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>IP-Adresse:</label>
                <input
                  type="text"
                  name="ip_adresse"
                  value={editedData.ip_adresse || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Code:</label>
                <input
                  type="text"
                  name="code"
                  value={editedData.code || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Auftragsnummer:</label>
                <input
                  type="text"
                  name="auftragsnummer"
                  value={editedData.auftragsnummer || ''}
                  onChange={handleInputChange}
                />
              </div>

              <button onClick={handleSave}><FaSave /> Speichern</button>
              <button onClick={handleUndo}><FaUndo /> Änderungen zurücksetzen</button>
            </div>
          ) : (
            <div>
              {/* Hier die Anzeige der Kundendetails */}
              <p><strong>Kundennummer:</strong> {selectedKunde.kundennummer}</p>
              <p><strong>Firma:</strong> {selectedKunde.firma}</p>
              <p><strong>Vorname:</strong> {selectedKunde.vorname}</p>
              <p><strong>Nachname:</strong> {selectedKunde.nachname}</p>
              <p><strong>Straße und Hausnummer:</strong> {selectedKunde.strasseHausnummer}</p>
              <p><strong>Postleitzahl:</strong> {selectedKunde.postleitzahl}</p>
              <p><strong>Ort:</strong> {selectedKunde.ort}</p>
              <p><strong>Land:</strong> {selectedKunde.land}</p>
              <p><strong>Email:</strong> {selectedKunde.email}</p>
              <p><strong>Mobil:</strong> {selectedKunde.mobil}</p>
              <p><strong>Geschlecht:</strong> {selectedKunde.geschlecht}</p>
              <p><strong>IP-Adresse:</strong> {selectedKunde.ip_adresse}</p>
              <p><strong>Code:</strong> {selectedKunde.code}</p>
              <p><strong>Auftragsnummer:</strong> {selectedKunde.auftragsnummer}</p>
              
              {/* Annahme: selectedKunde.dienstleistungen ist ein Array */}
              <p><strong>Dienstleistungen:</strong> 
                {selectedKunde.dienstleistungen && Array.isArray(selectedKunde.dienstleistungen)
                  ? selectedKunde.dienstleistungen.map((dienstleistung, index) => (
                      <span key={index}>{dienstleistung.title}{index < selectedKunde.dienstleistungen.length - 1 ? ', ' : ''}</span>
                    ))
                  : 'Keine Dienstleistungen verfügbar.'}
              </p>

              <button onClick={handleEdit}><FaEdit /> Bearbeiten</button>
            </div>
          )}
        </div>
      ) : (
        <p>Keine Kundendaten gefunden.</p>
      )}
    </div>
  );
};

export default KundenAnzeigen;
