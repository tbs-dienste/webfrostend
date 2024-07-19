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
    // Kein Initialisierungscode im useEffect
    // wenn du nicht möchtest, dass der Warenkorb bei jedem Laden der Komponente wiederhergestellt wird
  }, []); // Leer lassen, damit dieser Effekt nur einmalig ausgeführt wird

  const removeFromCart = (productId) => {
    const updatedCart = warenkorbProdukte.filter(product => product.id !== productId);
    setWarenkorbProdukte(updatedCart);
  };

  const handleDownloadGutschein = async () => {
    // Implementierung wie zuvor
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
