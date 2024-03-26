import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './MitarbeiterAnzeigen.scss';
import logo from '../../logo.png'; // Import des Logos

function MitarbeiterAnzeigen() {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedMitarbeiter, setSelectedMitarbeiter] = useState(null);
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]);

  useEffect(() => {
    const storedMitarbeiter = localStorage.getItem('mitarbeiter');
    if (storedMitarbeiter) {
      setMitarbeiterListe(JSON.parse(storedMitarbeiter));
    }
  }, []);

  const generatePDF = (mitarbeiter) => {
    if (!mitarbeiter) return;
  
    const doc = new jsPDF();
    const logoWidth = 50; // Breite des Logos
    const logoHeight = 50; // Höhe des Logos
  
    // Logo und Header hinzufügen
    doc.addImage(logo, 'PNG', 10, 10, logoWidth, logoHeight);
    doc.setFontSize(20); // Größere Schriftgröße für den Titel
    doc.setFont('helvetica', 'bold'); // Schriftart auf fett setzen
    doc.text('Mitarbeiterdetails', 70, 30); // Titel neben dem Logo
  
    const { id, vorname, nachname, iban, adresse, benutzername, passwort, online } = mitarbeiter;
  
    // Mehr Text vor der Tabelle hinzufügen
    const mehrText = `
      Hier finden Sie detaillierte Informationen zu diesem Mitarbeiter.
      Bitte beachten Sie, dass diese Informationen vertraulich sind und nur für den internen Gebrauch bestimmt sind.
      Jegliche unbefugte Nutzung oder Weitergabe ist untersagt.
    `;
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(mehrText, 20, 40);
  
    const tableData = [
      [{content: 'Feld', styles: {fillColor: '#ffcc00'}} , {content: 'Wert', styles: {fillColor: '#ffcc00'}}],
      ['Vorname', vorname],
      ['Nachname', nachname],
      ['IBAN', iban],
      ['Adresse', adresse],
      ['Benutzername', benutzername],
      ['Passwort', passwort]
    ];
  
    // Höhe der Tabellenzeilen anpassen
    const rowStyles = { fontSize: 12, cellPadding: 5, valign: 'middle' };
  
    // Prüfen, ob die Tabelle auf mehrere Seiten verteilt wird
    let startY = 120;
    if (doc.previousAutoTable.finalY + 20 > doc.internal.pageSize.height) {
      doc.addPage();
      startY = 20;
    }
  
    doc.autoTable({
      startY: startY,
      body: tableData,
      styles: { cellWidth: 'wrap' },
      columnStyles: { 0: { cellWidth: 'auto' } },
      headStyles: { fillColor: '#ffcc00', textColor: '#000000', fontStyle: 'bold' },
      bodyStyles: rowStyles
    });
  
    // Weitere Informationen nach der Tabelle hinzufügen
    const weitereInfos = `
      Für weitere Informationen oder Fragen wenden Sie sich bitte an die Personalabteilung.
      Vielen Dank für Ihre Aufmerksamkeit.
    `;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(weitereInfos, 20, doc.autoTable.previous.finalY + 10);
  
    doc.save(`mitarbeiter_details_${id}.pdf`);
  };
  
  
  
  

  const handleMitarbeiterLoeschen = (id) => {
    const updatedList = mitarbeiterListe.filter(mitarbeiter => mitarbeiter.id !== id);
    setMitarbeiterListe(updatedList);
    localStorage.setItem('mitarbeiter', JSON.stringify(updatedList));
  };

  const toggleDetailsVisibility = () => {
    setIsDetailsVisible(!isDetailsVisible);
    if (!isDetailsVisible) {
      setSelectedMitarbeiter(null);
    }
  };

  const handleMitarbeiterClick = (mitarbeiter) => {
    setSelectedMitarbeiter(mitarbeiter);
    setIsDetailsVisible(true);
  };

  return (
    <div className="mitarbeiter-anzeigen-container">
      <h2 className="mitarbeiter-anzeigen-title">Mitarbeiter anzeigen</h2>
      <ul className="mitarbeiter-liste">
        {mitarbeiterListe.map((mitarbeiter) => (
          <li key={mitarbeiter.id} className="mitarbeiter-list-item" onClick={() => handleMitarbeiterClick(mitarbeiter)}>
            <span className="mitarbeiter-name">{mitarbeiter.vorname} {mitarbeiter.nachname}</span>
            <span className="mitarbeiter-status">{mitarbeiter.online ? 'Online' : 'Offline'}</span>
            <button onClick={() => generatePDF(mitarbeiter)}>PDF</button>
            <button onClick={() => handleMitarbeiterLoeschen(mitarbeiter.id)}>Löschen</button>
            <div className="arrow-icon" onClick={toggleDetailsVisibility}>
              {isDetailsVisible ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
        ))}
      </ul>
      {isDetailsVisible && selectedMitarbeiter && (
        <div className="mitarbeiter-details">
          <h3>Mitarbeiterdetails</h3>
          <div><strong>Vorname:</strong> {selectedMitarbeiter.vorname}</div>
          <div><strong>Nachname:</strong> {selectedMitarbeiter.nachname}</div>
          <div><strong>IBAN:</strong> {selectedMitarbeiter.iban}</div>
          <div><strong>Adresse:</strong> {selectedMitarbeiter.strasseHausnummer}</div>
          <div><strong>Benutzername:</strong> {selectedMitarbeiter.benutzername}</div>
          <div><strong>Passwort:</strong> {selectedMitarbeiter.passwort}</div>
          <div><strong>Status:</strong> {selectedMitarbeiter.online ? 'Online' : 'Offline'}</div>
        </div>
      )}
    </div>
  );
}

export default MitarbeiterAnzeigen;
