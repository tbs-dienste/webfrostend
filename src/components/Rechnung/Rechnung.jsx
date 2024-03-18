import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../logo.png'; // Pfad zum Logo

const Rechnung = () => {
  const { id } = useParams(); // Extrahiere die ID aus dem URL-Parameter
  const [kunde, setKunde] = useState(null);

  useEffect(() => {
    // Lade die Kundendaten aus dem Local Storage
    const storedKunden = JSON.parse(localStorage.getItem('kunden'));
    // Suche nach dem Kunden mit der entsprechenden ID
    const selectedKunde = storedKunden.find(kunde => kunde.id === parseInt(id)); // Konvertiere die ID in eine Zahl, um sicherzustellen, dass der Vergleich korrekt ist
    // Setze den gefundenen Kunden in den State
    setKunde(selectedKunde);

    // Printe das Geschlecht des Kunden in die Konsole
    console.log('Geschlecht des Kunden:', selectedKunde.geschlecht);
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

  // Funktion zum Generieren einer zufälligen Kundennummer
  const generateRandomKundennummer = () => {
    return Math.floor(Math.random() * 1000000) + 1; // Generiert eine zufällige Zahl zwischen 1 und 1.000.000
  };

  // Funktion zum Generieren der PDF-Rechnung
  const generatePDF = () => {
    // Erstellen Sie ein neues PDF-Dokument
    const doc = new jsPDF();
    
    // Logo oben links einfügen
    doc.addImage(logo, 'PNG', 10, 10, 50, 50); // X-Position: 10, Y-Position: 10, Breite: 50, Höhe: 50
    
    // Fügen Sie die Rechnungsinformationen hinzu
    doc.text(`Kundennummer: ${generateRandomKundennummer()}`, 10, 80);
    doc.text(`${anrede}`, 10, 90);
    doc.text(`${kunde.nachname} ${kunde.vorname}`, 10, 100);
    doc.text(`${kunde.strasseHausnummer}`, 10, 110);
    doc.text(`${kunde.postleitzahl} ${kunde.ort}`, 10, 120);
    
    // Speichern Sie das PDF-Dokument
    doc.save('rechnung.pdf');
  };

  return (
    <div>
      <h2>Rechnung</h2>
      <p>Kundennummer: {generateRandomKundennummer()}</p> {/* Anzeigen der zufälligen Kundennummer */}
      <div className='anschrift'>
        <p>{anrede}</p>
        <p>{kunde.nachname} {kunde.vorname}</p>
        <p>{kunde.strasseHausnummer}</p>
        <p>{kunde.postleitzahl} {kunde.ort}</p>
        {/* Weitere Anschriftsdetails hier einfügen */}
      </div>
      {/* Weitere Rechnungsdetails hier einfügen */}
      <button onClick={generatePDF}>Rechnung als PDF herunterladen</button>
    </div>
  );
};

export default Rechnung;
