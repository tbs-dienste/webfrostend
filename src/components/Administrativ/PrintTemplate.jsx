import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Logo Import
import Logo from './black.png'; // Hier den Pfad zu deinem Logo angeben

// Stil für das PDF-Dokument
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica", // Standard Schriftart verwenden
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    color: "#333",
    marginTop: 120, // Abstand vom Logo
  },
  logoContainer: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 100, // Breite des Logos anpassen
    height: 100, // Höhe des Logos anpassen
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 30,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    fontSize: 12,
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  tableHeader: {
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#555",
  },
  tableCellText: {
    fontSize: 10,
    color: "#666",
  },
  signatureSection: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  signatureLine: {
    borderTop: "1px solid #000",
    width: "60%",
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 5,
    color: "#333",
  },
  signatureLabel: {
    textAlign: "center",
    fontSize: 10,
    color: "#555",
  },
});

const PrintTemplate = ({ entry }) => {
  if (!entry) return <Text>Fehler: Keine Daten verfügbar</Text>;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Logo oben links */}
        <View style={styles.logoContainer}>
          <Image src={Logo} style={{ width: "100%", height: "100%" }} />
        </View>

        <Text style={styles.header}>{entry.type}</Text>

        {/* Tabelle */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Grund</Text>
            <Text style={styles.tableCell}>Währung</Text>
            <Text style={styles.tableCell}>In Landwährung (CHF)</Text>
            <Text style={styles.tableCell}>Kurs</Text>
            <Text style={styles.tableCell}>In Fremdwährung (Euro)</Text>
            <Text style={styles.tableCell}>Datum</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{entry.reason || "-"}</Text>
            <Text style={styles.tableCell}>{entry.currency || "-"}</Text>
            <Text style={styles.tableCell}>{entry.amount || "-"}</Text>
            <Text style={styles.tableCell}>{typeof entry.exchange_rate === 'number' ? entry.exchange_rate.toFixed(2) : "-"}</Text>
            <Text style={styles.tableCell}>{entry.amount_in_fw || "-"}</Text>
            <Text style={styles.tableCell}>{entry.date || "-"}</Text>
          </View>
        </View>

        {/* Unterschriftsbereich */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureLine}></View>
          <Text style={styles.signatureLabel}>Unterschrift</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PrintTemplate;
