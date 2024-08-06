import React from 'react';
import { jsPDF } from 'jspdf';
import { useParams, useLocation } from 'react-router-dom';
import 'jspdf-autotable';

const Vertrag = () => {
  const { id } = useParams();
  const location = useLocation();

  // Den Verifizierungscode aus den URL-Parametern extrahieren
  const queryParams = new URLSearchParams(location.search);
  const verificationCode = queryParams.get('code');

  const generatePDF = () => {
    // Beispiel-Sections. Ersetze diese mit deinen tatsächlichen Daten.
    const sections = [
      { title: 'Abschnitt 1', content: 'Inhalt des Abschnitts 1' },
      { title: 'Abschnitt 2', content: 'Inhalt des Abschnitts 2' },
      // Weitere Abschnitte hinzufügen
    ];

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'A4' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Vertrag über die Erstellung und Betreuung einer Webseite', 10, 20);

    let yPosition = 30;

    sections.forEach((section) => {
      if (yPosition + 10 > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, 10, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(section.content, 10, yPosition, { maxWidth: 180 });
      yPosition += 20;
    });

    // Verifizierungscode im PDF hinzufügen
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Verifizierungscode: ${verificationCode || 'Nicht verfügbar'}`, 10, yPosition);
    yPosition += 10;

    doc.text('[Ort], [Datum]', 10, yPosition);
    yPosition += 10;
    doc.text('[Ort], [Datum]', 10, yPosition);
    yPosition += 10;
    doc.text('[Unterschrift Auftraggeber]', 10, yPosition);
    yPosition += 10;
    doc.text('[Unterschrift Auftragnehmer]', 10, yPosition);

    doc.save('Vertrag.pdf');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Vertragserstellung</h1>
      
      <p>Verifizierungscode: {verificationCode || 'Nicht verfügbar'}</p>

      <button type="button" onClick={generatePDF} style={{ marginLeft: '10px' }}>
        PDF generieren
      </button>
    </div>
  );
};

export default Vertrag;
