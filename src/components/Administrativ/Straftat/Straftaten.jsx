import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Roboto Schriftart von Google Fonts
Font.register({
  family: "Roboto",
  src:
    "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff2",
});

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 12,
    padding: 40,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#2f6fdb",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#555",
  },
  value: {
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    fontSize: 10,
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#999",
  },
});

// PDF-Komponente für Strafantrag
function StrafantragPDF({ data }) {
  return (
    <Document>
      <Page style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Strafantrag wegen Diebstahl</Text>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>Antragsteller:</Text>
          <Text style={pdfStyles.value}>
            {data.vorname} {data.nachname}
          </Text>

          <Text style={pdfStyles.label}>Adresse:</Text>
          <Text style={pdfStyles.value}>{data.adresse}</Text>

          <Text style={pdfStyles.label}>Telefon:</Text>
          <Text style={pdfStyles.value}>{data.telefon}</Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>Täterinformationen:</Text>
          <Text style={pdfStyles.value}>
            Name: {data.taeterName}{"\n"}
            Adresse: {data.taeterAdresse}{"\n"}
            Beschreibung: {data.taeterBeschreibung}
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>Tatbeschreibung:</Text>
          <Text style={pdfStyles.value}>{data.tatbeschreibung}</Text>
        </View>

        <Text style={pdfStyles.footer}>
          Strafantrag erstellt am {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}

// PDF-Komponente für Hausverbot
function HausverbotPDF({ data }) {
  return (
    <Document>
      <Page style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Hausverbot</Text>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>Hausverbot gegen:</Text>
          <Text style={pdfStyles.value}>
            {data.taeterName}{"\n"}
            {data.taeterAdresse}
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>Erteilt von:</Text>
          <Text style={pdfStyles.value}>
            {data.vorname} {data.nachname}{"\n"}
            {data.adresse}
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.label}>Begründung:</Text>
          <Text style={pdfStyles.value}>{data.hausverbotBegruendung}</Text>
        </View>

        <Text style={pdfStyles.footer}>
          Hausverbot ausgestellt am {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}

// Form Styles (Inline)
const formStyles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 30,
    borderRadius: 14,
    boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
    backgroundColor: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    color: "#2f2f2f",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.8px solid #ccc",
    marginBottom: 22,
    outline: "none",
    transition: "border-color 0.3s",
  },
  textarea: {
    width: "100%",
    minHeight: 100,
    padding: "14px 18px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.8px solid #ccc",
    marginBottom: 22,
    outline: "none",
    resize: "vertical",
    transition: "border-color 0.3s",
  },
  button: {
    backgroundColor: "#2f6fdb",
    color: "#fff",
    padding: "16px 0",
    fontSize: 18,
    fontWeight: "700",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#255bb5",
  },
  header: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f6fdb",
    marginBottom: 30,
  },
  pdfLinksWrapper: {
    marginTop: 30,
    textAlign: "center",
  },
  pdfLink: {
    display: "inline-block",
    margin: "0 12px",
    padding: "14px 28px",
    backgroundColor: "#2f6fdb",
    color: "white",
    borderRadius: 10,
    fontWeight: "700",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  pdfLinkHausverbot: {
    backgroundColor: "#f44336",
  },
};

// Haupt-Komponente
export default function StrafantragForm() {
  const [formData, setFormData] = useState({
    vorname: "",
    nachname: "",
    adresse: "",
    telefon: "",
    taeterName: "",
    taeterAdresse: "",
    taeterBeschreibung: "",
    tatbeschreibung: "",
    hausverbotBegruendung: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Für Button Hover Effekte (optional)
  const [btnHover, setBtnHover] = useState(false);
  const [btnHoverHaus, setBtnHoverHaus] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Einfache Validierung: Pflichtfelder
    const requiredFields = [
      "vorname",
      "nachname",
      "adresse",
      "taeterName",
      "tatbeschreibung",
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        alert(`Bitte das Feld "${field}" ausfüllen.`);
        return;
      }
    }

    setSubmitted(true);
  }

  return (
    <div style={formStyles.container}>
      <h1 style={formStyles.header}>Strafantrag & Hausverbot Generator</h1>

      {!submitted && (
        <form onSubmit={handleSubmit}>
          <label style={formStyles.label}>Dein Vorname *</label>
          <input
            name="vorname"
            value={formData.vorname}
            onChange={handleChange}
            required
            placeholder="Max"
            style={formStyles.input}
          />

          <label style={formStyles.label}>Dein Nachname *</label>
          <input
            name="nachname"
            value={formData.nachname}
            onChange={handleChange}
            required
            placeholder="Mustermann"
            style={formStyles.input}
          />

          <label style={formStyles.label}>Deine Adresse *</label>
          <input
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
            placeholder="Musterstrasse 1, 3000 Bern"
            style={formStyles.input}
          />

          <label style={formStyles.label}>Telefon</label>
          <input
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            placeholder="+41 79 123 45 67"
            style={formStyles.input}
          />

          <hr style={{ margin: "30px 0" }} />

          <label style={formStyles.label}>Name des Täters *</label>
          <input
            name="taeterName"
            value={formData.taeterName}
            onChange={handleChange}
            required
            placeholder="Täter Vorname Nachname"
            style={formStyles.input}
          />

          <label style={formStyles.label}>Adresse des Täters</label>
          <input
            name="taeterAdresse"
            value={formData.taeterAdresse}
            onChange={handleChange}
            placeholder="Täter Adresse"
            style={formStyles.input}
          />

          <label style={formStyles.label}>Beschreibung des Täters</label>
          <textarea
            name="taeterBeschreibung"
            value={formData.taeterBeschreibung}
            onChange={handleChange}
            placeholder="z.B. Aussehen, Kleidung"
            style={formStyles.textarea}
          />

          <hr style={{ margin: "30px 0" }} />

          <label style={formStyles.label}>Tatbeschreibung *</label>
          <textarea
            name="tatbeschreibung"
            value={formData.tatbeschreibung}
            onChange={handleChange}
            required
            placeholder="Was ist passiert? Wo und wann?"
            style={formStyles.textarea}
          />

          <hr style={{ margin: "30px 0" }} />

          <label style={formStyles.label}>Begründung Hausverbot</label>
          <textarea
            name="hausverbotBegruendung"
            value={formData.hausverbotBegruendung}
            onChange={handleChange}
            placeholder="Begründung für das Hausverbot (optional)"
            style={formStyles.textarea}
          />

          <button
            type="submit"
            style={{
              ...formStyles.button,
              ...(btnHover ? { backgroundColor: "#255bb5" } : {}),
            }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            PDFs generieren
          </button>
        </form>
      )}

      {submitted && (
        <div style={formStyles.pdfLinksWrapper}>
          <h2 style={{ color: "#2f6fdb", marginBottom: 20 }}>
            PDFs sind bereit zum Download
          </h2>

          <PDFDownloadLink
            document={<StrafantragPDF data={formData} />}
            fileName={`Strafantrag_${formData.nachname}_${formData.vorname}.pdf`}
            style={formStyles.pdfLink}
          >
            {({ loading }) =>
              loading ? "Lade Strafantrag..." : "Strafantrag herunterladen"
            }
          </PDFDownloadLink>

          <PDFDownloadLink
            document={<HausverbotPDF data={formData} />}
            fileName={`Hausverbot_${formData.nachname}_${formData.vorname}.pdf`}
            style={{
              ...formStyles.pdfLink,
              ...formStyles.pdfLinkHausverbot,
            }}
          >
            {({ loading }) =>
              loading ? "Lade Hausverbot..." : "Hausverbot herunterladen"
            }
          </PDFDownloadLink>

          <div style={{ marginTop: 40 }}>
            <button
              style={{
                ...formStyles.button,
                backgroundColor: "#888",
                width: "auto",
                padding: "10px 20px",
              }}
              onClick={() => setSubmitted(false)}
            >
              Neues Formular ausfüllen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Roboto Font einbinden (kannst du auch lokal hosten)
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.googleapis.com/css2?family=Roboto&display=swap" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 12,
    padding: 40,
    lineHeight: 1.5,
    color: "#222",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    textDecoration: "underline",
  },
  label: {
    fontWeight: "bold",
  },
  text: {
    marginBottom: 4,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#e4e4e4",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: {
    width: "33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  signatureBox: {
    marginTop: 40,
    borderTopWidth: 1,
    borderColor: "#000",
    width: 200,
    textAlign: "center",
    paddingTop: 6,
  },
  footerNote: {
    fontSize: 10,
    marginTop: 30,
    color: "#555",
    textAlign: "center",
  },
});

export function StrafantragPDF({ formData }) {
  const {
    antragsteller,
    taeter,
    tatbeschreibung,
    hausverbotBegruendung,
  } = formData;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Strafantrag</Text>

        {/* Antragsteller */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>1. Angaben zum Antragsteller</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Name:</Text> {antragsteller.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Adresse:</Text> {antragsteller.adresse}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Telefon:</Text> {antragsteller.telefon}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>E-Mail:</Text> {antragsteller.email}
          </Text>
        </View>

        {/* Täter */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>2. Angaben zum Täter / Verdächtigen</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Name:</Text> {taeter.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Adresse (wenn bekannt):</Text> {taeter.adresse || "–"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Beschreibung:</Text> {taeter.beschreibung || "–"}
          </Text>
        </View>

        {/* Tatbeschreibung */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>3. Beschreibung der Tat</Text>
          <Text style={styles.text}>{tatbeschreibung}</Text>
        </View>

        {/* Strafrechtliche Hinweise */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>4. Wichtige Hinweise</Text>
          <Text style={styles.text}>
            Mit der Einreichung dieses Strafantrags bestätige ich, dass die
            Angaben wahrheitsgemäß und vollständig sind. Falsche Angaben können
            strafrechtliche Folgen haben.
          </Text>
          <Text style={styles.text}>
            Der Strafantrag kann durch die Staatsanwaltschaft zurückgezogen oder
            weiterverfolgt werden.
          </Text>
        </View>

        {/* Unterschrift */}
        <View style={styles.section}>
          <Text style={styles.label}>Ort, Datum:</Text>
          <Text>__________________________</Text>
          <Text style={styles.signatureBox}>Unterschrift Antragsteller</Text>
        </View>

        <Text style={styles.footerNote}>
          Dieses Dokument wurde automatisch erstellt und dient als Vorlage für den
          Strafantrag bei der zuständigen Behörde.
        </Text>
      </Page>
    </Document>
  );
}

export function HausverbotPDF({ formData }) {
  const {
    antragsteller,
    taeter,
    hausverbotBegruendung,
  } = formData;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Hausverbot</Text>

        {/* Antragsteller */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>1. Antragsteller / Inhaber</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Name:</Text> {antragsteller.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Adresse:</Text> {antragsteller.adresse}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Telefon:</Text> {antragsteller.telefon}
          </Text>
        </View>

        {/* Betroffene Person */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>2. Betroffene Person</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Name:</Text> {taeter.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Adresse (wenn bekannt):</Text> {taeter.adresse || "–"}
          </Text>
        </View>

        {/* Hausverbot-Begründung */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>3. Begründung des Hausverbots</Text>
          <Text style={styles.text}>{hausverbotBegruendung || "Keine Angabe"}</Text>
        </View>

        {/* Rechtsgrundlage */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>4. Rechtsgrundlage</Text>
          <Text style={styles.text}>
            Nach § 903 BGB hat der Eigentümer das Recht, anderen den Zutritt zu seinem
            Grundstück zu verwehren. Dieses Hausverbot gilt ab dem untenstehenden Datum.
          </Text>
        </View>

        {/* Dauer und Umfang */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>5. Dauer und Umfang des Hausverbots</Text>
          <Text style={styles.text}>
            Das Hausverbot gilt für den gesamten Geschäftsbereich und für die Dauer von
            12 Monaten. Eine Verlängerung kann schriftlich beantragt werden.
          </Text>
        </View>

        {/* Unterschrift */}
        <View style={styles.section}>
          <Text style={styles.label}>Ort, Datum:</Text>
          <Text>__________________________</Text>
          <Text style={styles.signatureBox}>Unterschrift Antragsteller</Text>
        </View>

        <Text style={styles.footerNote}>
          Dieses Dokument dient als offizielle Mitteilung des Hausverbots und
          wurde automatisch generiert.
        </Text>
      </Page>
    </Document>
  );
}
