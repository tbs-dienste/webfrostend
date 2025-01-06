import React, { useState } from "react";
import "./IncomeExpenseForm.scss";

const IncomeExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CHF");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showKeypad, setShowKeypad] = useState(true);
  const [mode, setMode] = useState(""); // "income" oder "expense"

  const handleNumberClick = (value) => {
    setAmount((prev) => prev + value);
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (!amount) {
      alert("Bitte einen Betrag eingeben!");
      return;
    }
    setShowKeypad(false); // Nummernfeld ausblenden
  };

  const handleReset = () => {
    setAmount("");
    setReason("");
    setOtherReason("");
    setMode("");
    setShowKeypad(true); // Nummernfeld anzeigen
  };

  const handleSubmit = () => {
    if (!reason || (reason === "sonstiges" && !otherReason)) {
      alert("Bitte einen Grund auswählen oder eingeben!");
      return;
    }

    const finalReason = reason === "sonstiges" ? otherReason : reason;
    const type = mode === "income" ? "Einnahme" : "Ausgabe";

    alert(`Typ: ${type}\nBetrag: ${amount} ${currency}\nGrund: ${finalReason}`);
    handleReset(); // Formular zurücksetzen
  };

  return (
    <div className="income-expense-container">
      <div className="top-section">
        <div className="form-group">
          <label>Betrag</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Betrag eingeben"
            disabled={!showKeypad}
          />
        </div>
        <div className="form-group">
          <label>Grund</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={showKeypad}
          >
            <option value="">Wähle einen Grund</option>
            {mode === "income" && (
              <>
                <option value="eroeffnungsdifferenz">Eröffnungsdifferenz</option>
                <option value="abschlussdifferenz">Abschlussdifferenz</option>
                <option value="stockeinlage">Stockeinlage</option>
                <option value="gebuehrtoilette">Gebühr Toilette</option>
                <option value="umtriebsentschaedigung">Umtriebsentschädigung</option>

              </>
            )}
            {mode === "expense" && (
              <>
                <option value="bueromaterial">Büromaterial 8.1%</option>
                <option value="mwstruckestattung">MWST-Rückerst. 0%</option>
                <option value="porto">Porto 8.1%</option>
              </>
            )}
          </select>
         
        </div>
        <div className="form-group">
          <label>Währung</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={showKeypad}
          >
            <option value="CHF">CHF</option>
            <option value="Euro">Euro</option>
          </select>
        </div>
      </div>

      {showKeypad && (
        <div className="keypad-section">
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </button>
            ))}
            <button onClick={handleBackspace}>⌫</button>
          </div>
          <div className="action-buttons">
            <button onClick={handleReset}>Löschen</button>
            <button onClick={handleConfirm}>Bestätigen</button>
          </div>
        </div>
      )}

  
        <div className="bottom-buttons">
          <button disabled>X</button>
          <button onClick={() => setMode("income")}>Einnahmen</button>
          <button onClick={() => setMode("expense")}>Ausgaben</button>
          <button disabled>X</button>
          <button>Heute</button>
          <button>Alle</button>
          <button>Drucken</button>
          <button>Storno</button>
          <button onClick={handleSubmit}>Übernehmen</button>
          <button onClick={handleReset}>Exit</button>
        </div>
 
    </div>
  );
};

export default IncomeExpenseForm;
