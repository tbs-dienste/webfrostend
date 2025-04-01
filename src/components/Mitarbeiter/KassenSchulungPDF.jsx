import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import Logo from './black.png'; // Dein Logo hier einfügen

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Times-Roman",
    fontSize: 10, // Kleinere Schriftgröße für mehr Platz
    lineHeight: 1.4,
    color: "#2C3E50",
    backgroundColor: "#F9F9F9",
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    alignSelf: 'center',
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#34495E",
  },
  section: {
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 8,
    color: "#BDC3C7",
    borderTop: "1px solid #BDC3C7",
    paddingTop: 5,
  },
  highlight: {
    color: "#E74C3C",
  },
});

const KassenschulungPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ alignItems: 'center' }}>
        <Image src={Logo} style={styles.logo} />
      </View>

      <Text style={styles.header}>Einladung zur Kassenschulung</Text>

      <View style={styles.section}>
        <Text>Liebe Mitarbeiterinnen und Mitarbeiter,</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Wir freuen uns, euch zu einer Kassenschulung für unser System von TBS Solutions einzuladen! Die Schulung wird von einer externen Firma durchgeführt, die euch umfassend in die Nutzung unseres Kassensystems einführt und alle Funktionen im Detail erklärt.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Was erwartet euch?</Text>
        <Text>• Einführung in alle Funktionen des Kassensystems</Text>
        <Text>• Praxistest vor Ort</Text>
        <Text>• Hohe Anforderungen für effiziente Bedienung</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.bold}>Ort:</Text> Wird noch bekannt gegeben</Text>
        <Text><Text style={styles.bold}>Datum und Uhrzeit:</Text> Wird noch bekannt gegeben</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.bold}>Kostenbeitrag:</Text> 25 CHF pro Person</Text>
        <Text style={{ marginTop: 5 }}>
          Der ursprüngliche Preis von 859.50 CHF wird von TBS Solutions übernommen.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Bezahlung:</Text>
        <Text>Bitte überweist 25 CHF innerhalb der nächsten 30 Tage.</Text>
        <Text style={{ marginTop: 5 }}>
          Mahngebühr von <Text style={styles.highlight}>30 CHF</Text> bei verspäteter Zahlung.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Wichtige Hinweise:</Text>
        <Text>• Bei Verspätung: Ruft unter 079 809 00 55 an.</Text>
        <Text>• Zusätzliche Gebühr bei Verspätung.</Text>
        <Text>• Bei Nichterscheinen ohne Arztzeugnis wird der Kurs voll verrechnet.</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Nach der Schulung wird für jeden Mitarbeiter ein persönlicher PIN erstellt, der nicht weitergegeben werden darf.
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          Die Rechnung für die Schulung ist beiliegend. Wir bitten euch, den Betrag innerhalb der angegebenen Frist zu überweisen.
        </Text>
      </View>

      <View style={styles.section}>
        <Text>Wir freuen uns auf eure Teilnahme und wünschen euch viel Erfolg!</Text>
      </View>

      <View style={styles.section}>
        <Text>Mit freundlichen Grüßen</Text>
        <Text style={{ marginTop: 10 }}>Timo Blumer</Text>
        <Text>Inhaber von TBS Solutions</Text>
      </View>

      <Text style={styles.footer}>TBS Solutions | www.tbs-solutions.ch</Text>
    </Page>
  </Document>
);

export default KassenschulungPDF;
