import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import logo from '../../logo.png';
import './Rechnung.scss';

const Rechnung = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [arbeitszeiten, setArbeitszeiten] = useState([]);
  const [bearbeitenderMitarbeiter, setBearbeitenderMitarbeiter] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const kundenResponse = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
        setSelectedKunde(kundenResponse.data.data);

        const arbeitszeitenResponse = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/arbeitszeiten`);
        setArbeitszeiten(arbeitszeitenResponse.data.data);

        setIsFetching(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsFetching(false);
      }
    }

    fetchData();
  }, [id]);

  const generateBarcode = (kundennummer) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, kundennummer.toString(), { format: 'CODE128' });
    const barcodeElement = document.getElementById('barcode');
    barcodeElement.innerHTML = '';
    barcodeElement.appendChild(canvas);
  };

  const calculateTotalCosts = () => {
    if (!selectedKunde || arbeitszeiten.length === 0) return 0;

    let totalHours = 0;
    arbeitszeiten.forEach(zeit => {
      totalHours += parseFloat(zeit.arbeitsstunden);
    });

    if (selectedKunde && selectedKunde.stundensatz) {
      const totalCosts = totalHours * parseFloat(selectedKunde.stundensatz);
      return totalCosts.toFixed(2);
    }

    return 0;
  };

  const generatePDF = () => {
    if (!selectedKunde) return;

    const doc = new jsPDF();

    doc.addImage(logo, 'PNG', 15, 15, 50, 20);

    const barcodeCanvas = document.getElementById('barcode').getElementsByTagName('canvas')[0];
    const barcodeDataURL = barcodeCanvas.toDataURL();
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

    const totalCosts = calculateTotalCosts();

    doc.text(`Gesamtkosten: ${totalCosts} CHF`, descriptionX, descriptionY + 40);

    doc.save('rechnung.pdf');
  };

  const handleBearbeitenderMitarbeiterChange = (e) => {
    setBearbeitenderMitarbeiter(e.target.value);
  };

  if (isFetching) {
    return <p>Loading...</p>;
  }

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
          <h3>Positionen</h3>
          <table>
            <thead>
              <tr>
                <th>Beschreibung</th>
                <th>Arbeitsstunden</th>
                <th>Preis pro Stunde (CHF)</th>
                <th>Gesamtpreis (CHF)</th>
              </tr>
            </thead>
            <tbody>
              {arbeitszeiten.map((zeit, index) => (
                <tr key={index}>
                  <td>{`Position ${index + 1}`}</td>
                  <td>{zeit.arbeitsstunden}</td>
                  <td>{selectedKunde.stundensatz}</td>
                  <td>{(parseFloat(zeit.arbeitsstunden) * parseFloat(selectedKunde.stundensatz)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total: {calculateTotalCosts()} CHF</p>
        </div>
      </div>
    </div>
  );
};

export default Rechnung;
