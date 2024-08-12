import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './Auftragsbestaetigung.scss';
import { FaCopy } from 'react-icons/fa';
import firmalogo from '../../logo.png';

const Auftragsbestaetigung = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

    // Firmenlogo
    const logo = firmalogo; // Ersetze dies durch den Pfad zum Logo oder eine URL
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);

    // Firmenanschrift
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('TBs Solutions GmbH', 10, 35);
    doc.text('Musterstraße 1', 10, 40);
    doc.text('12345 Musterstadt', 10, 45);
    doc.text('Deutschland', 10, 50);

    // Titel
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Auftragsbestätigung', 10, 60);

    // Kundenanschrift
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${selectedKunde.nachname} ${selectedKunde.vorname}`, 10, 80);
    doc.text(`${selectedKunde.strasseHausnummer}`, 10, 85);
    doc.text(`${selectedKunde.plz} ${selectedKunde.ort}`, 10, 90);

    // Dankesnachricht
    doc.text('Sehr geehrter Kunde,', 10, 110);
    doc.text(`vielen Dank für Ihren Auftrag. Wir freuen uns, Ihnen hiermit die Auftragsbestätigung für die Dienstleistung ${selectedKunde.auftragsTyp} zukommen zu lassen.`, 10, 120, { maxWidth: 180 });

    // Zusammenfassung des Auftrags
    doc.text(`Auftragsnummer: ${selectedKunde.auftragsnummer}`, 10, 140);
    doc.text(`Dienstleistung: ${selectedKunde.auftragsTyp}`, 10, 150);
    doc.text(`Beschreibung: ${selectedKunde.auftragsBeschreibung}`, 10, 160);

    // Startdatum und Zeitraum
    const startDate = new Date().toLocaleDateString('de-DE');
    doc.text(`Wir werden ab dem ${startDate} mit der Bearbeitung Ihres Auftrags beginnen. Die voraussichtliche Dauer des Projekts beträgt ${selectedKunde.projektDauer} Wochen.`, 10, 180);

    // Weitere Details
    doc.text('Zusätzliche Informationen:', 10, 200);
    doc.text('Bitte beachten Sie, dass Änderungen am Auftragsumfang zusätzliche Kosten verursachen können. Bei Fragen oder Änderungen wenden Sie sich bitte umgehend an unser Team.', 10, 210, { maxWidth: 180 });

    // Kontaktinformationen
    doc.text('Falls Sie Fragen oder zusätzliche Anforderungen haben, zögern Sie bitte nicht, uns zu kontaktieren.', 10, 230);
    doc.text('Mit freundlichen Grüßen,', 10, 240);
    doc.text('Ihr TBs Solutions Team', 10, 250);

    doc.save('Auftragsbestaetigung.pdf');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(selectedKunde.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Setze den Status nach 2 Sekunden zurück
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
              <p>{selectedKunde.kundenName}</p>
              <p>{selectedKunde.kundenStrasse}</p>
              <p>{selectedKunde.kundenPlz} {selectedKunde.kundenOrt}</p>
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
