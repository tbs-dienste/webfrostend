import React, { useState } from "react";
import "./IncomeExpenseForm.scss";

const IncomeExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CHF");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showKeypad, setShowKeypad] = useState(true);
  const [activeMode, setActiveMode] = useState(null); // Zustand für den aktiven Button
  const [entries, setEntries] = useState([]); // Zustand für die Tabelle

  const handleNumberClick = (value) => {
    setAmount((prev) => prev + value);
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleModeChange = (mode) => {
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
    setActiveMode(null);
    setShowKeypad(true); // Nummernfeld anzeigen
  };

  const handleSubmit = () => {
    if (!reason || (reason === "sonstiges" && !otherReason)) {
      alert("Bitte einen Grund auswählen oder eingeben!");
      return;
    }

    const finalReason = reason === "sonstiges" ? otherReason : reason;
    const newEntry = {
      reason: finalReason,
      currency,
      amount: parseFloat(amount).toFixed(2), // Betrag in FW
      exchangeRate: 1, // Beispiel: Kurs 1 für CHF (später anpassbar)
      date: new Date().toLocaleDateString(),
    };

    setEntries((prevEntries) => [...prevEntries, newEntry]); // Neuer Eintrag in die Tabelle
    handleReset(); // Formular zurücksetzen
  };

  return (
    <div className="income-expense-container">
      <div className="top-section horizontal-layout">
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
            {activeMode === "income" && (
              <>
                <option value="eroeffnungsdifferenz">Eröffnungsdifferenz</option>
                <option value="abschlussdifferenz">Abschlussdifferenz</option>
                <option value="stockeinlage">Stockeinlage</option>
                <option value="gebuehrtoilette">Gebühr Toilette</option>
                <option value="umtriebsentschaedigung">Umtriebsentschädigung</option>
              </>
            )}
            {activeMode === "expense" && (
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

      <table className="entry-table">
        <thead>
          <tr>
            <th>Grund</th>
            <th>Währung</th>
            <th>Kurs</th>
            <th>Betrag in FW</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.reason}</td>
              <td>{entry.currency}</td>
              <td>{entry.exchangeRate.toFixed(2)}</td>
              <td>{entry.amount}</td>
              <td>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showKeypad && (
        <div className="keypad-section">
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "+/-"].map((key) => (
              <button
                key={key}
                onClick={
                  key === "."
                    ? () => handleNumberClick(".")
                    : key === "+/-"
                    ? toggleSign
                    : () => handleNumberClick(key.toString())
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
        <button onClick={() => handleModeChange("income")} disabled={activeMode === "income"}>
          Einnahmen
        </button>
        <button onClick={() => handleModeChange("expense")} disabled={activeMode === "expense"}>
          Ausgaben
        </button>
        <button onClick={handleSubmit} disabled={!amount || !reason}>
          Übernehmen
        </button>
        <button onClick={handleReset}>Exit</button>
      </div>
    </div>
  );
};

export default IncomeExpenseForm;
