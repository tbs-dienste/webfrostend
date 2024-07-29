import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './KundenAnzeigen.scss';

const KundenAnzeigen = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [previousState, setPreviousState] = useState({});
  const [loading, setLoading] = useState(true); // Definiere den Loading-Zustand

  useEffect(() => {
    async function fetchKunde() {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
        const kunde = response.data.data;
        if (kunde) {
          setSelectedKunde(kunde);
          setOriginalData(kunde);
          setEditedData(kunde);
          setPreviousState(kunde); // Speichern des ursprünglichen Zustands
        } else {
          console.error('Kunde nicht gefunden');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Kunden:', error);
        alert('Fehler beim Abrufen der Kundendaten. Bitte versuche es später noch einmal.');
      } finally {
        setLoading(false); // Setze den Loading-Zustand auf false, wenn die Daten geladen sind
      }
    }

    fetchKunde();
  }, [id]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, editedData);
      alert('Daten erfolgreich aktualisiert');
      setEditMode(false);
      setSelectedKunde(editedData);
      setOriginalData(editedData);
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
      alert('Fehler beim Speichern der Daten. Bitte versuche es später noch einmal.');
    }
  };

  const handleArchivieren = async () => {
    try {
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, { ...editedData, archiviert: true });
      alert('Kunde erfolgreich archiviert');
      setEditedData(prevData => ({ ...prevData, archiviert: true }));
    } catch (error) {
      console.error('Fehler beim Archivieren des Kunden:', error);
      alert('Fehler beim Archivieren des Kunden. Bitte versuche es später noch einmal.');
    }
  };

  const handleRechnungGestellt = async () => {
    try {
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, { ...editedData, rechnungGestellt: true });
      alert('Rechnung erfolgreich erstellt');
      setEditedData(prevData => ({ ...prevData, rechnungGestellt: true }));
    } catch (error) {
      console.error('Fehler beim Erstellen der Rechnung:', error);
      alert('Fehler beim Erstellen der Rechnung. Bitte versuche es später noch einmal.');
    }
  };

  const handleRechnungBezahlt = async () => {
    try {
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, { ...editedData, rechnungBezahlt: true });
      alert('Rechnung als bezahlt markiert');
      setEditedData(prevData => ({ ...prevData, rechnungBezahlt: true }));
    } catch (error) {
      console.error('Fehler beim Markieren der Rechnung als bezahlt:', error);
      alert('Fehler beim Markieren der Rechnung als bezahlt. Bitte versuche es später noch einmal.');
    }
  };

  const handleUndoRechnungGestellt = async () => {
    try {
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, { ...editedData, rechnungGestellt: false });
      alert('Rechnungserstellung rückgängig gemacht');
      setEditedData(prevData => ({ ...prevData, rechnungGestellt: false }));
    } catch (error) {
      console.error('Fehler beim Rückgängig-Machen der Rechnungserstellung:', error);
      alert('Fehler beim Rückgängig-Machen der Rechnungserstellung. Bitte versuche es später noch einmal.');
    }
  };

  const handleUndoRechnungBezahlt = async () => {
    try {
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, { ...editedData, rechnungBezahlt: false });
      alert('Rechnung als bezahlt rückgängig gemacht');
      setEditedData(prevData => ({ ...prevData, rechnungBezahlt: false }));
    } catch (error) {
      console.error('Fehler beim Rückgängig-Machen der Rechnung als bezahlt:', error);
      alert('Fehler beim Rückgängig-Machen der Rechnung als bezahlt. Bitte versuche es später noch einmal.');
    }
  };

  const handleUndo = () => {
    if (originalData) {
      setEditedData(originalData);
      setPreviousState(originalData); // Zurücksetzen auf den ursprünglichen Zustand
    }
  };

  if (loading) {
    return <div>Lade Kunde...</div>;
  }

  return (
    <div className="kunde-anzeigen-container">
      <div className="kunde-anzeigen">
        <h2>Kundendetails</h2>
        {selectedKunde ? (
          editMode ? (
            <>
              <label>
                Vorname:
                <input type="text" name="vorname" value={editedData.vorname} onChange={handleInputChange} />
              </label>
              <label>
                Nachname:
                <input type="text" name="nachname" value={editedData.nachname} onChange={handleInputChange} />
              </label>
              <label>
                Straße und Hausnummer:
                <input type="text" name="strasseHausnummer" value={editedData.strasseHausnummer} onChange={handleInputChange} />
              </label>
              <label>
                Postleitzahl:
                <input type="text" name="postleitzahl" value={editedData.postleitzahl} onChange={handleInputChange} />
              </label>
              <label>
                Ort:
                <input type="text" name="ort" value={editedData.ort} onChange={handleInputChange} />
              </label>
              <label>
                Land:
                <input type="text" name="land" value={editedData.land} onChange={handleInputChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={editedData.email} onChange={handleInputChange} />
              </label>
              <label>
                Telefon:
                <input type="tel" name="telefon" value={editedData.telefon} onChange={handleInputChange} />
              </label>
              <label>
                Mobil:
                <input type="tel" name="mobil" value={editedData.mobil} onChange={handleInputChange} />
              </label>
              <label>
                Geschlecht:
                <input type="text" name="geschlecht" value={editedData.geschlecht} onChange={handleInputChange} />
              </label>
              <label>
                Auftragstyp:
                <input type="text" name="auftragsTyp" value={editedData.auftragsTyp} onChange={handleInputChange} />
              </label>
              <label>
                Auftragsbeschreibung:
                <input type="text" name="auftragsBeschreibung" value={editedData.auftragsBeschreibung} onChange={handleInputChange} />
              </label>
              <label>
                Preis:
                <input type="text" name="preis" value={editedData.preis} onChange={handleInputChange} />
              </label>
              <label>
                IP-Adresse:
                <input type="text" name="ip_adresse" value={editedData.ip_adresse} onChange={handleInputChange} />
              </label>
              <button onClick={handleSave}>Speichern</button>
              <button onClick={handleUndo}>Rückgängig</button>
            </>
          ) : (
            <>
              <p><strong>Vorname:</strong> {selectedKunde.vorname}</p>
              <p><strong>Nachname:</strong> {selectedKunde.nachname}</p>
              <p><strong>Straße und Hausnummer:</strong> {selectedKunde.strasseHausnummer}</p>
              <p><strong>Postleitzahl:</strong> {selectedKunde.postleitzahl}</p>
              <p><strong>Ort:</strong> {selectedKunde.ort}</p>
              <p><strong>Land:</strong> {selectedKunde.land}</p>
              <p><strong>Email:</strong> {selectedKunde.email}</p>
              <p><strong>Telefon:</strong> {selectedKunde.telefon}</p>
              <p><strong>Mobil:</strong> {selectedKunde.mobil}</p>
              <p><strong>Geschlecht:</strong> {selectedKunde.geschlecht}</p>
              <p><strong>Auftragstyp:</strong> {selectedKunde.auftragsTyp}</p>
              <p><strong>Auftragsbeschreibung:</strong> {selectedKunde.auftragsBeschreibung}</p>
              <p><strong>Preis:</strong> {selectedKunde.preis}</p>
              <p><strong>IP-Adresse:</strong> {selectedKunde.ip_adresse}</p>
              <button onClick={handleEdit}>Bearbeiten</button>
              <button onClick={handleArchivieren}>Archivieren</button>
              <button onClick={handleRechnungGestellt}>Rechnung erstellen</button>
              {selectedKunde.rechnungGestellt && !selectedKunde.rechnungBezahlt && (
                <button onClick={handleRechnungBezahlt}>Rechnung bezahlt</button>
              )}
              {selectedKunde.rechnungGestellt && (
                <button onClick={handleUndoRechnungGestellt}>Rückgängig Rechnung erstellen</button>
              )}
              {selectedKunde.rechnungBezahlt && (
                <button onClick={handleUndoRechnungBezahlt}>Rückgängig Rechnung bezahlt</button>
              )}
            </>
          )
        ) : (
          <div>Keine Daten gefunden</div>
        )}
      </div>
    </div>
  );
};

export default KundenAnzeigen;
