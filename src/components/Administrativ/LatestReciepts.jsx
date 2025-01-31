import React, { useState, useEffect, useRef } from "react";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
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
  scrollButtonsContainer: {
    width: "100px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "200px", // Set height to 100% of the screen's visible height
  },
  scrollButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  printButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
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
  const token = localStorage.getItem("token");
  const API_BASE_URL = "https://tbsdigitalsolutionsbackend.onrender.com/api/kasse";

  useEffect(() => {
    const fetchLastReceipt = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/last-receipt`, {
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
  }, [token, API_BASE_URL]);

  const printPDF = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write('<html><body><div id="print-pdf"></div></body></html>');
    printWindow.document.close();

    const pdfContainer = printWindow.document.getElementById("print-pdf");
    pdfContainer.appendChild(document.getElementById("pdf-container").contentWindow.document.body);

    printWindow.print();
  };

  const handleScrollUp = () => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.scrollBy(0, -100); // Scroll 100px nach oben
    }
  };

  const handleScrollDown = () => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.scrollBy(0, 100); // Scroll 100px nach unten
    }
  };

  if (!lastReceipt) {
    return <Text>Lade letzte Quittung...</Text>;
  }

  return (
    <div className="receipt-viewer-container" style={{ position: "relative" }}>
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

      <div className="scroll-buttons" style={styles.scrollButtonsContainer}>
        <button style={styles.scrollButton} onClick={handleScrollUp}>↑</button>
        <button style={styles.scrollButton} onClick={handleScrollDown}>↓</button>
      </div>

      <div className="print-button-container">
        <button style={styles.printButton} onClick={printPDF}>Drucken</button>
      </div>
    </div>
  );
};

export default LastReceiptViewer;
