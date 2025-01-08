import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Stil für das PDF-Dokument
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica", // Standard Schriftart verwenden
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    fontSize: 10,
    flex: 1,
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
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
  },
  signatureLabel: {
    textAlign: "center",
    fontSize: 10,
    color: "#555",
  },
});

const PrintTemplate = ({ entry }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Einnahmen / Ausgaben</Text>

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
            <Text style={styles.tableCell}>{entry.exchangeRate ? entry.exchangeRate.toFixed(2) : "-"}</Text>
            <Text style={styles.tableCell}>{entry.amountInFW || "-"}</Text>
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
