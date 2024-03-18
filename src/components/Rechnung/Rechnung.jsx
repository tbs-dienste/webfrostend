import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../logo.png'; // Pfad zum Logo
import './Rechnung.scss'; // Importieren Sie das SCSS-Styling
import 'jspdf-autotable';


const Rechnung = () => {
  const { id } = useParams(); // Extrahiere die ID aus dem URL-Parameter
  const [kunde, setKunde] = useState(null);
  const [workSessions, setWorkSessions] = useState([]);

  useEffect(() => {
    // Lade die Kundendaten aus dem Local Storage
    const storedKunden = JSON.parse(localStorage.getItem('kunden'));
    // Suche nach dem Kunden mit der entsprechenden ID
    const selectedKunde = storedKunden.find(kunde => kunde.id === parseInt(id)); // Konvertiere die ID in eine Zahl, um sicherzustellen, dass der Vergleich korrekt ist
    // Setze den gefundenen Kunden in den State
    setKunde(selectedKunde);

    // Lade die Arbeitszeiten aus dem Local Storage
    const storedSessions = JSON.parse(localStorage.getItem(`workSessions_${id}`));
    if (storedSessions) {
      setWorkSessions(storedSessions);
    }
  }, [id]); // Führe diesen Effekt bei Änderungen der ID aus

  if (!kunde) {
    return <p>Kunde nicht gefunden.</p>;
  }

  // Definiere die Anrede basierend auf dem Geschlecht
  let anrede;
  if (kunde.geschlecht === 'männlich') {
    anrede = 'Herr';
  } else if (kunde.geschlecht === 'weiblich') {
    anrede = 'Frau';
  } else {
    anrede = ''; // Anrede für andere Geschlechter
  }

  // Funktion zum Generieren der PDF-Rechnung
  const generatePDF = () => {
    // Erstellen Sie ein neues PDF-Dokument
    const doc = new jsPDF();

    // Logo oben links einfügen
    doc.addImage(logo, 'PNG', 10, 10, 50, 50); // X-Position: 10, Y-Position: 10, Breite: 50, Höhe: 50

    // Fügen Sie die Rechnungsinformationen hinzu
    const startX = 10; // Start-X-Position für den Text
    const startY = 80; // Start-Y-Position für den Text
    const lineHeight = 10; // Zeilenhöhe für den Text

    doc.setFontSize(12); // Setze die Schriftgröße

    // Kundennummer
    doc.text(`Kundennummer: ${generateRandomKundennummer()}`, startX, startY);
    // Anrede
    doc.text(`${anrede}`, startX, startY + lineHeight);
    // Name des Kunden
    doc.text(`${kunde.nachname} ${kunde.vorname}`, startX, startY + 2 * lineHeight);
    // Anschrift des Kunden
    doc.text(`${kunde.strasseHausnummer}`, startX, startY + 3 * lineHeight);
    doc.text(`${kunde.postleitzahl} ${kunde.ort}`, startX, startY + 4 * lineHeight);

    // Arbeitszeiten als Tabelle hinzufügen
    const tableColumns = ['Startzeit', 'Endzeit', 'Dauer (Stunden)', 'Preis (€)'];
    const tableRows = workSessions.map(session => [session.start, session.end, session.duration, session.price]);
    doc.autoTable(tableColumns, tableRows, { startY: startY + 6 * lineHeight });

    // Speichern Sie das PDF-Dokument
    doc.save('rechnung.pdf');
  };

  // Funktion zum Generieren einer zufälligen Kundennummer
  const generateRandomKundennummer = () => {
    return Math.floor(Math.random() * 1000000) + 1; // Generiert eine zufällige Zahl zwischen 1 und 1.000.000
  };

  return (
    <div>
      <h2 className="rechnung-title">Rechnung</h2>
      <div className='rechnung-container'>
        <div className='rechnung-header'>
          <img src={logo} alt='Logo' className='logoRechnung' />
          <h3>Rechnung</h3>
        </div>
        <div className='rechnung-content'>
          <div className='rechnung-details'>
            <p>Kundennummer: {generateRandomKundennummer()}</p> {/* Anzeigen der zufälligen Kundennummer */}
            <p>{anrede}</p>
            <p>{kunde.nachname} {kunde.vorname}</p>
            <p>{kunde.strasseHausnummer}</p>
            <p>{kunde.postleitzahl} {kunde.ort}</p>
          </div>
          <div className="work-sessions-table">
            <h4>Arbeitszeiten</h4>
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
          <button onClick={generatePDF}>Rechnung als PDF herunterladen</button>
        </div>
      </div>
    </div>
  );
};

export default Rechnung;
