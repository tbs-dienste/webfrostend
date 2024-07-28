import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Vertrag = () => {
  const generatePDF = () => {
    const kunde = document.getElementById('kunde').value;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'A4' });

    // Vertrag Titel
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Vertrag über die Erstellung und Betreuung einer Webseite', 10, 20);

    // Vertragsabschnitte
    const sections = [
      {
        title: 'Zwischen:',
        content: `[Name des Kunden]\nim Folgenden «Auftraggeber» genannt\nund\nTBs Solutions\nim Folgenden «Auftragnehmer» genannt\nwird folgender Vertrag betreffend der Webseite geschlossen:`,
      },
      {
        title: '1. Leistungsgegenstand',
        content: `Der Auftragnehmer verpflichtet sich, die Webseite des Auftraggebers gemäß den detaillierten Spezifikationen und Anforderungen, wie in Anlage 1 festgelegt, fachgerecht zu codieren und sie funktionsfähig zu gestalten.\n\nDie Webseite soll alle in Projektauftrag beschriebenen Funktionen und Inhalte gemäß den besprochenen Vorgaben enthalten.`,
      },
      {
        title: '2. Änderung der Anforderungen',
        content: `Änderungen der Anforderungen oder Spezifikationen, die nach Abschluss des Vertrages auftreten, bedürfen der schriftlichen Zustimmung beider Parteien. Der Auftragnehmer wird dem Auftraggeber die Auswirkungen auf den Zeitplan und die Kosten der Änderungen mitteilen.`,
      },
      {
        title: '3. Admin-Rolle und Bearbeitung der Webseite',
        content: `Der Auftraggeber erhält Zugang zur Admin-Rolle der Webseite, um Inhalte selbstständig zu bearbeiten und zu verwalten. Der Auftragnehmer wird den Auftraggeber in die Nutzung der Admin-Oberfläche einweisen und bei Fragen oder Problemen Unterstützung bieten.`,
      },
      {
        title: '4. Rücktrittsrecht des Auftraggebers',
        content: `Der Auftraggeber hat das Recht, vom Vertrag zurückzutreten, wenn der Auftragnehmer wesentliche Vertragsverpflichtungen nicht erfüllt. Im Falle eines Rücktritts wird eine angemessene Entschädigung für bereits erbrachte Leistungen fällig.`,
      },
      {
        title: '5. Einsicht in den Source Code',
        content: `Der Auftraggeber hat das Recht, Einsicht in den Source Code der Webseite zu nehmen, um die Qualität und Übereinstimmung der Programmierung zu überprüfen. Der Zugriff auf den Source Code wird dem Auftraggeber in einem angemessenen Umfang gewährt.`,
      },
      {
        title: '6. Berichtspflicht',
        content: `Der Auftragnehmer verpflichtet sich, dem Auftraggeber regelmäßig über den Fortschritt der Arbeiten zu berichten. Diese Berichte umfassen den Stand der Umsetzung, eventuelle Probleme und die voraussichtliche Fertigstellung.`,
      },
      {
        title: '7. Vertraulichkeit',
        content: `Der Auftragnehmer verpflichtet sich, alle vom Auftraggeber bereitgestellten Informationen und Daten vertraulich zu behandeln und diese nicht ohne ausdrückliche Zustimmung des Auftraggebers an Dritte weiterzugeben.`,
      },
      {
        title: '8. Urheberrecht und Eigentum',
        content: `Alle Urheberrechte und geistigen Eigentumsrechte an der von dem Auftragnehmer erstellten Webseite verbleiben bis zur vollständigen Bezahlung beim Auftragnehmer. Nach vollständiger Bezahlung gehen die Rechte an der Webseite und ihren Inhalten auf den Auftraggeber über.`,
      },
      {
        title: '9. Vergütung',
        content: `Die Vergütung für die Erstellung und Betreuung der Webseite wird in Anlage 2 festgelegt. Zahlungen sind gemäß dem vereinbarten Zahlungsplan zu leisten. Bei Zahlungsverzug behält sich der Auftragnehmer vor, die Arbeit bis zur Begleichung der ausstehenden Beträge einzustellen.`,
      },
      {
        title: '10. Haftung',
        content: `Der Auftragnehmer haftet für Schäden, die durch vorsätzliche oder grob fahrlässige Handlungen entstehen. Für indirekte Schäden, Folgeschäden oder entgangenen Gewinn haftet der Auftragnehmer nur bei nachgewiesener grober Fahrlässigkeit oder Vorsatz.`,
      },
      {
        title: '11. Vertragsdauer und Kündigung',
        content: `Der Vertrag tritt mit der Unterzeichnung durch beide Parteien in Kraft und endet nach Erfüllung der vertraglichen Verpflichtungen. Eine vorzeitige Kündigung ist nur aus wichtigem Grund möglich und bedarf der schriftlichen Form.`,
      },
      {
        title: '12. Sonstige Bestimmungen',
        content: `Für alle nicht im Vertrag geregelten Punkte gelten die gesetzlichen Bestimmungen des [Landes einfügen].`,
      },
      {
        title: '13. Anlagen',
        content: `• Anlage 1: Detaillierte Spezifikationen und Anforderungen\n• Anlage 2: Vergütungsvereinbarung`,
      },
      {
        title: 'Unterschriften',
        content: `[Ort], [Datum]\n[Ort], [Datum]\n\n[Unterschrift Auftraggeber]\n[Unterschrift Auftragnehmer]`,
      },
    ];

    let yPosition = 30;

    sections.forEach((section) => {
      if (yPosition + 10 > 280) {
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
      yPosition += 20; // Abstand nach jedem Abschnitt
    });

    // Speichern des Dokuments
    doc.save('Vertrag.pdf');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Vertragserstellung</h1>

      <div>
        <h2>Vertrag</h2>
        <p>
          <strong>Zwischen:</strong> [Name des Kunden]
          <br />
          im Folgenden «Auftraggeber» genannt
          <br />
          und
          <br />
          TBs Solutions
          <br />
          im Folgenden «Auftragnehmer» genannt
          <br />
          wird folgender Vertrag betreffend der Webseite geschlossen:
        </p>
        <ol>
          <li>
            <strong>Leistungsgegenstand</strong>
            <p>
              Der Auftragnehmer verpflichtet sich, die Webseite des Auftraggebers gemäß den detaillierten Spezifikationen und Anforderungen, wie in Anlage 1 festgelegt, fachgerecht zu codieren und sie funktionsfähig zu gestalten.
              Die Webseite soll alle in Projektauftrag beschriebenen Funktionen und Inhalte gemäß den besprochenen Vorgaben enthalten.
            </p>
          </li>
          <li>
            <strong>Änderung der Anforderungen</strong>
            <p>
              Änderungen der Anforderungen oder Spezifikationen, die nach Abschluss des Vertrages auftreten, bedürfen der schriftlichen Zustimmung beider Parteien. Der Auftragnehmer wird dem Auftraggeber die Auswirkungen auf den Zeitplan und die Kosten der Änderungen mitteilen.
            </p>
          </li>
          <li>
            <strong>Admin-Rolle und Bearbeitung der Webseite</strong>
            <p>
              Der Auftraggeber erhält Zugang zur Admin-Rolle der Webseite, um Inhalte selbstständig zu bearbeiten und zu verwalten. Der Auftragnehmer wird den Auftraggeber in die Nutzung der Admin-Oberfläche einweisen und bei Fragen oder Problemen Unterstützung bieten.
            </p>
          </li>
          <li>
            <strong>Rücktrittsrecht des Auftraggebers</strong>
            <p>
              Der Auftraggeber hat das Recht, vom Vertrag zurückzutreten, wenn der Auftragnehmer wesentliche Vertragsverpflichtungen nicht erfüllt. Im Falle eines Rücktritts wird eine angemessene Entschädigung für bereits erbrachte Leistungen fällig.
            </p>
          </li>
          <li>
            <strong>Einsicht in den Source Code</strong>
            <p>
              Der Auftraggeber hat das Recht, Einsicht in den Source Code der Webseite zu nehmen, um die Qualität und Übereinstimmung der Programmierung zu überprüfen. Der Zugriff auf den Source Code wird dem Auftraggeber in einem angemessenen Umfang gewährt.
            </p>
          </li>
          <li>
            <strong>Berichtspflicht</strong>
            <p>
              Der Auftragnehmer verpflichtet sich, dem Auftraggeber regelmäßig über den Fortschritt der Arbeiten zu berichten. Diese Berichte umfassen den Stand der Umsetzung, eventuelle Probleme und die voraussichtliche Fertigstellung.
            </p>
          </li>
          <li>
            <strong>Vertraulichkeit</strong>
            <p>
              Der Auftragnehmer verpflichtet sich, alle vom Auftraggeber bereitgestellten Informationen und Daten vertraulich zu behandeln und diese nicht ohne ausdrückliche Zustimmung des Auftraggebers an Dritte weiterzugeben.
            </p>
          </li>
          <li>
            <strong>Urheberrecht und Eigentum</strong>
            <p>
              Alle Urheberrechte und geistigen Eigentumsrechte an der von dem Auftragnehmer erstellten Webseite verbleiben bis zur vollständigen Bezahlung beim Auftragnehmer. Nach vollständiger Bezahlung gehen die Rechte an der Webseite und ihren Inhalten auf den Auftraggeber über.
            </p>
          </li>
          <li>
            <strong>Vergütung</strong>
            <p>
              Die Vergütung für die Erstellung und Betreuung der Webseite wird in Anlage 2 festgelegt. Zahlungen sind gemäß dem vereinbarten Zahlungsplan zu leisten. Bei Zahlungsverzug behält sich der Auftragnehmer vor, die Arbeit bis zur Begleichung der ausstehenden Beträge einzustellen.
            </p>
          </li>
          <li>
            <strong>Haftung</strong>
            <p>
              Der Auftragnehmer haftet für Schäden, die durch vorsätzliche oder grob fahrlässige Handlungen entstehen. Für indirekte Schäden, Folgeschäden oder entgangenen Gewinn haftet der Auftragnehmer nur bei nachgewiesener grober Fahrlässigkeit oder Vorsatz.
            </p>
          </li>
          <li>
            <strong>Vertragsdauer und Kündigung</strong>
            <p>
              Der Vertrag tritt mit der Unterzeichnung durch beide Parteien in Kraft und endet nach Erfüllung der vertraglichen Verpflichtungen. Eine vorzeitige Kündigung ist nur aus wichtigem Grund möglich und bedarf der schriftlichen Form.
            </p>
          </li>
          <li>
            <strong>Sonstige Bestimmungen</strong>
            <p>
              Für alle nicht im Vertrag geregelten Punkte gelten die gesetzlichen Bestimmungen des [Landes einfügen].
            </p>
          </li>
          <li>
            <strong>Anlagen</strong>
            <p>
              • Anlage 1: Detaillierte Spezifikationen und Anforderungen<br />
              • Anlage 2: Vergütungsvereinbarung
            </p>
          </li>
        </ol>

        <p>
          [Ort], [Datum]<br />
          [Ort], [Datum]
        </p>
        <p>
          [Unterschrift Auftraggeber]<br />
          [Unterschrift Auftragnehmer]
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="kunde">Name des Kunden:</label>
        <select id="kunde">
          <option value="Max Mustermann">Max Mustermann</option>
          <option value="Erika Musterfrau">Erika Musterfrau</option>
          <option value="John Doe">John Doe</option>
        </select>

        <button type="button" onClick={generatePDF} style={{ marginLeft: '10px' }}>
          PDF generieren
        </button>
      </div>
    </div>
  );
};

export default Vertrag;
