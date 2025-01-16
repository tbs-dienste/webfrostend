import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { jwtDecode } from "jwt-decode"; // jwt-decode importieren

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
    marginBottom: 20,
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

// Funktion für das aktuelle Datum und Uhrzeit
const getFormattedDateTime = () => {
  const now = new Date();
  return now.toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// PDF-Komponente
const ReceiptPDF = ({ receipt, employeeName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header mit Logo und Titel */}
      <View style={styles.header}>
        <Image src={Logo} style={styles.logo} />
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>Quittung</Text>
        <Text style={{ fontSize: 13 }}> {getFormattedDateTime()}</Text>
      </View>

      {/* Transaktionsinformationen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaktionsdetails</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaktions-ID:</Text>
          <Text>{receipt.transaction_id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mitarbeiter-ID:</Text>
          <Text>{receipt.mitarbeiterId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Zahlungsmethode:</Text>
          <Text>{receipt.payment_method}</Text>
        </View>
      </View>

      {/* Produktliste */}
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Produkte</Text>
        {receipt.products.map((product, index) => (
          <View style={styles.productRow} key={index}>
            <Text>{product.article_short_text}</Text>
            <Text>{product.quantity} x {product.price} CHF</Text>
            <Text>{(product.quantity * product.price).toFixed(2)} CHF</Text>
          </View>
        ))}
      </View>

      {/* Gesamtbetrag und Rückgeld */}
      <View style={styles.section}>
        <View style={styles.totalRow}>
          <Text>Gesamtbetrag:</Text>
          <Text>{receipt.total_amount} CHF</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Gezahlt:</Text>
          <Text>{receipt.payment_amount} CHF</Text>
        </View>
        {receipt.payment_method === "Bar" && (
          <View style={styles.totalRow}>
            <Text>Rückgeld:</Text>
            <Text>{(receipt.payment_amount - receipt.total_amount).toFixed(2)} CHF</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Es bediente Sie: {employeeName}.
      </Text>
    </Page>
  </Document>
);

// Hauptkomponente
const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setEmployeeName(`${decoded.vorname || "Unbekannt"} ${decoded.nachname || ""}`.trim());
    }
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/payment/receipts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReceipts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fehler beim Abrufen der Quittungen:", err);
        setError("Fehler beim Laden der Daten.");
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const handleRowClick = (receipt) => {
    setSelectedReceipt(receipt);
  };

  if (loading) return <p className="loading-message">Lade Daten...</p>;
  if (error) return <p className="error-message">{error}</p>;

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
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr
              key={receipt.transaction_id}
              onClick={() => handleRowClick(receipt)}
              className={
                selectedReceipt?.transaction_id === receipt.transaction_id
                  ? "selected"
                  : ""
              }
            >
              <td>{receipt.transaction_id}</td>
              <td>{receipt.mitarbeiterId}</td>
              <td>{receipt.payment_method}</td>
              <td>{receipt.payment_amount}</td>
              <td>{receipt.total_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedReceipt ? (
        <PDFViewer className="pdf-viewer">
          <ReceiptPDF receipt={selectedReceipt} employeeName={employeeName} />
        </PDFViewer>
      ) : (
        <p className="no-selection-message">Bitte wählen Sie eine Quittung aus.</p>
      )}
    </div>
  );
};

export default Receipts;
