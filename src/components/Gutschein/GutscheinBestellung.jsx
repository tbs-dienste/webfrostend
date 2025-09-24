import React, { useState } from "react";
import "./GutscheinBestellung.scss";

const GutscheinBestellung = () => {
  const predefinedAmounts = [10, 20, 50, 100, 200];
  const [voucherCounts, setVoucherCounts] = useState(
    predefinedAmounts.reduce((acc, amount) => ({ ...acc, [amount]: 0 }), { custom: 0 })
  );
  const [customAmount, setCustomAmount] = useState(0);

  const [step, setStep] = useState("select"); // "select" = Gutscheine, "form" = Kontaktdaten

  const [formData, setFormData] = useState({
    vorname: "",
    nachname: "",
    email: "",
    adresse: "",
    plz: "",
    ort: "",
  });

  const updateVoucherCount = (key, increment) => {
    setVoucherCounts((prev) => ({
      ...prev,
      [key]: Math.min(15, Math.max(0, prev[key] + increment)),
    }));
  };

  const calculateTotalAmount = () => {
    const total =
      predefinedAmounts.reduce(
        (total, amount) => total + amount * voucherCounts[amount],
        0
      ) + customAmount * voucherCounts.custom;

    return Math.max(10, Math.floor(total / 2) * 2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = {
      vouchers: voucherCounts,
      customAmount,
      total: calculateTotalAmount(),
      kunde: formData,
    };

    console.log("Bestellung abgeschickt:", order);
    alert("Vielen Dank! Ihre Gutscheinbestellung wurde erfolgreich übermittelt.");
  };

  return (
    <div className="voucher-selector">
      {step === "select" && (
        <>
          <h2>Wähle deine Gutscheine</h2>
          <div className="voucher-grid">
            {predefinedAmounts.map((amount) => (
              <div key={amount} className="voucher-box">
                <div className="amount">
                  {amount}
                  <sup>CHF</sup>
                </div>
                <div className="controls">
                  <button
                    onClick={() => updateVoucherCount(amount, -1)}
                    disabled={voucherCounts[amount] === 0}
                  >
                    -
                  </button>
                  <span>{voucherCounts[amount]}</span>
                  <button
                    onClick={() => updateVoucherCount(amount, 1)}
                    disabled={voucherCounts[amount] === 15}
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
                    const value = Math.max(
                      0,
                      Math.min(2000, Number(e.target.value))
                    );
                    setCustomAmount(value);
                  }}
                />
                <sup>CHF</sup>
              </div>
              <div className="controls">
                <button
                  onClick={() => updateVoucherCount("custom", -1)}
                  disabled={voucherCounts.custom === 0}
                >
                  -
                </button>
                <span>{voucherCounts.custom}</span>
                <button
                  onClick={() => updateVoucherCount("custom", 1)}
                  disabled={voucherCounts.custom === 15}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="total-amount">
            <strong>Gesamtbetrag: {calculateTotalAmount()} CHF</strong>
          </div>

          <div className="next-step">
            <button
              onClick={() => setStep("form")}
              disabled={calculateTotalAmount() < 10}
            >
              Weiter
            </button>
          </div>
        </>
      )}

      {step === "form" && (
        <form className="order-form" onSubmit={handleSubmit}>
          <h2>Ihre Kontaktdaten</h2>

          <div className="form-group">
            <label>Vorname</label>
            <input
              type="text"
              value={formData.vorname}
              onChange={(e) =>
                setFormData({ ...formData, vorname: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Nachname</label>
            <input
              type="text"
              value={formData.nachname}
              onChange={(e) =>
                setFormData({ ...formData, nachname: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>E-Mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) =>
                setFormData({ ...formData, adresse: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group-inline">
            <div className="form-group">
              <label>PLZ</label>
              <input
                type="text"
                value={formData.plz}
                onChange={(e) =>
                  setFormData({ ...formData, plz: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Ort</label>
              <input
                type="text"
                value={formData.ort}
                onChange={(e) =>
                  setFormData({ ...formData, ort: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="summary">
            <strong>Zu zahlender Betrag: {calculateTotalAmount()} CHF</strong>
          </div>

          <button type="submit" className="submit-btn">
            Bestellung abschicken
          </button>
        </form>
      )}
    </div>
  );
};

export default GutscheinBestellung;
