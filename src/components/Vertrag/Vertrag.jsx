import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Vertrag.scss';
import { FaCopy } from 'react-icons/fa'; // Importiere das Copy-Icon von react-icons

const Vertrag = () => {
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

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Vertrag', 10, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Zwischen ${selectedKunde.vorname} ${selectedKunde.nachname}, im Folgenden „Auftraggeber“ genannt, und TBs Solutions, im Folgenden „Auftragnehmer“ genannt, wird folgender Vertrag betreffend der Dienstleistung ${selectedKunde.auftragsTyp} geschlossen.`, 10, 30, { maxWidth: 180 });

    doc.text('1. Leistungsgegenstand', 10, 50);
    doc.text(`Der Auftragnehmer verpflichtet sich, die Dienstleistung des Auftraggebers gemäß den detaillierten Spezifikationen und Anforderungen, wie in Anlage 1 festgelegt, fachgerecht auszuführen.`, 10, 60, { maxWidth: 180 });

    doc.text('2. Änderung der Anforderungen', 10, 80);
    doc.text(`Der Auftraggeber hat das Recht, die Anforderungen an die Dienstleistungen jederzeit zu ändern, sofern dies schriftlich mitgeteilt wird. Änderungsanforderungen können sich auf Design, Funktionalität, Inhalte und weitere Aspekte der Dienstleistung beziehen.`, 10, 90, { maxWidth: 180 });
    doc.text(`Der Auftragnehmer verpflichtet sich, unverzüglich auf Änderungsanforderungen zu reagieren und eine schriftliche Einschätzung der Auswirkungen auf den Umfang, die Zeitplanung und die Leistungen zu erstellen.`, 10, 105, { maxWidth: 180 });

    if (selectedKunde.auftragsTyp === 'Webseite') {
      doc.text('3. Admin-Rolle und Bearbeitung der Webseite', 10, 125);
      doc.text(`Der Auftraggeber erhält das Recht, die Webseite in seiner Funktion als Administrator zu bearbeiten und Änderungen vorzunehmen. Dies umfasst die Möglichkeit, Inhalte, Bilder, Texte, Videos und andere Informationen auf der Webseite eigenständig zu verwalten und zu aktualisieren.`, 10, 135, { maxWidth: 180 });
      doc.text(`Der Auftragnehmer wird dem Auftraggeber eine benutzerfreundliche und sichere Admin-Oberfläche zur Verfügung stellen, die es dem Auftraggeber ermöglicht, Änderungen an der Webseite vorzunehmen, ohne die Integrität oder Funktionsfähigkeit der Webseite zu beeinträchtigen.`, 10, 150, { maxWidth: 180 });
    }

    doc.save('Vertrag.pdf');
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
    <div className="vertrag-anzeigen-container">
      <div className="vertrag-anzeigen">
        <h2>Vertrag</h2>
        {selectedKunde ? (
          <>
            <p className="vertrag-text">Zwischen {selectedKunde.vorname} {selectedKunde.nachname}, im Folgenden „Auftraggeber“ genannt, und TBs Solutions, im Folgenden „Auftragnehmer“ genannt, wird folgender Vertrag betreffend der Dienstleistung {selectedKunde.auftragsTyp} geschlossen.</p>
            <p className="vertrag-text">1. Leistungsgegenstand</p>
            <p className="vertrag-text">Der Auftragnehmer verpflichtet sich, die Dienstleistung des Auftraggebers gemäß den detaillierten Spezifikationen und Anforderungen, wie in Anlage 1 festgelegt, fachgerecht auszuführen.</p>
            <p className="vertrag-text">2. Änderung der Anforderungen</p>
            <p className="vertrag-text">Der Auftraggeber hat das Recht, die Anforderungen an die Dienstleistungen jederzeit zu ändern, sofern dies schriftlich mitgeteilt wird. Änderungsanforderungen können sich auf Design, Funktionalität, Inhalte und weitere Aspekte der Dienstleistung beziehen.</p>
            <p className="vertrag-text">Der Auftragnehmer verpflichtet sich, unverzüglich auf Änderungsanforderungen zu reagieren und eine schriftliche Einschätzung der Auswirkungen auf den Umfang, die Zeitplanung und die Leistungen zu erstellen.</p>

            {selectedKunde.auftragsTyp === 'Webseite' && (
              <>
                <p className="vertrag-text">3. Admin-Rolle und Bearbeitung der Webseite</p>
                <p className="vertrag-text">Der Auftraggeber erhält das Recht, die Webseite in seiner Funktion als Administrator zu bearbeiten und Änderungen vorzunehmen. Dies umfasst die Möglichkeit, Inhalte, Bilder, Texte, Videos und andere Informationen auf der Webseite eigenständig zu verwalten und zu aktualisieren.</p>
                <p className="vertrag-text">Der Auftragnehmer wird dem Auftraggeber eine benutzerfreundliche und sichere Admin-Oberfläche zur Verfügung stellen, die es dem Auftraggeber ermöglicht, Änderungen an der Webseite vorzunehmen, ohne die Integrität oder Funktionsfähigkeit der Webseite zu beeinträchtigen.</p>
              </>
            )}
            
            <div className="code-container">
              <p className="code"><strong>Code:</strong> {selectedKunde.code}</p>
              <button className="copy-button" onClick={copyCode}>
                <FaCopy />
                {copied ? 'Code kopiert!' : 'Code kopieren'}
              </button>
            </div>

            <button className="pdf-button" onClick={generatePDF}>PDF generieren</button>
          </>
        ) : (
          <div>Keine Daten gefunden</div>
        )}
      </div>
    </div>
  );
};

export default Vertrag;
