import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './Auftragsbestaetigung.scss';
import firmalogo from '../../logo.png'; // Dein Logo

const Auftragsbestaetigung = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKunde() {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
        const kunde = response.data.data;
        if (kunde) {
          setSelectedKunde(kunde);
        } else {
          console.error('Kunde nicht gefunden');
          alert('Kunde nicht gefunden');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Kunden:', error);
        alert('Fehler beim Abrufen der Kundendaten. Bitte versuche es später noch einmal.');
      } finally {
        setLoading(false);
      }
    }

    fetchKunde();
  }, [id]);

  const generatePDF = () => {
    if (!selectedKunde) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'A4' });

    // Firmenlogo zentriert und vergrößert
    const logoWidth = 25; // Breite des Logos in mm
    const logoHeight = 12.5; // Höhe des Logos in mm
    const xPosition = (doc.internal.pageSize.width - logoWidth) / 2; // Zentrieren
    const yPosition = 10; // Y-Position des Logos in mm

    doc.addImage(firmalogo, 'PNG', xPosition, yPosition, logoWidth, logoHeight);

    // Firmenanschrift
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const addressX = 10;
    let addressY = yPosition + logoHeight + 15; // Platz unter dem Logo
    doc.text('TBs Solutions GmbH', addressX, addressY);
    doc.text('Musterstraße 1', addressX, addressY + 5);
    doc.text('12345 Musterstadt', addressX, addressY + 10);
    doc.text('Deutschland', addressX, addressY + 15);

    // Titel
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Auftragsbestätigung', addressX, addressY + 30);

    // Kundenanschrift
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const kundenAddressY = addressY + 40;
    doc.text(`${selectedKunde.nachname} ${selectedKunde.vorname}`, addressX, kundenAddressY);
    doc.text(`${selectedKunde.strasseHausnummer}`, addressX, kundenAddressY + 5);
    doc.text(`${selectedKunde.plz} ${selectedKunde.ort}`, addressX, kundenAddressY + 10);

    // Dankesnachricht
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const dankesnachrichtY = kundenAddressY + 20;
    doc.text('Sehr geehrter Kunde,', addressX, dankesnachrichtY);
    doc.text(`vielen Dank für Ihren Auftrag. Wir freuen uns, Ihnen hiermit die Auftragsbestätigung für die Dienstleistung ${selectedKunde.auftragsTyp} zukommen zu lassen.`, addressX, dankesnachrichtY + 10, { maxWidth: 180 });

    // Zusammenfassung des Auftrags
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const zusammenfassungY = dankesnachrichtY + 30;
    doc.text('Auftragszusammenfassung:', addressX, zusammenfassungY);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Auftragsnummer: ${selectedKunde.auftragsnummer}`, addressX, zusammenfassungY + 10);
    doc.text(`Dienstleistung: ${selectedKunde.auftragsTyp}`, addressX, zusammenfassungY + 20);
    doc.text(`Beschreibung: ${selectedKunde.auftragsBeschreibung}`, addressX, zusammenfassungY + 30);

    // Startdatum und Zeitraum
    const startDate = new Date().toLocaleDateString('de-DE');
    doc.text(`Wir werden ab dem ${startDate} mit der Bearbeitung Ihres Auftrags beginnen. Die voraussichtliche Dauer des Projekts beträgt ${selectedKunde.projektDauer} Wochen.`, addressX, zusammenfassungY + 50);

    // Weitere Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const weitereDetailsY = zusammenfassungY + 70;
    doc.text('Zusätzliche Informationen:', addressX, weitereDetailsY);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Bitte beachten Sie, dass Änderungen am Auftragsumfang zusätzliche Kosten verursachen können. Bei Fragen oder Änderungen wenden Sie sich bitte umgehend an unser Team.', addressX, weitereDetailsY + 10, { maxWidth: 180 });

    // Kontaktinformationen
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const kontaktInfoY = weitereDetailsY + 40;
    doc.text('Falls Sie Fragen oder zusätzliche Anforderungen haben, zögern Sie bitte nicht, uns zu kontaktieren.', addressX, kontaktInfoY);
    doc.text('Mit freundlichen Grüßen,', addressX, kontaktInfoY + 10);
    doc.text('Ihr TBs Solutions Team', addressX, kontaktInfoY + 20);

    doc.save('Auftragsbestaetigung.pdf');
  };

  if (loading) {
    return <div>Lade Kunde...</div>;
  }

  return (
    <div className="auftrag-bestaetigung-container">
      <div className="auftrag-bestaetigung">
        <h2>Auftragsbestätigung</h2>
        {selectedKunde ? (
          <>
            <div className="kunden-anschrift">
              <h3>Kundenanschrift</h3>
              <p>{selectedKunde.nachname} {selectedKunde.vorname}</p>
              <p>{selectedKunde.strasseHausnummer}</p>
              <p>{selectedKunde.plz} {selectedKunde.ort}</p>
            </div>
            <p className="auftrag-text">Sehr geehrter Kunde,</p>
            <p className="auftrag-text">vielen Dank für Ihren Auftrag. Wir freuen uns, Ihnen hiermit die Auftragsbestätigung für die Dienstleistung {selectedKunde.auftragsTyp} zukommen zu lassen.</p>
            <p className="auftrag-text"><strong>Auftragszusammenfassung:</strong></p>
            <p className="auftrag-text">Auftragsnummer: {selectedKunde.auftragsnummer}</p>
            <p className="auftrag-text">Dienstleistung: {selectedKunde.auftragsTyp}</p>
            <p className="auftrag-text">Beschreibung: {selectedKunde.auftragsBeschreibung}</p>
            <p className="auftrag-text">Wir werden ab dem {new Date().toLocaleDateString('de-DE')} mit der Bearbeitung Ihres Auftrags beginnen. Die voraussichtliche Dauer des Projekts beträgt {selectedKunde.projektDauer} Wochen.</p>
            <p className="auftrag-text"><strong>Zusätzliche Informationen:</strong></p>
            <p className="auftrag-text">Bitte beachten Sie, dass Änderungen am Auftragsumfang zusätzliche Kosten verursachen können. Bei Fragen oder Änderungen wenden Sie sich bitte umgehend an unser Team.</p>
            <p className="auftrag-text">Falls Sie Fragen oder zusätzliche Anforderungen haben, zögern Sie bitte nicht, uns zu kontaktieren.</p>
            <p className="auftrag-text">Mit freundlichen Grüßen,</p>
            <p className="auftrag-text">Ihr TBs Solutions Team</p>

            <button className="pdf-button" onClick={generatePDF}>PDF generieren</button>
          </>
        ) : (
          <div>Keine Daten gefunden</div>
        )}
      </div>
    </div>
  );
};

export default Auftragsbestaetigung;
