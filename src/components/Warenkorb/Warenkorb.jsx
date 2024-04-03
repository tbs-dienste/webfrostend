import React, { useEffect, useState, useRef } from 'react';
import './Warenkorb.scss'; // Importieren Sie das SCSS-Styling
import { jsPDF } from 'jspdf';
import logo from '../../logo.png'; // Importieren Sie das Logo-Bild
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

const Warenkorb = ({ updateQuantity, completeOrder }) => {
  const [warenkorbProdukte, setWarenkorbProdukte] = useState([]);
  const [gutscheinBetrag, setGutscheinBetrag] = useState(null);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    // GET-Anfrage auf den Gutschein im Local Storage
    const gutscheinImLocalStorage = JSON.parse(localStorage.getItem('gutschein'));
    const kursImLocalStorage = JSON.parse(localStorage.getItem('warenkorb'));
    const warenkorbProdukte = [];

    if (gutscheinImLocalStorage) {
      warenkorbProdukte.push(gutscheinImLocalStorage);
      setGutscheinBetrag(gutscheinImLocalStorage.betrag);
    }

    if (kursImLocalStorage) {
      warenkorbProdukte.push(...kursImLocalStorage);
    }

    // Stellen Sie sicher, dass der Preis als Zahl gespeichert wird
    const warenkorbMitPreisAlsZahl = warenkorbProdukte.map(produkt => ({
      ...produkt,
      preis: parseFloat(produkt.preis)
    }));

    setWarenkorbProdukte(warenkorbMitPreisAlsZahl);
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = warenkorbProdukte.filter(product => product.id !== productId);
    setWarenkorbProdukte(updatedCart);
  };

  const handleDownloadGutschein = async () => {
    // Gutscheininformationen aus dem Local Storage abrufen
    const gutscheinImLocalStorage = JSON.parse(localStorage.getItem('gutschein'));
  
    // Erstellen Sie einen neuen PDF-Dokument mit jsPDF
    const doc = new jsPDF();
  
    // Hintergrundfarbe für den Gutschein festlegen
    doc.setFillColor('#ffffff');
    doc.rect(0, 0, 210, 297, 'F');
  
    // Logo hinzufügen
    doc.addImage(logo, 'PNG', 15, 15, 50, 20);
  
    // Titel hinzufügen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor('#333');
    doc.text("Gutschein", 105, 50, null, null, 'center');
  
    // QR-Code hinzufügen (oben rechts)
    const qrText = "https://tb-solutions.vercel.app";
    const qrCanvas = qrCanvasRef.current;
    try {
      await QRCode.toCanvas(qrCanvas, qrText);
      const qrDataUrl = qrCanvas.toDataURL();
      doc.addImage(qrDataUrl, 'PNG', 145, 20, 50, 50);
    } catch (error) {
      console.error("Fehler beim Generieren des QR-Codes:", error);
    }

  
    // Absender und Empfänger hinzufügen
    doc.setFont('helvetica', 'normal');
    doc.text("von", 105, 100, null, null, 'center');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(gutscheinImLocalStorage.absender, 105, 110, null, null, 'center');
    doc.setFont('helvetica', 'bold');
    doc.text("für", 105, 120, null, null, 'center');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(gutscheinImLocalStorage.empfaenger, 105, 130, null, null, 'center');
  
    // Gutscheinwert und Code hinzufügen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text("Gutscheinwert:", 105, 140, null, null, 'center');
    doc.setFont('helvetica', 'normal');
    doc.text(`${gutscheinImLocalStorage.betrag}€`, 105, 150, null, null, 'center');
    doc.setFont('helvetica', 'bold');
    doc.text("Gutscheincode:", 105, 160, null, null, 'center');
    doc.setFont('helvetica', 'normal');
    doc.text(gutscheinImLocalStorage.gutscheincode, 105, 170, null, null, 'center');
  
    // Zusätzlicher Text
    doc.setFontSize(10);
    doc.setTextColor('#666');
    doc.text("Gültig bis zum nächsten Einkauf.", 105, 200, null, null, 'center');
    doc.text("Keine Barauszahlung möglich.", 105, 220, null, null, 'center');
  
    // Speichern Sie das Dokument als PDF-Datei
    doc.save('gutschein.pdf');
  };
  
  

  return (
    <div className="warenkorb-container">
      <h2 className="warenkorb-heading">Warenkorb</h2>
      <ul className="warenkorb-list">
        {warenkorbProdukte.map(produkt => (
          <li key={produkt.id} className="warenkorb-item">
            <span className="warenkorb-item-title">{produkt.titel}</span>
            <span className="warenkorb-item-price">€{produkt.preis.toFixed(2)}</span>
            <button onClick={() => removeFromCart(produkt.id)}>Entfernen</button>
          </li>
        ))}
      </ul>
      <button onClick={completeOrder}>Bezahlen</button>
      <button onClick={handleDownloadGutschein}>Gutschein herunterladen</button>
      <canvas ref={qrCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default Warenkorb;
