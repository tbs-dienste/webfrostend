import React, { useState, useEffect } from "react";
import "./IncomeExpenseForm.scss";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrintTemplate from "./PrintTemplate"; // Dein PDF-Template

const IncomeExpenseForm = ({ onKassenModusChange }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CHF");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showKeypad, setShowKeypad] = useState(true);
  const [activeMode, setActiveMode] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1.1); // Kurs Euro -> CHF, hier ein Beispiel

  useEffect(() => {
    // Kassenmodus aktivieren, wenn die Seite geladen wird
    onKassenModusChange(true);
    // Cleanup: Kassenmodus deaktivieren, wenn die Komponente verlassen wird
    return () => {
      onKassenModusChange(false);
    };
  }, [onKassenModusChange]);

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
    setShowKeypad(false);
  };

  const handleReset = () => {
    setAmount("");
    setReason("");
    setOtherReason("");
    setActiveMode(null);
    setShowKeypad(true);
  };

  const handleSubmit = () => {
    if (!reason || (reason === "sonstiges" && !otherReason)) {
      alert("Bitte einen Grund auswählen oder eingeben!");
      return;
    }

    const finalReason = reason === "sonstiges" ? otherReason : reason;

    let finalAmount = parseFloat(amount).toFixed(2);
    let finalAmountFW = finalAmount; // Fremdwährungsbetrag initialisieren

    if (currency === "Euro") {
      // Umrechnung von Euro zu CHF
      finalAmount = (parseFloat(amount) * exchangeRate).toFixed(2);
      finalAmountFW = amount; // Betrag bleibt in Euro
    }

    const newEntry = {
      reason: finalReason,
      currency,
      amount: finalAmount,
      amountInFW: finalAmountFW, // Fremdwährungsbetrag
      exchangeRate: exchangeRate,
      date: new Date().toLocaleDateString(),
    };

    setEntries((prevEntries) => [...prevEntries, newEntry]);
    handleReset();
  };

  const handleRowSelect = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handlePrint = () => {
    if (selectedRow !== null) {
      const entry = entries[selectedRow];
      return (
        <PDFDownloadLink
          document={<PrintTemplate entry={entry} />}
          fileName="entry.pdf"
        >
          {({ loading }) =>
            loading ? "Generiere PDF..." : "Drucken"
          }
        </PDFDownloadLink>
      );
    }
  };

  const handleCancel = () => {
    if (selectedRow !== null) {
      setEntries((prevEntries) => prevEntries.filter((_, i) => i !== selectedRow));
      setSelectedRow(null);
    }
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
            <th>in Landwährung (CHF)</th>
            <th>Kurs</th>
            <th>in Fremdwährung (Euro)</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={index}
              onClick={() => handleRowSelect(index)}
              className={selectedRow === index ? "selected" : ""}
            >
              <td>{entry.reason}</td>
              <td>{entry.currency}</td>
              <td>{entry.amount}</td>
              <td>{entry.exchangeRate.toFixed(2)}</td>
              <td>{entry.amountInFW}</td>
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
        <button disabled>
          X
        </button>
        <button onClick={() => handleModeChange("income")} disabled={activeMode === "income"}>
          Einnahmen
        </button>
        <button onClick={() => handleModeChange("expense")} disabled={activeMode === "expense"}>
          Ausgaben
        </button>
        <button disabled>
          X
        </button>
        <button>
          Heute
        </button>
        <button>
          Alle
        </button>
        <button onClick={handlePrint} disabled={selectedRow === null}>
          {handlePrint()}
        </button>
        <button onClick={handleCancel} disabled={selectedRow === null}>
          Storno
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
