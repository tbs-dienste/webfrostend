import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './KundenAnzeigen.scss';

const KundenAnzeigen = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({}); // Zustandsvariable für bearbeitete Daten

  useEffect(() => {
    async function fetchKunde() {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
        console.log('API-Daten:', response.data);
        setSelectedKunde(response.data.data[0]);
        setEditedData(response.data.data[0]); // Initialisiere bearbeitete Daten mit den aktuellen Daten
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Aktualisieren der bearbeiteten Daten mit den Eingaben des Benutzers
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Hier kannst du die bearbeiteten Daten speichern, z.B. eine API-Anfrage senden
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, editedData);
      console.log('Daten erfolgreich aktualisiert:', editedData);
      setEditMode(false);
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="kunde-anzeigen-container">
      <div className="kunde-anzeigen">
        <h2>Kundendetails</h2>
        {editMode ? (
          // Eingabefelder im Bearbeitungsmodus anzeigen
          <>
            <input type="text" name="vorname" value={editedData.vorname} onChange={handleInputChange} />
            <input type="text" name="nachname" value={editedData.nachname} onChange={handleInputChange} />
            <input type="text" name="strasseHausnummer" value={editedData.strasseHausnummer} onChange={handleInputChange} />
            <input type="text" name="postleitzahl" value={editedData.postleitzahl} onChange={handleInputChange} />
            <input type="text" name="ort" value={editedData.ort} onChange={handleInputChange} />
            <input type="text" name="email" value={editedData.email} onChange={handleInputChange} />
            <input type="text" name="telefon" value={editedData.telefon} onChange={handleInputChange} />
            <input type="text" name="mobil" value={editedData.mobil} onChange={handleInputChange} />
            <input type="text" name="geschlecht" value={editedData.geschlecht} onChange={handleInputChange} />
            <input type="text" name="auftragsTyp" value={editedData.auftragsTyp} onChange={handleInputChange} />
            <input type="text" name="auftragsBeschreibung" value={editedData.auftragsBeschreibung} onChange={handleInputChange} />
            <input type="text" name="preis" value={editedData.preis} onChange={handleInputChange} />
            <input type="text" name="ip_adresse" value={editedData.ip_adresse} onChange={handleInputChange} />
          </>
        ) : (
          // Anzeigen im Anzeigemodus anzeigen
          <>
            <p><strong>Vorname:</strong> {selectedKunde.vorname}</p>
            <p><strong>Nachname:</strong> {selectedKunde.nachname}</p>
            <p><strong>Strasse und Hausnummer:</strong> {selectedKunde.strasseHausnummer}</p>
            <p><strong>Postleitzahl:</strong> {selectedKunde.postleitzahl}</p>
            <p><strong>Ort:</strong> {selectedKunde.ort}</p>
            <p><strong>Email:</strong> {selectedKunde.email}</p>
            <p><strong>Telefon:</strong> {selectedKunde.telefon}</p>
            <p><strong>Mobil:</strong> {selectedKunde.mobil}</p>
            <p><strong>Geschlecht:</strong> {selectedKunde.geschlecht}</p>
            <p><strong>Auftragstyp:</strong> {selectedKunde.auftragsTyp}</p>
            <p><strong>Auftragsbeschreibung:</strong> {selectedKunde.auftragsBeschreibung}</p>
            <p><strong>Preis:</strong> {selectedKunde.preis}</p>
            <p><strong>IP-Adresse:</strong> {selectedKunde.ip_adresse}</p>
          </>
        )}
        {editMode ? (
          // Anzeigen der Speichern-Schaltfläche im Bearbeitungsmodus
          <button onClick={handleSave}>Speichern</button>
        ) : (
          // Anzeigen des Bearbeiten-Buttons im Anzeigemodus
          <button onClick={handleEdit}>Bearbeiten</button>
        )}
      </div>
    </div>
  );
};

export default KundenAnzeigen;
