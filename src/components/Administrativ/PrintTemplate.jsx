import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Logo Import
import Logo from './black.png'; // Hier den Pfad zu deinem Logo angeben

// Stil für das PDF-Dokument
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Corbel", // Schriftart auf Corbel geändert
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    color: "#2C3E50",
    marginTop: 140, // Abstand vom Logo
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    left: 30,
    width: 120, // Breite des Logos anpassen
    height: 120, // Höhe des Logos anpassen
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    marginBottom: 40,
    overflow: "hidden",
    backgroundColor: "#ffffff", // Weißer Hintergrund
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb", // Helles Grau für Zeilen
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    padding: 12,
    fontSize: 12,
    flex: 1,
    textAlign: "center",
    color: "#34495E",
    lineHeight: 1.5, // Für besseren Textabstand
  },
  tableHeader: {
    backgroundColor: "#34495E", // Header-Zellen Farbe
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#FFFFFF", // Weißer Text
    padding: 14,
    fontSize: 14,
    textAlign: "center", // Header zentrieren
  },
  tableCellText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  signatureSection: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  signatureLine: {
    borderTop: "1px solid #34495E",
    width: "60%",
    marginTop: 20,
    marginBottom: 10,
  },
  signatureText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 5,
    color: "#34495E",
  },
  signatureLabel: {
    textAlign: "center",
    fontSize: 12,
    color: "#BDC3C7",
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
            <Text style={styles.tableCell}>in LW. (CHF)</Text>
            <Text style={styles.tableCell}>Kurs</Text>
            <Text style={styles.tableCell}>in FW. (Euro)</Text>
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
          <Text style={styles.signatureText}>__________________________</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PrintTemplate;
