import React, { useEffect, useState } from 'react';
import './Warenkorb.scss'; // Importieren Sie das SCSS-Styling
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

const Warenkorb = ({ updateQuantity, completeOrder }) => {
  const [warenkorbProdukte, setWarenkorbProdukte] = useState([]);
  const [gutscheinBetrag, setGutscheinBetrag] = useState(null);

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

  const handleDownloadGutschein = () => {
    // Erstellen Sie einen neuen PDF-Dokument mit jsPDF
    const doc = new jsPDF();

    // Gutschein-Text
    const gutscheinText = `Dieser Gutschein berechtigt Sie zu einem Rabatt von ${gutscheinBetrag}€ auf Ihren Einkauf.`;
    
    // Positionen und Abstände für Text und Barcode
    const textX = 20;
    const textY = 20;
    const barcodeMargin = 10;
    const barcodeY = textY + 40;
    
    // Fügen Sie den Gutschein-Text hinzu
    doc.text("Gutschein", textX, textY);
    doc.text(gutscheinText, textX, textY + 10);

    // Generieren Sie den Barcode aus der Gutschein-ID und dem Betrag
    const barcodeValue = `${warenkorbProdukte[0].id}${gutscheinBetrag}`;
    
    // Barcode hinzufügen
    JsBarcode(doc, barcodeValue, {
      format: 'CODE128',
      displayValue: false,
      fontSize: 10,
      margin: barcodeMargin
    });

    // Zeichnen Sie den Barcode auf den Gutschein
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcodeValue, { format: 'CODE128' });
    const imageData = canvas.toDataURL('image/png');
    doc.addImage(imageData, 'PNG', textX, barcodeY, 100, 40);

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
    </div>
  );
}

export default Warenkorb;
