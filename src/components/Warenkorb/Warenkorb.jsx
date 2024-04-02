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
    // Erstellen Sie einen neuen PDF-Dokument mit jsPDF
    const doc = new jsPDF();

    // Hintergrundfarbe für den Gutschein festlegen
    doc.setFillColor('#f9f9f9');
    doc.rect(0, 0, 210, 297, 'F');

    // Logo hinzufügen
    doc.addImage(logo, 'PNG', 15, 15, 50, 20);

    // Titel hinzufügen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor('#333');
    doc.text("Gutschein", 15, 50);

    // QR-Code hinzufügen
    const qrText = "https://tb-solutions.vercel.app";
    const qrCanvas = qrCanvasRef.current;
    try {
      await QRCode.toCanvas(qrCanvas, qrText);
      const qrDataUrl = qrCanvas.toDataURL();
      doc.addImage(qrDataUrl, 'PNG', 120, 60, 50, 50);
    } catch (error) {
      console.error("Fehler beim Generieren des QR-Codes:", error);
    }

    // Gutschein-Text
    const gutscheinText = `Nutzen Sie diesen Gutschein für Ihren nächsten Einkauf und erhalten Sie einen Rabatt von ${gutscheinBetrag}€.`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#555');
    doc.text(gutscheinText, 15, 130, { maxWidth: 180 });

    // Generieren Sie den Barcode aus der Gutschein-ID und dem Betrag
    const barcodeValue = `${warenkorbProdukte[0].id}${gutscheinBetrag}`;

    // Barcode als Canvas generieren
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, barcodeValue, {
      format: 'CODE128',
      displayValue: false,
      fontSize: 10
    });
    
    // Barcode als Bild in das PDF einfügen
    doc.addImage(barcodeCanvas.toDataURL('image/png'), 'PNG', 15, 160, 100, 30);

    // Gutscheincode hinzufügen
    doc.text(`Gutscheincode: ${warenkorbProdukte[0].gutscheincode}`, 15, 200);

    // Zusätzlicher Text
    doc.text("Gültig bis zum nächsten Einkauf.", 15, 210);
    doc.text("Keine Barauszahlung möglich.", 15, 220);

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
