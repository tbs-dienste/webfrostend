import React, { useState } from 'react';
import './PaymentPrompt.scss';

const PaymentPrompt = () => {
  const [showMessage, setShowMessage] = useState(true);

  const handleCancel = () => {
    setShowMessage(false);
    // Hier kannst du eine Funktion hinzufügen, um den Abbruch zu handhaben
  };

  const handleContinue = () => {
    setShowMessage(false);
    // Hier kannst du eine Funktion hinzufügen, um den "Weiter"-Button zu handhaben
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
    </>
  );
};

export default PaymentPrompt;
