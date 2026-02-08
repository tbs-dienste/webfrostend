import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 15
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1 solid #ddd",
    paddingVertical: 6
  },
  bold: {
    fontWeight: "bold"
  },
  footer: {
    position: "absolute",
    bottom: 30,
    textAlign: "center",
    fontSize: 9,
    color: "grey",
    width: "100%"
  }
});

export const KundenReportPDF = ({
  kunde,
  gesamtArbeitszeit,
  mitarbeiterArbeitszeiten,
  dienstleistungMitarbeiter
}) => (
  <Document>

    {/* ===================== */}
    {/* 1️⃣ SEITE – GESAMT */}
    {/* ===================== */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Arbeitszeitübersicht</Text>

      <Text style={styles.sectionTitle}>Gesamtarbeitszeit pro Dienstleistung</Text>

      {gesamtArbeitszeit.map(d => (
        <View key={d.dienstleistung_id} style={styles.row}>
          <Text>{d.dienstleistung}</Text>
          <Text style={styles.bold}>{d.gesamtArbeitszeit} h</Text>
        </View>
      ))}

      <Text style={styles.footer}>
        Kunde: {kunde.vorname} {kunde.nachname}
      </Text>
    </Page>

    {/* ===================== */}
    {/* 2️⃣ SEITEN – PRO MITARBEITER */}
    {/* ===================== */}
    {mitarbeiterArbeitszeiten.map(m => (
      <Page key={m.mitarbeiter_id} size="A4" style={styles.page}>
        <Text style={styles.title}>
          Arbeitszeiten – {m.vorname} {m.nachname}
        </Text>

        {m.arbeitszeiten.map((a, i) => (
          <View key={i} style={styles.row}>
            <Text>{a.dienstleistung}</Text>
            <Text>{a.start_time} – {a.end_time}</Text>
            <Text style={styles.bold}>{a.arbeitszeit} h</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Mitarbeiter-ID: {m.mitarbeiter_id}
        </Text>
      </Page>
    ))}

    {/* ===================== */}
    {/* 3️⃣ SEITE – ZUSAMMENFASSUNG */}
    {/* ===================== */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Arbeitszeit je Dienstleistung</Text>

      {dienstleistungMitarbeiter.map(dl => (
        <View key={dl.dienstleistung} style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>{dl.dienstleistung}</Text>

          {dl.mitarbeiter.map(m => (
            <View key={m.mitarbeiter_id} style={styles.row}>
              <Text>{m.vorname} {m.nachname}</Text>
              <Text style={styles.bold}>{m.gesamtArbeitszeit} h</Text>
            </View>
          ))}
        </View>
      ))}
    </Page>

  </Document>
);
