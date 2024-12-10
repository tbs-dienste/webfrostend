import React, { useState } from "react";
import "./GutscheinBestellung.scss";

const GutscheinBestellung = () => {
  const predefinedAmounts = [10, 20, 50, 100, 200];
  const [voucherCounts, setVoucherCounts] = useState(
    predefinedAmounts.reduce((acc, amount) => ({ ...acc, [amount]: 0 }), { custom: 0 })
  );
  const [customAmount, setCustomAmount] = useState(0); // Separater Zustand für benutzerdefinierten Betrag

  const updateVoucherCount = (key, increment) => {
    setVoucherCounts((prev) => ({
      ...prev,
      [key]: Math.min(15, Math.max(0, prev[key] + increment)), // Begrenzung zwischen 0 und 15
    }));
  };

  const calculateTotalAmount = () => {
    const total = predefinedAmounts.reduce((total, amount) => total + amount * voucherCounts[amount], 0) + customAmount * voucherCounts.custom;

    // Nur gerade Zahlen und mindestens 10 CHF akzeptieren
    return Math.max(10, Math.floor(total / 2) * 2); // Rundet auf nächste gerade Zahl und stellt sicher, dass mind. 10 CHF
  };

  return (
    <div className="voucher-selector">
      <h2>Wähle deine Gutscheine</h2>
      <div className="voucher-grid">
        {/* Predefined Amounts */}
        {predefinedAmounts.map((amount) => (
          <div key={amount} className="voucher-box">
            <div className="amount">
              {amount}
              <sup>CHF</sup>
            </div>
            <div className="controls">
              <button
                onClick={() => updateVoucherCount(amount, -1)}
                disabled={voucherCounts[amount] === 0} // Deaktiviert bei 0
              >
                -
              </button>
              <span>{voucherCounts[amount]}</span>
              <button
                onClick={() => updateVoucherCount(amount, 1)}
                disabled={voucherCounts[amount] === 15} // Deaktiviert bei 15
              >
                +
              </button>
            </div>
          </div>
        ))}

        {/* Custom Amount */}
        <div className="voucher-box custom-box">
          <div className="amount">
            <input
              type="number"
              min="0"
              max="2000"
              placeholder="0"
              value={customAmount > 0 ? customAmount : ""}
              onChange={(e) => {
                const value = Math.max(0, Math.min(2000, Number(e.target.value))); // Begrenzung des Betrags
                setCustomAmount(value);
              }}
            />
            <sup>CHF</sup>
          </div>
          <div className="controls">
            <button
              onClick={() => updateVoucherCount("custom", -1)}
              disabled={voucherCounts.custom === 0} // Deaktiviert bei 0
            >
              -
            </button>
            <span>{voucherCounts.custom}</span>
            <button
              onClick={() => updateVoucherCount("custom", 1)}
              disabled={voucherCounts.custom === 15} // Deaktiviert bei 15
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Summe */}
      <div className="total-amount">
        <strong>Gesamtbetrag: {calculateTotalAmount()} CHF</strong>
      </div>
    </div>
  );
};

export default GutscheinBestellung;
