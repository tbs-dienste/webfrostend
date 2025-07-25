import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import firmalogo from '../../logo.png'; // Dein Logo
import styles from './Auftragsbestaetigung.scss'; // Importieren der SCSS-Datei

const Auftragsbestaetigung = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projektDauer, setProjektDauer] = useState(''); // State für Projektdauer

  useEffect(() => {
    async function fetchKunde() {
      try {
        const token = localStorage.getItem('token'); // Token aus localStorage abrufen
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Token im Header senden
          }
        });
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
    const margin = 20; // Margin from left and top
    const maxWidth = doc.internal.pageSize.width - 2 * margin; // Maximum width for text
    const lineHeight = 5; // Standard Zeilenhöhe für die meisten Texte
    const smallLineHeight = 3; // Kleinere Zeilenhöhe für den Projektzeitplan
    const detailSpacing = 5; // Abstand für Auftragsdetails

    // Funktion zur Handhabung von Textumbrüchen mit Trunkierung
    const addText = (text, x, y, truncate = false, customLineHeight = lineHeight) => {
      if (truncate) {
        // Trunkiere Text, falls er 255 Zeichen überschreitet und füge Ellipsen hinzu
        if (text.length > 255) {
          text = text.substring(0, 252) + '...';
        }
      }
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, x, y + index * customLineHeight);
      });
      return y + lines.length * customLineHeight;
    };

    // Firmenlogo und Firmenanschrift
    const logoWidth = 40; // Breite des Logos
    const logoHeight = 20; // Höhe des Logos
    const logoX = margin;
    const logoY = margin;
    doc.addImage(firmalogo, 'PNG', logoX, logoY, logoWidth, logoHeight);

    const addressX = margin;
    let addressY = logoY + logoHeight + 10;

    // Kleinere Schriftgröße für die Firmenanschrift
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    addressY = addText('TBs Solutions GmbH', addressX, addressY);
    addressY = addText('Musterstraße 1', addressX, addressY);
    addressY = addText('12345 Musterstadt', addressX, addressY);
    addressY = addText('Deutschland', addressX, addressY);
    addressY = addText('Tel: +49 123 456789', addressX, addressY);
    addressY = addText('Email: info@tbssolutions.de', addressX, addressY);

    // Kundenanschrift
    const kundenAddressY = addressY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    addText(`${selectedKunde.vorname} ${selectedKunde.nachname}`, addressX, kundenAddressY);
    addText(`${selectedKunde.strasseHausnummer}`, addressX, kundenAddressY + lineHeight);
    addText(`${selectedKunde.postleitzahl} ${selectedKunde.ort}`, addressX, kundenAddressY + 2 * lineHeight);

    // Titel
    const titleY = kundenAddressY + 30;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    addText('Auftragsbestätigung', addressX, titleY);

    // Text der Bestätigung
    const textY = titleY + 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const startDate = new Date().toLocaleDateString('de-DE');
    addText(`Sehr geehrter Herr/Frau ${selectedKunde.nachname},`, addressX, textY);
    addText(`wir möchten uns herzlich für das Vertrauen bedanken, das Sie in unser Unternehmen setzen. Im Folgenden erhalten Sie eine detaillierte Auftragsbestätigung für die von Ihnen beauftragte Dienstleistung ${selectedKunde.auftragsTyp}.`, addressX, textY + lineHeight);

    doc.setFont('helvetica', 'bold');
    let currentY = textY + 4 * lineHeight; // Mehr Platz zwischen Bestätigungstext und Auftragsdetails
    addText('Auftragsdetails:', addressX, currentY);
    doc.setFont('helvetica', 'normal');
    currentY = addText(`Auftragsnummer: ${selectedKunde.auftragsnummer}`, addressX, currentY + detailSpacing);
    currentY = addText(`Dienstleistung: ${selectedKunde.auftragsTyp}`, addressX, currentY + detailSpacing);

    // Dienstleistungen auflisten
    currentY = addText('Dienstleistungen:', addressX, currentY + detailSpacing);
    selectedKunde.dienstleistungen.forEach((dienstleistung) => {
      currentY = addText(`- ${dienstleistung.title}`, addressX, currentY + detailSpacing);
    });

    // Beschränke Beschreibung auf 255 Zeichen
    const beschreibung = selectedKunde.auftragsBeschreibung;
    currentY = addText(`Beschreibung: ${beschreibung}`, addressX, currentY + lineHeight, true);

    doc.setFont('helvetica', 'bold');
    currentY = addText('Projektzeitplan:', addressX, currentY + 2 * lineHeight);
    doc.setFont('helvetica', 'normal');
    // Startdatum und Projektdauer mit kleinerer Zeilenhöhe
    currentY = addText(`Startdatum: ${startDate}`, addressX, currentY + smallLineHeight, false, smallLineHeight);
    currentY = addText(`Voraussichtliche Projektdauer: ${projektDauer} Wochen`, addressX, currentY + smallLineHeight, false, smallLineHeight);

    doc.setFont('helvetica', 'bold');
    currentY = addText('Kontaktinformationen:', addressX, currentY + 2 * lineHeight);
    doc.setFont('helvetica', 'normal');
    addText('Falls Sie Fragen, Anliegen oder zusätzliche Anforderungen haben, steht Ihnen unser Team jederzeit zur Verfügung. Zögern Sie nicht, uns zu kontaktieren, wir sind gerne für Sie da.', addressX, currentY + lineHeight);

    // Mehr Abstand vor dem Gruß
    const closingY = currentY + 2 * lineHeight + 10; // 10 mm zusätzlicher Platz
    addText('Mit freundlichen Grüßen,', addressX, closingY);
    addText('Ihr TBs Solutions Team', addressX, closingY + lineHeight);

    // PDF speichern
    doc.save('Auftragsbestaetigung.pdf');
  };

  if (loading) {
    return <div>Lade Kunde...</div>;
  }

  return (
    <div className={styles['auftrag-bestaetigung-container']}>
      <div className={styles['auftrag-bestaetigung']}>
        <header>
          <img src={firmalogo} alt="Firmenlogo" className={styles['logo']} />
          <div className={styles['company-info']}>
            <h1>TBs Solutions GmbH</h1>
            <p>3001 Bern</p>
          </div>
        </header>
        <h2>Auftragsbestätigung</h2>
        {selectedKunde ? (
          <>
            <div className={styles['kunden-anschrift']}>
              <h3>Kundenanschrift</h3>
              <p>{selectedKunde.vorname} {selectedKunde.nachname}</p>
              <p>{selectedKunde.strasseHausnummer}</p>
              <p>{selectedKunde.postleitzahl} {selectedKunde.ort}</p>
            </div>
            <p className={styles['auftrag-text']}>Sehr geehrter Herr/Frau {selectedKunde.nachname},</p>
            <p className={styles['auftrag-text']}>Wir möchten uns herzlich für das Vertrauen bedanken, das Sie in unser Unternehmen setzen. Im Folgenden erhalten Sie eine detaillierte Auftragsbestätigung für die von Ihnen beauftragte Dienstleistung {selectedKunde.auftragsTyp}.</p>
            <h3>Auftragsdetails</h3>
            <p>Auftragsnummer: {selectedKunde.auftragsnummer}</p>
            <p>Dienstleistung: {selectedKunde.auftragsTyp}</p>
            <h4>Dienstleistungen:</h4>
            <ul>
              {selectedKunde.dienstleistungen.map((dienstleistung) => (
                <li key={dienstleistung.id}>{dienstleistung.title}</li>
              ))}
            </ul>
            <p>Beschreibung: {selectedKunde.auftragsBeschreibung.length > 255 ? `${selectedKunde.auftragsBeschreibung.substring(0, 252)}...` : selectedKunde.auftragsBeschreibung}</p>
            <h3>Projektzeitplan</h3>
            <p>Startdatum: {new Date().toLocaleDateString('de-DE')}</p>
            <p>Voraussichtliche Projektdauer: {projektDauer} Wochen</p>
            <h3>Kontaktinformationen</h3>
            <p>Falls Sie Fragen, Anliegen oder zusätzliche Anforderungen haben, steht Ihnen unser Team jederzeit zur Verfügung. Zögern Sie nicht, uns zu kontaktieren, wir sind gerne für Sie da.</p>
            <p>Mit freundlichen Grüßen,</p>
            <p>Ihr TBs Solutions Team</p>
            <button onClick={generatePDF}>PDF generieren</button>
          </>
        ) : (
          <p>Kundeninformationen konnten nicht geladen werden.</p>
        )}
      </div>
    </div>
  );
};

export default Auftragsbestaetigung;
