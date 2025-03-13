import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
import ReceiptPDF from "./ReceiptPDF";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Receipts.scss';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/payment/receipts?date=${selectedDate}`,
          { headers }
        );

        setReceipts(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Fehler beim Abrufen der Quittungen:", error); // Fehlerausgabe für Debugging
        if (error.response?.status === 404) {
          setReceipts([]);
          setError("Keine Quittungen für dieses Datum gefunden.");
        } else {
          setError("Fehler beim Abrufen der Quittungen.");
        }
      }
    };

    fetchReceipts();
  }, [selectedDate]);

  const handleRowClick = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  return (
    <div className="receipts-container">
      <h1>Quittungen Übersicht</h1>

      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={new Date(selectedDate)}
          minDate={new Date(new Date().setDate(new Date().getDate() - 30))}
          maxDate={new Date()}
          className="calendar"
        />
      </div>

      {loading && <p className="loading-message">Lade Daten...</p>}

      {!loading && (
        <>
          <div className="table-container">
            <table className="receipts-table">
              <thead>
                <tr>
                  <th>Transaktions-ID</th>
                  <th>Mitarbeiter-ID</th>
                  <th>Zahlungsmethode</th>
                  <th>Gezahlt (CHF)</th>
                  <th>Gesamtbetrag (CHF)</th>
                  <th>Datum</th>
                </tr>
              </thead>
              <tbody>
                {receipts.length > 0 ? (
                  receipts.map((receipt) => (
                    <tr key={receipt.transaction_id} onClick={() => handleRowClick(receipt)}>
                      <td>{receipt.transaction_id}</td>
                      <td>{receipt.mitarbeiterId}</td>
                      <td>{receipt.method}</td>
                      <td>{parseFloat(receipt.paid_amount).toFixed(2)} CHF</td>
                      <td>{parseFloat(receipt.total_amount).toFixed(2)} CHF</td>
                      <td>{new Date(receipt.created_at).toLocaleDateString("de-DE")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      {error || "Keine Quittungen für dieses Datum gefunden."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedReceipt && (
            <div className="pdf-viewer-container">
              <PDFViewer width="100%" height="100%">
                <ReceiptPDF receipt={selectedReceipt} />
              </PDFViewer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Receipts;
