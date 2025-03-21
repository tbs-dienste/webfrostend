import React, { useState } from 'react';
import './PaymentPrompt.scss';

const PaymentPrompt = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false); // Zustand für das Quittungspopup

  const cardTypes = [
    'VISA', 'MasterCard', 'Maestro', 'TWINT', 'AMEX', 'Discover'
  ];

  const handleCancel = () => {
    setShowMessage(false);
  };

  const handleContinue = () => {
    if (selectedCard) {
      // Kartentyp im localStorage speichern
      localStorage.setItem('kartentyp', selectedCard);

      setShowMessage(false);
      console.log(`Zahlung mit ${selectedCard} fortgesetzt. Kartentyp wurde im localStorage gespeichert.`);

      // Zeige das Quittungspopup nach 3 Sekunden
      setTimeout(() => {
        setShowReceipt(true);
      }, 2100); // Wartezeit von 3 Sekunden
    } else {
      alert('Bitte wählen Sie eine Zahlungsmethode!');
    }
  };

  const handleCardSelection = (cardType) => {
    setSelectedCard(cardType);
  };

  const closeReceiptPopup = () => {
    setShowReceipt(false); // Schließt das Quittungspopup
  };

  return (
    <>
      {showMessage && (
        <div className="payment-prompt-overlay">
          <div className="payment-prompt-box">
            <p className="payment-prompt-text">POS ist beschäftigt.</p>
            <p className="payment-prompt-subtext">Bitte beachten Sie die Anzeige auf dem POS!</p>
            <p className="payment-prompt-subtext">Bitte geben Sie den richtigen Total Betrag ein auf dem POS!</p>
            <p className="payment-prompt-subtext">
              Bitte drucken Sie den POS Beleg 2x aus. Eine Kopie bitte für die Sicherheit aufbewahren, die andere
              Kopie zu den Kreditoren legen, damit alles zusammen abgeheftet wird.
            </p>

            <div className="payment-prompt-card-selection">
              <p className="payment-prompt-card-title">Wählen Sie Ihre Zahlungsmethode:</p>
              <div className="card-buttons">
                {cardTypes.map((card) => (
                  <button
                    key={card}
                    className={`payment-prompt-card-button ${selectedCard === card ? 'selected' : ''}`}
                    onClick={() => handleCardSelection(card)}
                  >
                    {card}
                  </button>
                ))}
              </div>
            </div>

            <div className="payment-prompt-buttons">
              <button className="payment-prompt-button cancel" onClick={handleCancel}>
                Abbrechen
              </button>
              <button className="payment-prompt-button continue" onClick={handleContinue}>
                Weiter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quittungspopup, das nach der Wartezeit erscheint */}
      {showReceipt && (
        <div className="receipt-popup-overlay">
          <div className="receipt-popup-box">
            <h2>*** EFT-Beleg ***</h2>
            <p>Buchung</p>
            <p>VISA contactless</p>
            <p>VISA XXXXXXXXX8470</p>
            <p>Trm-Id: 3821</p>
            <p>Akt-Id: 93330</p>
            <p>AID: 708</p>
            <p>Trx. Seq-Cnt: 79331407165</p>
            <p>Trx. Ref-No: 258PQHRJRA</p>
            <p>Auth. Code: JHEAQI</p>
            <p>Emv_ATC: 0GKTWTRYIT79AV2FLBM8J7FP2QR4U2P5</p>
            <p>Mixed Code: FLD035Y4KYTTTJDRYQ1U8RUWXYHAFJ53</p>
            <p>Total-EFT CHF: 5.00</p>
            <p>Worldline</p>
            <hr />
           
            <button onClick={closeReceiptPopup}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentPrompt;
