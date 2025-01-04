import React, { useState } from "react";
import "./IncomeExpenseForm.scss";

const IncomeExpenseForm = () => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (e.target.value !== "sonstiges") {
      setOtherReason(""); // Zurücksetzen, wenn "Sonstiges" nicht gewählt ist
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const type = income ? "Einnahme" : "Ausgabe";
    const amount = income || expense;

    if (!amount || !reason || (reason === "sonstiges" && !otherReason)) {
      alert("Bitte füllen Sie alle Felder aus!");
      return;
    }

    const finalReason = reason === "sonstiges" ? otherReason : reason;

    alert(`Typ: ${type}\nBetrag: ${amount} €\nGrund: ${finalReason}`);

    // Optional: Daten speichern oder an eine API senden
    console.log("Erfasste Daten:", { type, reason: finalReason, amount });

    // Felder zurücksetzen
    setIncome("");
    setExpense("");
    setReason("");
    setOtherReason("");
  };

  return (
    <form className="income-expense-form" onSubmit={handleSubmit}>
      <h2>Einnahmen/Ausgaben erfassen</h2>

      <div className="form-group">
        <label htmlFor="reason">Grund</label>
        <select
          id="reason"
          value={reason}
          onChange={handleReasonChange}
          required
        >
          <option value="">Wähle einen Grund</option>
          <option value="verpflegung">Verpflegung</option>
          <option value="druck">Druck</option>
          <option value="miete">Miete</option>
          <option value="sonstiges">Sonstiges</option>
        </select>
      </div>

      {reason === "sonstiges" && (
        <div className="form-group">
          <label htmlFor="otherReason">Genaue Beschreibung</label>
          <input
            id="otherReason"
            type="text"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="Bitte geben Sie einen genauen Grund an"
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Betrag (€)</label>
        <input
          type="number"
          value={income}
          onChange={(e) => {
            setIncome(e.target.value);
            setExpense(""); // Einnahme priorisieren
          }}
          placeholder="Einnahme eingeben"
        />
        <input
          type="number"
          value={expense}
          onChange={(e) => {
            setExpense(e.target.value);
            setIncome(""); // Ausgabe priorisieren
          }}
          placeholder="Ausgabe eingeben"
        />
      </div>

      <button type="submit" className="submit-button">
        Speichern
      </button>
    </form>
  );
};

export default IncomeExpenseForm;
