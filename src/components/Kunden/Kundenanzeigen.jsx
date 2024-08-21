import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaUndo, FaArchive, FaFileInvoice, FaCheck, FaTimes } from 'react-icons/fa';
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
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
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

  const handleEdit = () => setEditMode(true);

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
      const url = editedData.archiviert
        ? `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/unarchive`
        : `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/archive`;
      
      const response = await axios.post(url);

      if (response.data.status === 'success') {
        const updatedData = { ...editedData, archiviert: !editedData.archiviert };
        setEditedData(updatedData);
        alert(updatedData.archiviert ? 'Kunde erfolgreich archiviert' : 'Kunde erfolgreich reaktiviert');
      } else {
        alert('Fehler beim Archivieren des Kunden');
      }
    } catch (error) {
      console.error('Fehler beim Archivieren des Kunden:', error);
      alert('Fehler beim Archivieren des Kunden. Bitte versuche es später noch einmal.');
    }
  };

  const handleRechnungGestellt = async () => {
    try {
      const updatedData = { ...editedData, rechnungGestellt: !editedData.rechnungGestellt };
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, updatedData);
      alert(updatedData.rechnungGestellt ? 'Rechnung erfolgreich erstellt' : 'Rechnungserstellung rückgängig gemacht');
      setEditedData(updatedData);
    } catch (error) {
      console.error('Fehler beim Erstellen der Rechnung:', error);
      alert('Fehler beim Erstellen der Rechnung. Bitte versuche es später noch einmal.');
    }
  };

  const handleRechnungBezahlt = async () => {
    try {
      const updatedData = { ...editedData, rechnungBezahlt: !editedData.rechnungBezahlt };
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, updatedData);
      alert(updatedData.rechnungBezahlt ? 'Rechnung als bezahlt markiert' : 'Rechnung als bezahlt rückgängig gemacht');
      setEditedData(updatedData);
    } catch (error) {
      console.error('Fehler beim Markieren der Rechnung als bezahlt:', error);
      alert('Fehler beim Markieren der Rechnung als bezahlt. Bitte versuche es später noch einmal.');
    }
  };

  const handleUndo = () => {
    if (originalData) {
      setEditedData(originalData);
    }
  };

  if (loading) {
    return <div className="loading">Lade Kunde...</div>;
  }

  const getArchivierenButtonText = () => editedData.archiviert ? 'Reaktivieren' : 'Archivieren';
  const getRechnungGestelltButtonText = () => editedData.rechnungGestellt ? 'Rückgängig Rechnung erstellen' : 'Rechnung erstellen';
  const getRechnungBezahltButtonText = () => editedData.rechnungBezahlt ? 'Rückgängig Rechnung bezahlt' : 'Rechnung bezahlt';

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
              <button onClick={handleSave} className="save-button"><FaSave /> Speichern</button>
              <button onClick={handleUndo} className="undo-button"><FaUndo /> Rückgängig</button>
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
              <p><strong>Code:</strong> {selectedKunde.code}</p>
              <button onClick={handleEdit} className="edit-button">Bearbeiten</button>
              <button onClick={handleArchivieren} className="archive-button"><FaArchive /> {getArchivierenButtonText()}</button>
              <button onClick={handleRechnungGestellt} className="invoice-button"><FaFileInvoice /> {getRechnungGestelltButtonText()}</button>
              
              {editedData.rechnungGestellt && !editedData.rechnungBezahlt && (
                <button onClick={handleRechnungBezahlt} className="paid-button"><FaCheck /> {getRechnungBezahltButtonText()}</button>
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
