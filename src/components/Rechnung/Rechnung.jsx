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
    let startY = 80; // Start-Y-Position für den Text
    const lineHeight = 10; // Zeilenhöhe für den Text

    doc.setFontSize(12); // Setze die Schriftgröße

    // Kundennummer
    doc.text(`Kundennummer: ${kunde.kundennummer}`, startX, startY); // Anzeigen der Kundennummer

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

    // Berechnen Sie Gesamtpreis und Gesamtstunden
    const totalPrice = workSessions.reduce((total, session) => total + parseFloat(session.price), 0);
    const totalHours = workSessions.reduce((total, session) => total + parseFloat(session.duration), 0);

    // Berechnen Sie die MWST 7.7% vom Gesamtpreis
    const mwst = totalPrice * 0.077;

    // Fügen Sie Gesamtpreis, Gesamtstunden und MWST hinzu
    startY += (6 + workSessions.length) * lineHeight;
    doc.text(`Total Preis: ${totalPrice.toFixed(2)} €`, startX, startY + 20); // 20px unterhalb der Tabelle
    doc.text(`Total Stunden: ${totalHours.toFixed(2)} Stunden`, startX, startY + 2 * lineHeight + 20); // 20px unterhalb der Tabelle
    doc.text(`MWST (7.7%): ${mwst.toFixed(2)} €`, startX, startY + 3 * lineHeight + 20); // 20px unterhalb der Tabelle

    // Speichern Sie das PDF-Dokument
    doc.save('rechnung.pdf');
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
            <p>Kundennummer: {kunde.kundennummer}</p> {/* Anzeigen der Kundennummer */}
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
