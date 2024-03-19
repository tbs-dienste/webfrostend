import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../logo.png'; // Pfad zum Logo
import './Rechnung.scss'; // Importieren Sie das SCSS-Styling
import 'jspdf-autotable';
import JsBarcode from 'jsbarcode'; // Import JsBarcode für die Barcode-Generierung

const Rechnung = () => {
  const [kunden, setKunden] = useState([]);
  const [workSessions, setWorkSessions] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Kundendaten aus dem Local Storage abrufen
    const storedKunden = JSON.parse(localStorage.getItem('kunden')) || [];
    setKunden(storedKunden);
    
    // Arbeitszeiten aus dem Local Storage abrufen
    const storedSessions = JSON.parse(localStorage.getItem(`workSessions_${id}`)) || [];
    setWorkSessions(storedSessions);
  }, [id]);

  useEffect(() => {
    // Barcode generieren, wenn ein neuer Kunde erstellt wird
    if (kunden.length > 0) {
      const latestKunde = kunden[kunden.length - 1];
      generateBarcode(latestKunde.id.toString());
      // Kundendaten und Barcode im Local Storage speichern
      localStorage.setItem('kunden', JSON.stringify(kunden));
    }
  }, [kunden]);

  const createNewKunde = () => {
    // Neue Kunden-ID generieren
    const newId = kunden.length > 0 ? kunden[kunden.length - 1].id + 1 : 1;
    // Neuen Kunden erstellen
    const newKunde = {
      id: newId,
      name: `Kunde ${newId}`,
      // Weitere Kundendaten hier hinzufügen...
    };
    // Neuen Kunden zur Liste hinzufügen
    setKunden([...kunden, newKunde]);
  };

  const generateBarcode = (customerId) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, customerId, { format: 'CODE128' });
    // Barcode-Canvas-Element im Dokument einfügen
    const barcodeElement = document.getElementById('barcode');
    barcodeElement.innerHTML = '';
    barcodeElement.appendChild(canvas);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Logo oben links einfügen
    doc.addImage(logo, 'PNG', 10, 10, 50, 50); // X-Position: 10, Y-Position: 10, Breite: 50, Höhe: 50

    // Barcode generieren
    generateBarcode(id);

    // Fügen Sie die Rechnungsinformationen hinzu
    let startY = 80; // Start-Y-Position für den Text
    const lineHeight = 10; // Zeilenhöhe für den Text

    doc.setFontSize(12); // Setze die Schriftgröße

    // Barcode im PDF einfügen
    const barcodeDataURL = document.getElementById('barcode').getElementsByTagName('canvas')[0].toDataURL();
    doc.addImage(barcodeDataURL, 'JPEG', 10, startY, 50, 20); // X-Position: 10, Y-Position: startY, Breite: 50, Höhe: 20
    // Kundennummer unter dem Barcode im PDF anzeigen
    doc.text(`Kundennummer: ${id}`, 10, startY + 25); // Y-Position: startY + 25

    // Arbeitszeiten als Tabelle hinzufügen
    const tableColumns = ['Startzeit', 'Endzeit', 'Dauer (Stunden)', 'Preis (€)'];
    const tableRows = workSessions.map(session => [session.start, session.end, session.duration, session.price]);
    doc.autoTable(tableColumns, tableRows, { startY: startY + 35 });

    // Berechnen Sie Gesamtpreis und Gesamtstunden
    const totalPrice = workSessions.reduce((total, session) => total + parseFloat(session.price), 0);
    const totalHours = workSessions.reduce((total, session) => total + parseFloat(session.duration), 0);

    // Berechnen Sie die MWST 7.7% vom Gesamtpreis
    const mwst = totalPrice * 0.077;

    // Fügen Sie Gesamtpreis, Gesamtstunden und MWST hinzu
    startY += (2 + workSessions.length) * lineHeight;
    doc.text(`Total Preis: ${totalPrice.toFixed(2)} €`, 10, startY + 45); // 45px unterhalb der Tabelle
    doc.text(`Total Stunden: ${totalHours.toFixed(2)} Stunden`, 10, startY + 2 * lineHeight + 45); // 45px unterhalb der Tabelle
    doc.text(`MWST (7.7%): ${mwst.toFixed(2)} €`, 10, startY + 3 * lineHeight + 45); // 45px unterhalb der Tabelle

    // Speichern Sie das PDF-Dokument
    doc.save('rechnung.pdf');
  };

  return (
    <div className="rechnung-container">
      <h2 className="rechnung-title">Rechnung</h2>
      <div className="rechnung-content">
        <div className="rechnung-header">
          <img src={logo} alt="Logo" className="logoRechnung" />
          <div id="barcode"></div> {/* Container für den Barcode */}
        </div>
        <div className="rechnung-details">
          <p>Kundennummer: {id}</p> {/* Anzeigen der Kundennummer */}
          {/* Weitere Kundendetails hier */}
          <button onClick={createNewKunde}>Neuen Kunden erstellen</button>
          <button onClick={generatePDF}>Rechnung als PDF herunterladen</button>
        </div>
        <div className="arbeitszeiten">
          <h3>Arbeitszeiten</h3>
          <table>
            <thead>
              <tr>
                <th>Startzeit</th>
                <th>Endzeit</th>
                <th>Dauer (Stunden)</th>
                <th>Preis (€)</th>
              </tr>
            </thead>
            <tbody>
              {workSessions.map((session, index) => (
                <tr key={index}>
                  <td>{session.start}</td>
                  <td>{session.end}</td>
                  <td>{session.duration}</td>
                  <td>{session.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rechnung;
