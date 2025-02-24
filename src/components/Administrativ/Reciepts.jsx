import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { jwtDecode } from "jwt-decode"; // jwt-decode importieren
import Calendar from 'react-calendar'; // Kalender importieren
import 'react-calendar/dist/Calendar.css'; // Kalender CSS importieren

// Logo importieren
import Logo from "./black.png"; // Pfad zu deinem Logo
import "./Reciepts.scss"; // SCSS-Datei importieren

// PDF-Stile definieren
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#333",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 80,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textDecoration: "underline",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  productSection: {
    marginTop: 10,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  totalRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: "center",
    color: "#666",
  },
});

const ReceiptPDF = ({ receipt, employeeName }) => {
  const printDate = new Date().toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const totalAmount = parseFloat(receipt.total_amount) || 0;  // Umwandlung in Zahl, falls der Wert kein gültiger Zahl-String ist


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header mit Logo und Titel */}
        <View style={styles.header}>
          <Image src={Logo} style={styles.logo} />
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Quittung</Text>
          <Text style={{ fontSize: 13 }}>{printDate}</Text>
        </View>
        <View style={styles.detailRow}>
          {/* Datum extrahieren */}
          <Text>{new Date(printDate).toLocaleDateString("de-DE")}</Text>

          {/* Zufällig generierte Bon-Nummer */}
          <Text style={{ fontSize: 13 }}>Bon</Text>
          <Text style={{ fontSize: 13 }}>{Math.floor(Math.random() * 1000000)}</Text>
        </View>

        <View style={styles.detailRow}>
          {/* Uhrzeit extrahieren */}
          <Text>{new Date(printDate).toLocaleTimeString("de-DE")}</Text>
          {/* Zufällig generierte Kassen-ID */}
          <Text style={{ fontSize: 13 }}>Kasse</Text>
          <Text style={{ fontSize: 13 }}>205242</Text>
        </View>

        {/* Produktliste */}
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>Produkte</Text>
          {receipt.products && Array.isArray(receipt.products) && receipt.products.map((product, index) => (
            <View style={styles.productRow} key={index}>
              <Text>{product.article_short_text}</Text>
              <Text>{product.quantity} x {product.price} CHF</Text>
              <Text>{(product.quantity * product.price).toFixed(2)} CHF</Text>
            </View>
          ))}
        </View>

        {/* Trennlinie */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#eee', marginTop: 10 }} />

        {/* Gesamtbetrag und Rückgeld */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text>Total:</Text>
            <Text>{totalAmount.toFixed(2)} CHF</Text>
          </View>

        </View>

        {/* Trennlinie */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#eee', marginTop: 10 }} />

        {receipt.method === "Bar" && (
          <View>
            <View style={styles.totalRow}>
              <Text>Bargeld:</Text>
              <Text>{parseFloat(receipt.payment_amount)?.toFixed(2)} CHF</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Rückgeld:</Text>
              <Text>{((parseFloat(receipt.payment_amount) || 0) - totalAmount).toFixed(2)} CHF</Text>
            </View>
          </View>
        )}


        {/* Kartenzahlung */}
        {receipt.method === "Karte" && receipt.eft_data && (
          <View style={styles.section}>
            <Text> *** EFT-Beleg ***</Text>
            <Text> {receipt.eft_data.cardType || "Unbekannt"}</Text>
            <Text>contactless</Text>
            <Text> {receipt.eft_data.cardType || "Unbekannt"}</Text>
            <Text>Trm-Id: {receipt.eft_data.terminal_id || "N/A"}</Text>
            <Text>Akt-Id: {receipt.eft_data.akt_id || "N/A"}</Text>
            <Text>AID: {receipt.eft_data.aid || "N/A"}</Text>
            <Text>Trx. Seq-Cnt: {receipt.eft_data.trx_ref_no || "N/A"}</Text>

            <Text>Trx. Ref-No: {receipt.eft_data.trx_seq_cnt || "N/A"}</Text>
            <Text>Auth. Code: {receipt.eft_data.auth_code || "N/A"}</Text>
            <Text>Emv_ATC: {receipt.eft_data.emv_atc || "N/A"}</Text>
            <Text>{receipt.eft_data.mixed_code || "N/A"}</Text>
          </View>
        )}

        {/* MwSt. und weitere Details */}
        <View style={styles.section}>
          <Text>* = Nicht rabattberechtigt</Text>
          <Text>MWST inkl.</Text>
          <View style={styles.totalRow}>
            <Text>8.1 % v.</Text>
            <Text>{receipt.total_amount?.toFixed(2)} = CHF</Text>
            <Text>{receipt.mwst?.toFixed(2)} CHF</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Vielen Dank für Ihren Einkauf!
        </Text>
        <Text style={styles.footer}>
          Es bediente Sie: {employeeName}.
        </Text>
      </Page>
    </Document>

  );
};


// Hauptkomponente
const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [printDate, setPrintDate] = useState(null); // printDate initialisiert

  const handleRowClick = (receipt) => {
    setSelectedReceipt(receipt);

    // Setze das Datum und die Uhrzeit nur einmal, wenn eine Quittung ausgewählt wird
    if (!printDate) {
      const currentDate = new Date();
      setPrintDate(currentDate.toLocaleString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setEmployeeName(`${decoded.vorname || "Unbekannt"} ${decoded.nachname || ""}`.trim());
    }
  }, []);

  // Quittungen abrufen, wenn sich das Datum ändert
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
        if (error.response && error.response.status === 404) {
          setReceipts([]);
          setError("Keine Quittungen für dieses Datum gefunden.");
        } else {
          setError("Fehler beim Abrufen der Quittungen.");
        }
      }
    };

    fetchReceipts();
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  if (loading) return <p className="loading-message">Lade Daten...</p>;

  return (
    <div className="receipts-container">
      <h1>Quittungen</h1>
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
                <td>{receipt.payment_method}</td>
                <td>{receipt.payment_amount}</td>
                <td>{receipt.total_amount}</td>
                <td>{new Date(receipt.created_at).toLocaleDateString("de-DE")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Keine Quittungen für dieses Datum gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Kalender */}
      <div className="calendar-container">
        <Calendar onChange={setSelectedDate} value={new Date(selectedDate)} />
      </div>

      {selectedReceipt && (
        <div className="pdf-viewer">
          <PDFViewer width="100%" height={600}>
            <ReceiptPDF receipt={selectedReceipt} employeeName={employeeName} printDate={printDate} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};


export default Receipts;
