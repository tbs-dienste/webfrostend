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
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
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
      const response = await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, formData);
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
      logoImg.onload = function () {
        pdf.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Position und Größe des Logos anpassen

        // Setze die Schriftart und die Grundlinie
        pdf.setFont('helvetica');
        pdf.setFontSize(12);
        pdf.setTextColor(40);

        // Hinzufügen von Kundendetails in einem professionellen Layout
        const addressBlock = `
${selectedKunde.vorname} ${selectedKunde.nachname}
${selectedKunde.strasseHausnummer}
${selectedKunde.postleitzahl} ${selectedKunde.ort}
${selectedKunde.email}
${selectedKunde.telefon ? `Telefon: ${selectedKunde.telefon}` : ''}
${selectedKunde.mobil ? `Mobil: ${selectedKunde.mobil}` : ''}
        `.trim();

        pdf.text(addressBlock, 10, 50);

        // Titel hinzufügen
        pdf.setFontSize(18);
        pdf.setTextColor(0);
        pdf.text('Kundenbestätigung', 105, 80, null, null, 'center');

        // Einführungstext
        pdf.setFontSize(12);
        pdf.setTextColor(40);
        const introduction = `
Sehr geehrte/r ${selectedKunde.vorname} ${selectedKunde.nachname},

wir freuen uns, Sie als neuen Kunden begrüßen zu dürfen. 
Im Folgenden finden Sie eine Übersicht Ihrer Kundendaten:
        `;
        pdf.text(introduction, 10, 90);

        // Kundeninformationen
        const customerInfo = [
          `Kundennummer: ${selectedKunde.kundennummer}`,
          `Vorname: ${selectedKunde.vorname}`,
          `Nachname: ${selectedKunde.nachname}`,
          `Straße und Hausnummer: ${selectedKunde.strasseHausnummer}`,
          `Postleitzahl: ${selectedKunde.postleitzahl}`,
          `Ort: ${selectedKunde.ort}`,
          `Email: ${selectedKunde.email}`,
          `Telefon: ${selectedKunde.telefon}`,
          `Mobil: ${selectedKunde.mobil}`,
          `Geschlecht: ${selectedKunde.geschlecht}`,
          `Auftragstyp: ${selectedKunde.auftragsTyp}`,
          `Auftragsbeschreibung: ${selectedKunde.auftragsBeschreibung}`
        ];

        let yPosition = 110;
        customerInfo.forEach((line) => {
          pdf.text(line, 10, yPosition);
          yPosition += 10;
        });

        // Datum
        const today = new Date();
        const date = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const dateText = `Datum: ${date}`;
        pdf.text(dateText, 10, yPosition + 10);

        // Abschlusstext
        pdf.text(`
Mit freundlichen Grüßen,

Ihr Service-Team
        `, 10, yPosition + 30);

        // PDF speichern
        pdf.save(`Kundenbestätigung_${selectedKunde.kundennummer}.pdf`);
      };
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="kunde-anzeigen-container">
      {selectedKunde ? (
        <div className="kunde-anzeigen">
          <h2>Kundendetails</h2>
          {editMode ? (
            <div className="kunden-form">
              <label>
                Vorname:
                <input type="text" name="vorname" value={formData.vorname} onChange={handleChange} />
              </label>
              <label>
                Nachname:
                <input type="text" name="nachname" value={formData.nachname} onChange={handleChange} />
              </label>
              <label>
                Straße und Hausnummer:
                <input type="text" name="strasseHausnummer" value={formData.strasseHausnummer} onChange={handleChange} />
              </label>
              <label>
                Postleitzahl:
                <input type="text" name="postleitzahl" value={formData.postleitzahl} onChange={handleChange} />
              </label>
              <label>
                Ort:
                <input type="text" name="ort" value={formData.ort} onChange={handleChange} />
              </label>
              <label>
                E-Mail:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>
              <label>
                Telefon:
                <input type="text" name="telefon" value={formData.telefon} onChange={handleChange} />
              </label>
              <label>
                Mobil:
                <input type="text" name="mobil" value={formData.mobil} onChange={handleChange} />
              </label>
              <label>
                Geschlecht:
                <select name="geschlecht" value={formData.geschlecht} onChange={handleChange}>
                  <option value="männlich">Männlich</option>
                  <option value="weiblich">Weiblich</option>
                  <option value="divers">Divers</option>
                </select>
              </label>
              <label>
                Auftragstyp:
                <input type="text" name="auftragsTyp" value={formData.auftragsTyp} onChange={handleChange} />
              </label>
              <label>
                Auftragsbeschreibung:
                <input type="text" name="auftragsBeschreibung" value={formData.auftragsBeschreibung} onChange={handleChange} />
              </label>
              <div className="button-group">
                <button onClick={handleSubmit}>Speichern</button>
                <button onClick={handleCancel}>Abbrechen</button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Kundennummer:</strong> {selectedKunde.kundennummer}</p>
              <p><strong>Vorname:</strong> {selectedKunde.vorname}</p>
              <p><strong>Nachname:</strong> {selectedKunde.nachname}</p>
              <p><strong>Straße und Hausnummer:</strong> {selectedKunde.strasseHausnummer}</p>
              <p><strong>Postleitzahl:</strong> {selectedKunde.postleitzahl}</p>
              <p><strong>Ort:</strong> {selectedKunde.ort}</p>
              <p><strong>E-Mail:</strong> {selectedKunde.email}</p>
              <p><strong>Telefon:</strong> {selectedKunde.telefon}</p>
              <p><strong>Mobil:</strong> {selectedKunde.mobil}</p>
              <p><strong>Geschlecht:</strong> {selectedKunde.geschlecht}</p>
              <p><strong>Auftragstyp:</strong> {selectedKunde.auftragsTyp}</p>
              <p><strong>Auftragsbeschreibung:</strong> {selectedKunde.auftragsBeschreibung}</p>
              <div className="button-group">
                <button onClick={handleZuruck}>Zurück</button>
                <button onClick={handleEdit}>Bearbeiten</button>
                <button onClick={generateConfirmationPDF}>Bestätigung PDF generieren</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Kein Kunde gefunden.</p>
      )}
    </div>
  );
};

export default KundenAnzeigen;
