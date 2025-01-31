import React, { useState, useEffect, useRef } from "react";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, pdf } from "@react-pdf/renderer";
import axios from "axios";
import Logo from "./black.png"; // Pfad zum Logo

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
    marginBottom: 50,
  },
  logo: {
    width: 80,
    height: 80,
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

const ReceiptPDF = ({ receipt }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={Logo} style={styles.logo} />
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>Quittung</Text>
        <Text style={{ fontSize: 13 }}>{new Date(receipt.created_at).toLocaleString("de-DE")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaktionsdetails</Text>
        <View style={styles.detailRow}>
          <Text>Transaktions-ID:</Text>
          <Text>{receipt.transaction_id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text>Mitarbeiter-ID:</Text>
          <Text>{receipt.mitarbeiterId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text>Zahlungsmethode:</Text>
          <Text>{receipt.payment_method}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produkte</Text>
        {receipt.products.map((product, index) => (
          <View style={styles.productRow} key={index}>
            <Text>{product.article_short_text}</Text>
            <Text>{product.quantity} x {product.price} CHF</Text>
            <Text>{(product.quantity * product.price).toFixed(2)} CHF</Text>
          </View>
        ))}
      </View>

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

      <Text style={styles.footer}>Vielen Dank für Ihren Einkauf!</Text>
    </Page>
  </Document>
);

const LastReceiptViewer = () => {
  const [lastReceipt, setLastReceipt] = useState(null);
  const pdfContainerRef = useRef(null);
  const API_BASE_URL = "https://tbsdigitalsolutionsbackend.onrender.com/api/payment";

  useEffect(() => {
    const fetchLastReceipt = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Kein Token vorhanden!");
          return;
        }
  
        const response = await axios.get(`${API_BASE_URL}/latest-receipt`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setLastReceipt(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der letzten Quittung:", error);
      }
    };
  
    fetchLastReceipt();
  }, []);
  

  const printPDF = async () => {
    if (!lastReceipt) return;
    const blob = await pdf(<ReceiptPDF receipt={lastReceipt} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Quittung.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!lastReceipt) {
    return <p>Lade letzte Quittung...</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        id="pdf-container"
        ref={pdfContainerRef}
        style={{
          width: "100%",
          height: "600px",
          overflowY: "auto",
        }}
      >
        <PDFViewer width="100%" height="100%">
          <ReceiptPDF receipt={lastReceipt} />
        </PDFViewer>
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={printPDF}
      >
        Drucken
      </button>
    </div>
  );
};

export default LastReceiptViewer;
