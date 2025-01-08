import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Stil für das PDF-Dokument
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    marginBottom: 5,
  },
});

const PrintTemplate = ({ entry }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Einnahmen / Ausgaben</Text>
        <Text>Grund: {entry.reason}</Text>
        <Text>Währung: {entry.currency}</Text>
        <Text>In Landwährung (CHF): {entry.amount}</Text>
        <Text>Kurs: {entry.exchangeRate}</Text>
        <Text>In Fremdwährung (Euro): {entry.amountInFW}</Text>
        <Text>Datum: {entry.date}</Text>
      </View>
    </Page>
  </Document>
);

export default PrintTemplate;
