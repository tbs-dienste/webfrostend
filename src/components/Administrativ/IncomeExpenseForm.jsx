import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IncomeExpenseForm.scss";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrintTemplate from "./PrintTemplate"; // Dein PDF-Template

const IncomeExpenseForm = ({ onKassenModusChange }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CHF");
  const [reason, setReason] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);  // Keypad initially hidden
  const [activeMode, setActiveMode] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [entries, setEntries] = useState({ einnahmen: [], ausgaben: [] });
  const [exchangeRate, setExchangeRate] = useState(1.1); // Beispiel Euro -> CHF

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/einnahmenAusgaben', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setEntries({
          einnahmen: response.data.einnahmen || [],
          ausgaben: response.data.ausgaben || [],
        });
      })
      .catch(error => {
        console.error("Error fetching entries:", error);
      });

    onKassenModusChange(true);
    return () => {
      onKassenModusChange(false);
    };
  }, [onKassenModusChange]);

  const handleNumberClick = (value) => {
    setAmount((prev) => prev + value);
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setShowKeypad(true); // Show the keypad once a mode is selected
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

  const handlePrint = () => {
    if (selectedRow !== null && entries.einnahmen[selectedRow]) {
      const entry = entries.einnahmen[selectedRow];
      return (
        <PDFDownloadLink
          document={<PrintTemplate entry={entry} />}
          fileName="entry.pdf"
        >
          {({ loading }) => (loading ? "Generiere PDF..." : "Drucken")}
        </PDFDownloadLink>
      );
    } else {
      return <span>Drucken</span>;
    }
  };

  const handleReset = () => {
    setAmount("");
    setReason("");
    setActiveMode(null);
    setShowKeypad(false); // Hide the keypad when reset
  };

  const handleSubmit = async () => {
    if (!reason) {
      alert("Bitte einen Grund auswählen!");
      return;
    }

    let finalAmount = parseFloat(amount).toFixed(2);
    let finalAmountFW = finalAmount;

    if (currency === "Euro") {
      finalAmount = (parseFloat(amount) * exchangeRate).toFixed(2);
      finalAmountFW = amount;
    }

    const newEntry = {
      reason,
      currency,
      amount: finalAmount,
      amountInFW: finalAmountFW,
      exchangeRate: exchangeRate,
      date: new Date().toLocaleDateString(),
      type: activeMode === "income" ? "Einnahme" : "Ausgabe",
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/einnahmenAusgaben',
        newEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEntries((prevEntries) => ({
        einnahmen: [...prevEntries.einnahmen, response.data],
        ausgaben: prevEntries.ausgaben,
      }));

      handleReset();
    } catch (error) {
      console.error("Fehler beim Übermitteln des Eintrags:", error);
      alert("Fehler beim Übermitteln des Eintrags!");
    }
  };

  const handleRowSelect = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleCancel = async () => {
    if (selectedRow !== null) {
      const selectedEntry =
        entries.einnahmen[selectedRow] || entries.ausgaben[selectedRow];

      if (selectedEntry) {
        if (window.confirm("Bist du sicher, dass du diesen Service löschen möchtest?")) {
          try {
            const token = localStorage.getItem('token');

            await axios.delete(
              `https://tbsdigitalsolutionsbackend.onrender.com/api/einnahmenAusgaben/${selectedEntry._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setEntries((prevEntries) => {
              const updatedEinnahmen = prevEntries.einnahmen.filter(
                (entry, index) => index !== selectedRow
              );
              const updatedAusgaben = prevEntries.ausgaben.filter(
                (entry, index) => index !== selectedRow
              );

              return {
                einnahmen: updatedEinnahmen,
                ausgaben: updatedAusgaben,
              };
            });

            setSelectedRow(null);
          } catch (error) {
            console.error("Fehler beim Löschen des Service:", error);
          }
        }
      }
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
        <div className="form-group custom-dropdown dropdown-reason">
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
                <option value="verpflegung">Verpflegung</option> {/* Neuer Grund */}
                <option value="gewinnbeteiligung">Gewinnbeteiligung</option> {/* Neuer Grund */}
              </>
            )}
            {activeMode === "expense" && (
              <>
                <option value="bueromaterial">Büromaterial 8.1%</option>
                <option value="mwstruckestattung">MWST-Rückerst. 0%</option>
                <option value="porto">Porto 8.1%</option>
                <option value="transportkosten">Transportkosten</option> {/* Neuer Grund */}
                <option value="verpflegungskosten">Verpflegungskosten</option> {/* Neuer Grund */}
                <option value="kommunikationskosten">Kommunikationskosten</option> {/* Neuer Grund */}
                <option value="arbeitsmaterial">Arbeitsmaterial</option> {/* Neuer Grund */}
              </>
            )}

          </select>
        </div>

        <div className="form-group custom-dropdown dropdown-currency">
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
            <th>in LW.</th>
            <th>Kurs</th>
            <th>Fremdwährung</th>
            <th>Datum</th>
            <th>Typ</th>
          </tr>
        </thead>
        <tbody>
          {/* Einnahmen anzeigen */}
          {entries.einnahmen.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">Keine Einnahmen vorhanden</td>
            </tr>
          ) : (
            entries.einnahmen.map((entry, index) => (
              <tr
                key={index}
                onClick={() => handleRowSelect(index)}
                className={selectedRow === index ? "selected" : ""}
              >
                <td>{entry.reason}</td>
                <td>{entry.currency}</td>
                <td>{entry.amount}</td>
                <td>{entry.exchange_rate}</td>
                <td>{entry.amount_in_fw}</td>
                <td>{entry.date}</td>
                <td>{entry.type}</td>
              </tr>
            ))
          )}

          {/* Ausgaben anzeigen */}
          {entries.ausgaben.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">Keine Ausgaben vorhanden</td>
            </tr>
          ) : (
            entries.ausgaben.map((entry, index) => (
              <tr
                key={index}
                onClick={() => handleRowSelect(index)}
                className={selectedRow === index ? "selected" : ""}
              >
                <td>{entry.reason}</td>
                <td>{entry.currency}</td>
                <td>{entry.amount}</td>
                <td>{entry.exchange_rate}</td>
                <td>{entry.amount_in_fw}</td>
                <td>{entry.date}</td>
                <td>{entry.type}</td>
              </tr>
            ))
          )}
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
        <button
          onClick={handlePrint}
          disabled={selectedRow === null} // Disable the button if no row is selected
        >
          {handlePrint()}
        </button>
        <button onClick={handleCancel} disabled={selectedRow === null}>
          Löschen
        </button>
        <button onClick={handleSubmit}>Übernehmen</button>
        <button>
          Exit
        </button>
      </div>
    </div>
  );
};

export default IncomeExpenseForm;
