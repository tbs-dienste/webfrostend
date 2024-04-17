import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './KundenAnzeigen.scss';

const KundenAnzeigen = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchKunde() {
      try {
        const response = await axios.get(`https://backend-1-cix8.onrender.com/api/v1/kunden/${id}`);
        console.log('API-Daten:', response.data);
        setSelectedKunde(response.data.data[0]);
        setFormData(response.data.data[0]); // Setze das Formular-Daten-Objekt initial mit den Daten des Kunden
        setLoading(false);
      } catch (error) {
        console.error('Error fetching kunde:', error);
        setLoading(false);
      }
    }

    fetchKunde();
  }, [id]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    // Setze das Formular-Daten-Objekt zurück auf die ursprünglichen Kundendaten
    setFormData(selectedKunde);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`https://backend-1-cix8.onrender.com/api/v1/kunden/${id}`, formData);
      console.log('Kunde erfolgreich aktualisiert:', response.data);
      setEditMode(false);
      // Aktualisiere die Kundendaten nach dem Speichern
      setSelectedKunde(formData);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Kunden:', error);
    }
  };

  const handleZuruck = () => {
    window.location.href = `/kunden`; // Hier entsprechend die URL anpassen
  };


  const handleRechnungStellen = async () => {
    try {
      const updatedKunde = { ...selectedKunde, rechnungGestellt: !selectedKunde.rechnungGestellt };
      await axios.put(`https://backend-1-cix8.onrender.com/api/v1/kunden/${id}`, updatedKunde);
      setSelectedKunde(updatedKunde);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Rechnungsstatus:', error);
    }
  };

  const handleRechnungBezahlen = async () => {
    try {
      const updatedKunde = { ...selectedKunde, rechnungBezahlt: !selectedKunde.rechnungBezahlt };
      await axios.put(`https://backend-1-cix8.onrender.com/api/v1/kunden/${id}`, updatedKunde);
      setSelectedKunde(updatedKunde);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Rechnungsstatus:', error);
    }
  };

  return (
    <div className="kunden-anzeigen">
      {loading ? (
        <p>Lade Kunden...</p>
      ) : selectedKunde ? (
        <div>
          <button onClick={handleZuruck} className="zuruck-button">Zurück</button>
          <div className="info">
            <p><span>Kundennummer:</span> {editMode ? <input type="text" name="kundennummer" value={formData.kundennummer || ""} onChange={handleChange} /> : selectedKunde.kundennummer}</p>
            <p><span>Vorname:</span> {editMode ? <input type="text" name="vorname" value={formData.vorname || ""} onChange={handleChange} /> : selectedKunde.vorname}</p>
            <p><span>Nachname:</span> {editMode ? <input type="text" name="nachname" value={formData.nachname || ""} onChange={handleChange} /> : selectedKunde.nachname}</p>
            <p><span>Strasse und Hausnummer:</span> {editMode ? <input type="text" name="strasseHausnummer" value={formData.strasseHausnummer || ""} onChange={handleChange} /> : selectedKunde.strasseHausnummer}</p>
            <p><span>Postleitzahl:</span> {editMode ? <input type="text" name="postleitzahl" value={formData.postleitzahl || ""} onChange={handleChange} /> : selectedKunde.postleitzahl}</p>
            <p><span>Ort:</span> {editMode ? <input type="text" name="ort" value={formData.ort || ""} onChange={handleChange} /> : selectedKunde.ort}</p>
            <p><span>Email:</span> {editMode ? <input type="text" name="email" value={formData.email || ""} onChange={handleChange} /> : selectedKunde.email}</p>
            <p><span>Telefon:</span> {editMode ? <input type="text" name="telefon" value={formData.telefon || ""} onChange={handleChange} /> : selectedKunde.telefon}</p>
            <p><span>Mobil:</span> {editMode ? <input type="text" name="mobil" value={formData.mobil || ""} onChange={handleChange} /> : selectedKunde.mobil}</p>
            <p><span>Geschlecht:</span> {editMode ? <input type="text" name="geschlecht" value={formData.geschlecht || ""} onChange={handleChange} /> : selectedKunde.geschlecht}</p>
            <p><span>Auftragstyp:</span> {editMode ? <input type="text" name="auftragsTyp" value={formData.auftragsTyp || ""} onChange={handleChange} /> : selectedKunde.auftragsTyp}</p>
            <p><span>Auftragsbeschreibung:</span> {editMode ? <input type="text" name="auftragsBeschreibung" value={formData.auftragsBeschreibung || ""} onChange={handleChange} /> : selectedKunde.auftragsBeschreibung}</p>
            {editMode ? (
              <div className="edit-buttons">
                <button className="save" onClick={handleSubmit}>Speichern</button>
                <button className="cancel" onClick={handleCancel}>Abbrechen</button>
              </div>
            ) : (
             <div>
                <button onClick={handleEdit}>Bearbeiten</button>
                {/* Rechnung stellen Button */}
                <button onClick={handleRechnungStellen}>
                  {selectedKunde.rechnungGestellt ? 'Rechnung rückgängig' : 'Rechnung stellen'}
                </button>
                {/* Rechnung bezahlen Button */}
                <button onClick={handleRechnungBezahlen}>
                  {selectedKunde.rechnungBezahlt ? 'Zahlung rückgängig' : 'Rechnung bezahlen'}
                </button>
              </div>

            )}

          </div>
        </div>

      ) : (
        <div>Kein Kunde gefunden</div>
      )}
    </div>
  );
};

export default KundenAnzeigen;
