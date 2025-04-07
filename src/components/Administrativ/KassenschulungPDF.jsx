import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import Logo from './black.png';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.6,
    color: "#2C3E50",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#7F8C8D",
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
        <Text>• Umfassende Einführung in alle Funktionen des Kassensystems</Text>
        <Text>• Praxistest vor Ort, bei dem das Kassieren simuliert und geübt wird</Text>
        <Text>• Hohe Anforderungen und Erwartungen, um sicherzustellen, dass ihr das System sicher und effizient bedienen könnt</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Praxis-Übung:</Text>
        <Text>
          Während der Schulung werdet ihr gegenseitig kassieren, um den realen Ablauf zu üben. Dabei bezahlt ihr auch direkt eure Schulungsgebühr von 25 CHF an einen anderen Mitarbeiter über das Kassensystem von TBS Solutions.
        </Text>
        <Text style={{ marginTop: 5 }}>
          Wer mit Karte bezahlt, muss zusätzlich eine Kartengebühr von 5% auf den Betrag bezahlen. Diese Gebühr wird automatisch vom Kassensystem berechnet und direkt beim Bezahlvorgang angezeigt.
        </Text>
        <Text style={{ marginTop: 5 }}>
          Ziel dieser Übung ist es, dass ihr den gesamten Kassiervorgang selbstständig durchführt – vom Scannen der Produkte bis zum Abschluss der Zahlung.
        </Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.bold}>Ort:</Text> Wird noch bekannt gegeben</Text>
        <Text><Text style={styles.bold}>Datum und Uhrzeit:</Text> Wird noch bekannt gegeben</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.bold}>Kostenbeitrag:</Text> 25 CHF pro Person</Text>
        <Text style={{ marginTop: 5 }}>
          Die ursprünglichen Kosten der Schulung würden pro Person 859.50 CHF betragen! TBS Solutions übernimmt den Großteil der Kosten, um euch diese wertvolle Schulung zu ermöglichen.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Bezahlung:</Text>
        <Text>Beiliegend erhaltet ihr die Rechnung für die Schulung. Bitte überweist den Betrag von 25 CHF innerhalb der nächsten 30 Tage.</Text>
        <Text style={{ marginTop: 5 }}>
          Der Schulungstermin wird erst bekannt gegeben, wenn alle Teilnehmer ihren Kostenbeitrag bezahlt haben.
        </Text>
        <Text style={{ marginTop: 5 }}>
          Wenn der Betrag nicht innerhalb von 30 Tagen bezahlt wurde, werden Mahnkosten in Höhe von 30 CHF fällig!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Wichtige Hinweise:</Text>
        <Text>• Bei Verspätung: Bitte ruft umgehend unter 079 809 00 55 an.</Text>
        <Text>• Bei Verspätung kann der Kursleiter eine zusätzliche Gebühr verrechnen.</Text>
        <Text>• Bei Nichterscheinen ohne gültiges Arztzeugnis wird der Kurs voll verrechnet.</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Da die Schulung vor Ort stattfindet, bitten wir euch, pünktlich am Veranstaltungsort zu erscheinen. Die Teilnahme ist verpflichtend, da das Wissen für eure zukünftige Arbeit essenziell ist.
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          Nach erfolgreicher Teilnahme und Bestehen der Schulung wird für jeden Mitarbeiter ein persönlicher PIN erstellt, mit dem ihr Zugriff auf das Kassensystem erhaltet. Dieser PIN ist individuell und darf nicht weitergegeben werden!
        </Text>
      </View>

      <View style={styles.section}>
        <Text>Wir sind überzeugt, dass ihr durch diese Schulung optimal vorbereitet werdet und freuen uns auf eure Teilnahme!</Text>
      </View>

      <Text style={styles.footer}>TBS Solutions – Gemeinsam erfolgreich</Text>

    </Page>
  </Document>
);

export default KassenschulungPDF;