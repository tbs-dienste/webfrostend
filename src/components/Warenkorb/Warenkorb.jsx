import React, { useEffect, useState } from 'react';
import './Warenkorb.scss'; // Importieren Sie das SCSS-Styling
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

const Warenkorb = ({ removeFromCart, updateQuantity, completeOrder }) => {
  const [warenkorbProdukte, setWarenkorbProdukte] = useState([]);

  useEffect(() => {
    // GET-Anfrage auf den Gutschein im Local Storage
    const gutscheinImLocalStorage = JSON.parse(localStorage.getItem('gutschein'));
    const kursImLocalStorage = JSON.parse(localStorage.getItem('warenkorb'));
    const warenkorbProdukte = [];

    if (gutscheinImLocalStorage) {
      warenkorbProdukte.push(gutscheinImLocalStorage);
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

  const handleDownloadGutschein = () => {
    // Implementierung zum Herunterladen des Gutscheins
    // ...

    // Beispielcode zum Entfernen des Gutscheins aus dem Warenkorb nach dem Herunterladen
    localStorage.removeItem('gutschein');
    setWarenkorbProdukte([]);
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
