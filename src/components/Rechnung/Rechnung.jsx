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
  const [selectedKunde, setSelectedKunde] = useState(null); // Hinzugefügt, um den ausgewählten Kunden zu verfolgen
  const [bearbeitenderMitarbeiter, setBearbeitenderMitarbeiter] = useState(''); // Mitarbeiter, der die Rechnung bearbeitet hat
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]); // Liste der Mitarbeiter aus dem Local Storage
  const { id } = useParams();

  useEffect(() => {
    // Kundendaten aus dem Local Storage abrufen
    const storedKunden = JSON.parse(localStorage.getItem('kunden')) || [];
    setKunden(storedKunden);

    // Arbeitszeiten aus dem Local Storage abrufen
    const storedSessions = JSON.parse(localStorage.getItem(`workSessions_${id}`)) || [];
    setWorkSessions(storedSessions);

    // Wählen Sie den Kunden anhand der ID aus
    const selected = storedKunden.find(kunde => kunde.id === parseInt(id));
    setSelectedKunde(selected);

    // Mitarbeiterliste aus dem Local Storage abrufen
    const storedMitarbeiterListe = JSON.parse(localStorage.getItem('mitarbeiter')) || [];
    setMitarbeiterListe(storedMitarbeiterListe);
  }, [id]);

  useEffect(() => {
    // Barcode generieren, wenn ein Kunde ausgewählt wurde
    if (selectedKunde) {
      generateBarcode(selectedKunde.kundennummer.toString());
    }
  }, [selectedKunde]);

  const generateBarcode = (kundennummer) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, kundennummer, { format: 'CODE128' });
    // Barcode-Canvas-Element im Dokument einfügen
    const barcodeElement = document.getElementById('barcode');
    barcodeElement.innerHTML = '';
    barcodeElement.appendChild(canvas);
  };

  const generatePDF = () => {
    if (!selectedKunde) return; // Sicherstellen, dass ein Kunde ausgewählt ist
  
    const doc = new jsPDF();
  
    // Logo oben links einfügen
    doc.addImage(logo, 'PNG', 15, 15, 50, 20); // X-Position: 15, Y-Position: 15, Breite: 50, Höhe: 20
  
    // Barcode generieren
    generateBarcode(selectedKunde.kundennummer.toString());
  
    // Barcode im PDF einfügen
    const barcodeDataURL = document.getElementById('barcode').getElementsByTagName('canvas')[0].toDataURL();
    const barcodeWidth = 50;
    const barcodeHeight = 20;
    const logoWidth = 50; // Breite des Logos
    const pdfWidth = doc.internal.pageSize.getWidth();
  
    // Position des Barcodes (ganz rechts oben)
    const barcodeX = pdfWidth - barcodeWidth - 15; // 15px Abstand vom rechten Rand
    doc.addImage(barcodeDataURL, 'JPEG', barcodeX, 15, barcodeWidth, barcodeHeight);
  
    // Rechnungsdatum und -nummer
    const invoiceInfoX = pdfWidth - barcodeWidth - 15; // Unter dem Barcode
    const invoiceInfoY = 40; // Abstand vom oberen Rand
    const today = new Date();
    const invoiceDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    doc.setFontSize(12); // Setze die Schriftgröße für die Rechnungsinformationen
    doc.setTextColor('#0a8e77'); // Farbe für die Rechnungsinformationen
    doc.text(`Rechnungsdatum: ${invoiceDate}`, invoiceInfoX, invoiceInfoY);
    doc.text(`Rechnungsnummer: ${Math.floor(Math.random() * 100000)}`, invoiceInfoX, invoiceInfoY + 5);
  
    // Adresse des Kunden unter dem Barcode
    const addressX = 15; // Abstand vom linken Rand
    const addressY = 50; // Abstand vom oberen Rand nach dem Logo und Barcode
    doc.setFontSize(10); // Setze die Schriftgröße für die Adresse
    doc.text(`${selectedKunde.geschlecht === 'Männlich' ? 'Herr' : 'Frau'} ${selectedKunde.nachname}`, addressX, addressY);
    doc.text(selectedKunde.vorname, addressX, addressY + 5);
    doc.text(selectedKunde.strasseHausnummer, addressX, addressY + 10);
    doc.text(`${selectedKunde.postleitzahl} ${selectedKunde.ort}`, addressX, addressY + 15);
  
    // Trennlinie zwischen Adresse und Rechnungsinformationen
    doc.setLineWidth(0.5);
    doc.line(15, 45, pdfWidth - 15, 45);
  
    // Anzeige des bearbeitenden Mitarbeiters
    const bearbeiterX = 15; // Abstand vom linken Rand
    const bearbeiterY = invoiceInfoY + 30; // Position unterhalb der Rechnungsinformationen
   
    doc.setLineWidth(0.5);
    doc.line(15, bearbeiterY + 5, pdfWidth - 15, bearbeiterY + 5);
    doc.setTextColor('#333'); // Farbe für den bearbeitenden Mitarbeiter
    doc.text(`Bearbeitender Mitarbeiter: ${bearbeitenderMitarbeiter}`, bearbeiterX, bearbeiterY);
  
    // Trennlinie zwischen Mitarbeiter und Text zur Rechnung
    doc.setLineWidth(0.5);
    doc.line(15, bearbeiterY + 5, pdfWidth - 15, bearbeiterY + 5);
  
    // Text zur Rechnung hinzufügen
    const descriptionX = 15; // Abstand vom linken Rand
    const descriptionY = bearbeiterY + 20; // Position unterhalb des bearbeitenden Mitarbeiters
    const description = `Sehr geehrte/r ${selectedKunde.geschlecht === 'Männlich' ? 'Herr' : 'Frau'} ${selectedKunde.nachname},\n\nVielen Dank für Ihre geschätzte Zusammenarbeit. Anbei finden Sie die Rechnung für erbrachte Dienstleistungen.\n\nSollten Sie Fragen zu den aufgeführten Positionen haben, stehen wir Ihnen gerne zur Verfügung.`;
    doc.setFontSize(10); // Setze die Schriftgröße für die Beschreibung
    doc.text(description, descriptionX, descriptionY);
  
    // Arbeitszeiten als Tabelle hinzufügen
    const tableColumns = ['Startzeit', 'Endzeit', 'Dauer (Stunden)', 'Preis (€)'];
    const tableRows = workSessions.map(session => [session.start, session.end, session.duration, session.price]);
    const tableY = descriptionY + 50; // Position unterhalb der Beschreibung
  
    // Stil für die Tabellenzellen definieren
    const tableCellStyle = {
      fillColor: '#ffffff', // Hintergrundfarbe der Zellen
      textColor: '#333333', // Textfarbe der Zellen
      lineWidth: 0.5, // Linienbreite der Zellen
    };
  
    // Stil für die Tabellenüberschriften definieren
    const tableHeaderStyle = {
      fillColor: '#0a8e77', // Hintergrundfarbe der Überschriften
      textColor: '#ffffff', // Textfarbe der Überschriften
      lineWidth: 0.5, // Linienbreite der Überschriften
    };
  
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: tableY,
      styles: {
        cell: tableCellStyle,
        head: tableHeaderStyle,
      },
    });
  
  

    // Berechnen Sie Gesamtpreis und Gesamtstunden
    const totalPrice = workSessions.reduce((total, session) => total + parseFloat(session.price), 0);
    const totalHours = workSessions.reduce((total, session) => total + parseFloat(session.duration), 0);

    // Berechnen Sie die MWST 7.7% vom Gesamtpreis
    const mwst = totalPrice * 0.077;

    // Fügen Sie Gesamtpreis, Gesamtstunden und MWST hinzu
    const summaryX = pdfWidth - 70; // Abstand vom rechten Rand
    const summaryY = doc.autoTable.previous.finalY + 10; // Position unterhalb der Tabelle
    doc.setTextColor('#0a8e77'); // Farbe für die Zusammenfassung
    doc.text(`MWST (7.7%): ${mwst.toFixed(2)} €`, summaryX, summaryY + 10);
    doc.text(`Total Stunden: ${totalHours.toFixed(2)} Stunden`, summaryX, summaryY + 5);
    doc.text(`Total Preis: ${totalPrice.toFixed(2)} €`, summaryX, summaryY);

    // Hinweis: Rechnung zu zahlen in 30 Tagen
    const dueDateX = 15; // Abstand vom linken Rand
    const dueDateY = summaryY + 20; // Position unterhalb der Zusammenfassung
    const dueDate = `Rechnung zu zahlen in 30 Tagen`;
    doc.setTextColor('#333'); // Farbe für den Hinweis
    doc.text(dueDate, dueDateX, dueDateY);

    // Dankesnachricht und Grüße mit Unterschrift
    const greetingX = 15; // Abstand vom linken Rand
    const greetingY = dueDateY + 20; // Position unterhalb des Hinweises
    const greeting = `Mit freundlichen Grüßen,\n\n\n\n${bearbeitenderMitarbeiter}\nTB's Solutions\n\n`;
    doc.setTextColor('#333'); // Farbe für die Grüße
    doc.text(greeting, greetingX, greetingY);

    // Speichern Sie das PDF-Dokument
    doc.save('rechnung.pdf');
  };

  // Handler-Funktion zum Speichern des bearbeitenden Mitarbeiters im Local Storage
  const handleBearbeitenderMitarbeiterChange = (e) => {
    const selectedEmployee = e.target.value;
    setBearbeitenderMitarbeiter(selectedEmployee);
    localStorage.setItem('bearbeitenderMitarbeiter', selectedEmployee);
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
            {mitarbeiterListe.map((mitarbeiter, index) => (
              <option key={index} value={`${mitarbeiter.vorname} ${mitarbeiter.nachname}`}>
                {`${mitarbeiter.vorname} ${mitarbeiter.nachname}`}
              </option>
            ))}
          </select>
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
