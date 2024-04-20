import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './KundenAnzeigen.scss';
import jsPDF from 'jspdf';
import logo from '../../logo.png';

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

  const generateConfirmationPDF = () => {
    if (selectedKunde) {
      const pdf = new jsPDF();
  
      // Logo hinzufügen
      const logoImg = new Image();
      logoImg.src = logo; // Pfade zum Logo anpassen
      logoImg.onload = function() {
        pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Position und Größe des Logos anpassen
  
        // Willkommenstext
        const welcomeText = `
          Herzlich Willkommen, ${selectedKunde.vorname} ${selectedKunde.nachname}!
        `;
        pdf.setFontSize(14);
        pdf.text(welcomeText, 20, 40);
  
        // Dankes-Text
        const thanksText = `
          Vielen Dank, dass Sie unsere Dienste in Anspruch genommen haben. 
          Wir schätzen Ihr Vertrauen und freuen uns darauf, Ihnen auch in Zukunft zur Verfügung zu stehen.
        `;
        pdf.setFontSize(12);
        pdf.text(thanksText, 20, 60);
  
        // Titel
        const title = `Kundenbestätigung`;
        pdf.setFontSize(18);
        pdf.text(title, 105, 90, null, null, 'center');
  
        // Kundeninformationen
        const customerInfo = `
          Kundennummer: ${selectedKunde.kundennummer}
          Vorname: ${selectedKunde.vorname}
          Nachname: ${selectedKunde.nachname}
          Strasse und Hausnummer: ${selectedKunde.strasseHausnummer}
          Postleitzahl: ${selectedKunde.postleitzahl}
          Ort: ${selectedKunde.ort}
          Email: ${selectedKunde.email}
          Telefon: ${selectedKunde.telefon}
          Mobil: ${selectedKunde.mobil}
          Geschlecht: ${selectedKunde.geschlecht}
          Auftragstyp: ${selectedKunde.auftragsTyp}
          Auftragsbeschreibung: ${selectedKunde.auftragsBeschreibung}
        `;
        pdf.setFontSize(12);
        pdf.text(customerInfo, 20, 110);
  
        // Datum
        const date = new Date().toLocaleDateString();
        pdf.text(`Datum: ${date}`, 20, pdf.internal.pageSize.height - 20);
  
        // Speichern des PDFs
        pdf.save(`Kundenbestätigung_${selectedKunde.vorname}_${selectedKunde.nachname}.pdf`);
      };
  
      // Fehlerbehandlung
      logoImg.onerror = function() {
        console.error('Fehler beim Laden des Logo-Bildes.');
      };
  
      pdf.onerror = function(error) {
        console.error('Fehler beim Generieren des PDFs:', error);
      };
    }
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
          <button onClick={generateConfirmationPDF}>Kundenbestätigung generieren</button>
        </div>

      ) : (
        <div>Kein Kunde gefunden</div>
      )}
    </div>
  );
};

export default KundenAnzeigen;
