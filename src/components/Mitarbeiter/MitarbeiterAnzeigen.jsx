import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function MitarbeiterAnzeigen() {
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
    doc.setFontSize(12);
    doc.text('Mitarbeiterdetails', 20, 20);

    const { id, vorname, nachname, iban, adresse, benutzername, passwort, online } = mitarbeiter;

    const tableData = [
      ['Feld', 'Wert'],
      ['Vorname', vorname],
      ['Nachname', nachname],
      ['IBAN', iban],
      ['Adresse', adresse],
      ['Benutzername', benutzername],
      ['Passwort', passwort],
      ['Status', online ? 'Online' : 'Offline']
    ];

    doc.autoTable({
      startY: 30,
      body: tableData
    });

    // Zusätzlicher Text
    const additionalText = `
      Diese Informationen sind vertraulich und nur für den internen Gebrauch bestimmt.
      Jegliche Weitergabe oder unbefugte Nutzung ist untersagt.
    `;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(additionalText, 20, doc.autoTable.previous.finalY + 10);

    doc.save(`mitarbeiter_details_${id}.pdf`);
  };

  const handleMitarbeiterLoeschen = (id) => {
    const updatedList = mitarbeiterListe.filter(mitarbeiter => mitarbeiter.id !== id);
    setMitarbeiterListe(updatedList);
    localStorage.setItem('mitarbeiter', JSON.stringify(updatedList));
  };

  const handleDeleteButtonClick = (event, id) => {
    event.stopPropagation(); // Stoppt die Ereignisausbreitung, um das Auslösen des "onClick" für den Mitarbeiter zu verhindern
    handleMitarbeiterLoeschen(id);
  };

  return (
    <div className="mitarbeiter-anzeigen-container">
      <h2 className="mitarbeiter-anzeigen-title">Mitarbeiter anzeigen</h2>
      <ul className="mitarbeiter-liste">
        {mitarbeiterListe.map((mitarbeiter) => (
          <li key={mitarbeiter.id} className="mitarbeiter-list-item" onClick={() => setSelectedMitarbeiter(mitarbeiter)}>
            <span className="mitarbeiter-name">{mitarbeiter.vorname} {mitarbeiter.nachname}</span>
            <span className="mitarbeiter-status">{mitarbeiter.online ? 'Online' : 'Offline'}</span>
            <button onClick={() => generatePDF(mitarbeiter)}>PDF</button>
            <button onClick={(event) => handleDeleteButtonClick(event, mitarbeiter.id)}>Löschen</button>
          </li>
        ))}
      </ul>
      {selectedMitarbeiter && (
        <div className="mitarbeiter-details">
          <h3>Mitarbeiterdetails</h3>
          <div><strong>Vorname:</strong> {selectedMitarbeiter.vorname}</div>
          <div><strong>Nachname:</strong> {selectedMitarbeiter.nachname}</div>
          <div><strong>IBAN:</strong> {selectedMitarbeiter.iban}</div>
          <div><strong>Adresse:</strong> {selectedMitarbeiter.adresse}</div>
          <div><strong>Benutzername:</strong> {selectedMitarbeiter.benutzername}</div>
          <div><strong>Passwort:</strong> {selectedMitarbeiter.passwort}</div>
          <div><strong>Status:</strong> {selectedMitarbeiter.online ? 'Online' : 'Offline'}</div>
        </div>
      )}
    </div>
  );
}

export default MitarbeiterAnzeigen;
