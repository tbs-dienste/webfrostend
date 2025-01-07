import React, { useState } from "react";
import "./IncomeExpenseForm.scss";

const IncomeExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CHF");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showKeypad, setShowKeypad] = useState(true);
  const [activeMode, setActiveMode] = useState(null); // Zustand für den aktiven Button

  const [mode, setMode] = useState(""); // "income" oder "expense"

  const handleNumberClick = (value) => {
    setAmount((prev) => prev + value);
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };
  const handleModeChange = (mode) => {
    setMode(mode);
    setActiveMode(mode);
  };
  

  const toggleSign = () => {
    setAmount((prev) => {
      if (!prev) return "-";
      return prev.startsWith("-") ? prev.slice(1) : `-${prev}`;
    });
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "+/-"].map((key) => (
              <button
                key={key}
                onClick={
                  key === "." ? () => handleNumberClick(".") :
                  key === "+/-" ? toggleSign :
                  () => handleNumberClick(key.toString())
                }
              >
                {key}
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
  <button
    className={activeMode === "income" ? "active-button" : ""}
    onClick={() => handleModeChange("income")}
    disabled={activeMode === "expense"}
  >
    Einnahmen
  </button>
  <button
    className={activeMode === "expense" ? "active-button" : ""}
    onClick={() => handleModeChange("expense")}
    disabled={activeMode === "income"}
  >
    Ausgaben
  </button>
  <button disabled>X</button>
  <button disabled={!!activeMode}>Heute</button>
  <button disabled={!!activeMode}>Alle</button>
  <button disabled={!!activeMode}>Drucken</button>
  <button disabled={!!activeMode}>Storno</button>
  <button onClick={handleSubmit} disabled={!!activeMode && !amount}>
    Übernehmen
  </button>
  <button onClick={handleReset} disabled={!!activeMode}>
    Exit
  </button>
</div>


    </div>
  );
};

export default IncomeExpenseForm;
