import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import logo from '../../logo.png';
import './Rechnung.scss';

const Rechnung = () => {
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [bearbeitenderMitarbeiter, setBearbeitenderMitarbeiter] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function fetchKundenData() {
      try {
        const response = await axios.get(`https://backend-1-cix8.onrender.com/api/v1/kunden/${id}`);
        setSelectedKunde(response.data.data);
      } catch (error) {
        console.error('Error fetching kunden data:', error);
      }
    }

    fetchKundenData();
  }, [id]);

  useEffect(() => {
    if (selectedKunde) {
      generateBarcode(selectedKunde.kundennummer.toString());
    }
  }, [selectedKunde]);

  const generateBarcode = (kundennummer) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, kundennummer, { format: 'CODE128' });
    const barcodeElement = document.getElementById('barcode');
    barcodeElement.innerHTML = '';
    barcodeElement.appendChild(canvas);
  };

  const generatePDF = () => {
    if (!selectedKunde) return;

    const doc = new jsPDF();

    doc.addImage(logo, 'PNG', 15, 15, 50, 20);

    const barcodeDataURL = document.getElementById('barcode').getElementsByTagName('canvas')[0].toDataURL();
    const barcodeWidth = 50;
    const barcodeHeight = 20;
    const pdfWidth = doc.internal.pageSize.getWidth();
    const barcodeX = pdfWidth - barcodeWidth - 15;

    doc.addImage(barcodeDataURL, 'JPEG', barcodeX, 15, barcodeWidth, barcodeHeight);

    const today = new Date();
    const invoiceDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    doc.setFontSize(12);
    doc.setTextColor('#0a8e77');
    doc.text(`Rechnungsdatum: ${invoiceDate}`, barcodeX, 40);
    doc.text(`Rechnungsnummer: ${Math.floor(Math.random() * 100000)}`, barcodeX, 45);

    const addressX = 15;
    const addressY = 50;
    doc.setFontSize(10);
    doc.text(`${selectedKunde.geschlecht === 'Männlich' ? 'Herr' : 'Frau'} ${selectedKunde.nachname}`, addressX, addressY);
    doc.text(selectedKunde.vorname, addressX, addressY + 5);
    doc.text(selectedKunde.strasseHausnummer, addressX, addressY + 10);
    doc.text(`${selectedKunde.postleitzahl} ${selectedKunde.ort}`, addressX, addressY + 15);

    doc.setLineWidth(0.5);
    doc.line(15, 45, pdfWidth - 15, 45);

    const bearbeiterY = 70;
    doc.setLineWidth(0.5);
    doc.line(15, bearbeiterY + 5, pdfWidth - 15, bearbeiterY + 5);
    doc.setTextColor('#333');
    doc.text(`Bearbeitender Mitarbeiter: ${bearbeitenderMitarbeiter}`, 15, bearbeiterY);

    doc.setLineWidth(0.5);
    doc.line(15, bearbeiterY + 5, pdfWidth - 15, bearbeiterY + 5);

    const descriptionX = 15;
    const descriptionY = bearbeiterY + 20;
    const description = `Sehr geehrte/r ${selectedKunde.geschlecht === 'Männlich' ? 'Herr' : 'Frau'} ${selectedKunde.nachname},\n\nVielen Dank für Ihre geschätzte Zusammenarbeit. Anbei finden Sie die Rechnung für erbrachte Dienstleistungen.\n\nSollten Sie Fragen zu den aufgeführten Positionen haben, stehen wir Ihnen gerne zur Verfügung.`;
    doc.setFontSize(10);
    doc.text(description, descriptionX, descriptionY);

    // Weitere PDF-Inhalte hinzufügen

    doc.save('rechnung.pdf');
  };

  const handleBearbeitenderMitarbeiterChange = (e) => {
    setBearbeitenderMitarbeiter(e.target.value);
  };

  return (
    <div className="rechnung-container">
      <h2 className="rechnung-title">Rechnung</h2>
      <div className="rechnung-content">
        <div className="rechnung-header">
          <img src={logo} alt="Logo" className="logoRechnung" />
          <div id="barcode"></div>
        </div>
        <div className="rechnung-details">
          {selectedKunde ? (
            <>
              <p>{selectedKunde.geschlecht === 'Männlich' ? 'Herr' : 'Frau'} {selectedKunde.nachname}, {selectedKunde.vorname}</p>
              <p>{selectedKunde.strasseHausnummer}</p>
              <p>{selectedKunde.postleitzahl} {selectedKunde.ort}</p>
              <p>Kundennummer: {selectedKunde.kundennummer}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
          <label htmlFor="bearbeiterSelect">Bearbeitender Mitarbeiter: </label>
          <select id="bearbeiterSelect" onChange={handleBearbeitenderMitarbeiterChange} value={bearbeitenderMitarbeiter}>
            <option value="">Bitte wählen</option>
            {/* Mitarbeiteroptionen hier rendern */}
          </select>
          <button onClick={generatePDF}>Rechnung als PDF herunterladen</button>
        </div>
        <div className="arbeitszeiten">
          {/* Tabelle für die Arbeitszeiten hier rendern */}
        </div>
      </div>
    </div>
  );
};

export default Rechnung;
