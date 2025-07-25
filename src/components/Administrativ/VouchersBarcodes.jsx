import React, { useEffect, useState } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Maße in pt (1 pt = 1/72 inch)
const cardWidth = 242.65;
const cardHeight = 153;
const margin = 10;

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: margin,
    fontFamily: "Helvetica",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: margin * 2,
  },
  cardWrapper: {
    marginRight: margin * 4,
  },
  cardFront: {
    width: cardWidth,
    height: cardHeight,
    border: "1pt solid black",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  cardBack: {
    width: cardWidth,
    height: cardHeight,
    border: "1pt solid #333",
    borderRadius: 8,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  topBar: {
    height: 30,
    left: 0,
    backgroundColor: "#000000",
    width: cardWidth,
    marginBottom: 60,
    borderRadius: 0,
  },
  infoContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  noticeText: {
    fontSize: 6,
    lineHeight: 1.2,
    textAlign: "justify",
    color: "#444444",
    marginTop: 5,
  },
  footerText: {
    fontSize: 5,
    color: "#666666",
    textAlign: "center",
    marginTop: 5,
  },
  barcodeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  barcodeImage: {
    width: "60%",
    height: 30,
  },
  barcodeText: {
    fontSize: 6,
    marginTop: 2,
    color: "#333333",
  },
  frontText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

// PDF-Komponente
const GutscheinePDF = ({ gutscheine }) => {
  const chunkArray = (arr, size) =>
    arr.reduce((acc, _, i) => (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc), []);

  const frontChunks = chunkArray(gutscheine, 2);
  const backChunks = chunkArray(gutscheine, 2);

  return (
    <Document>
      {/* Vorderseite */}
      <Page size="A4" style={styles.page}>
        {frontChunks.map((chunk, rowIndex) => (
          <View key={rowIndex} style={styles.cardRow}>
            {chunk.map((gutschein, index) => (
              <View
                key={gutschein.kartennummer}
                style={[
                  styles.cardWrapper,
                  index === chunk.length - 1 && { marginRight: 0 },
                ]}
              >
                <View style={styles.cardFront}>
                  <Text style={styles.frontText}>GUTSCHEIN</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </Page>

      {/* Rückseite */}
      <Page size="A4" style={styles.page}>
        {backChunks.map((chunk, rowIndex) => (
          <View key={rowIndex} style={styles.cardRow}>
            {chunk.map((gutschein, index) => (
              <View
                key={gutschein.kartennummer}
                style={[
                  styles.cardWrapper,
                  index === chunk.length - 1 && { marginRight: 0 },
                ]}
              >
                <View style={styles.cardBack}>
                  <View style={styles.topBar} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.noticeText}>
                      Karte in allen TBs Solutions Verkaufssteellen einlösbar. Saldo kann an der Kasse abgefragt werden- Keine Barauszahlung des Gesamtbetrags oder des Restsaldos möglich. Die Karte wird bei Verlust oder Diebstahl nicht ersetzt. AGB und Ausnahmen tbs-solutions.vercel.app
                    </Text>
                    <Text style={styles.footerText}>
                      TBS Solutions · www.tbssolutions.ch · info@tbssolutions.ch
                    </Text>
                  </View>
                  <View style={styles.barcodeContainer}>
                    <Image src={gutschein.barcodeImage} style={styles.barcodeImage} />
                    <Text style={styles.barcodeText}>{gutschein.kartennummer}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

// Haupt-Komponente
const GutscheinDruck = () => {
  const [gutscheine, setGutscheine] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGutscheine = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filtere nur Gutscheine, die noch NICHT gedruckt wurden
        const ungeprinteteGutscheine = response.data.filter(
          (gutschein) => !gutschein.is_printed
        );

        const dataWithBarcodes = await Promise.all(
          ungeprinteteGutscheine.map(async (gutschein) => {
            const barcodeImage = await generateBarcode(gutschein.kartennummer.toString());
            return { ...gutschein, barcodeImage };
          })
        );

        setGutscheine(dataWithBarcodes);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Gutscheine:", error);
        setLoading(false);
      }
    };

    fetchGutscheine();
  }, []);

  const generateBarcode = (kartennummer) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, kartennummer, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false,
      });
      resolve(canvas.toDataURL("image/png"));
    });
  };

  const markiereAlsGedruckt = async () => {
    try {
        const token = localStorage.getItem("token");
        const ids = gutscheine.map((g) => g.kartennummer); // Nutze kartennummern statt _id

        if (ids.length === 0) return;

        const response = await axios.post(
            "https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/print",
            { kartennummern: ids }, // Sendet die kartennummern als Array
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log("Gutscheine erfolgreich als gedruckt markiert", response.data);
    } catch (error) {
        console.error("Fehler beim Markieren als gedruckt:", error.response ? error.response.data : error.message);
    }
};


  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Gutscheine PDF erstellen</h1>

      {loading ? (
        <p>Daten werden geladen...</p>
      ) : gutscheine.length === 0 ? (
        <p>Keine neuen Gutscheine zu drucken!</p>
      ) : (
        <PDFDownloadLink
          document={<GutscheinePDF gutscheine={gutscheine} />}
          fileName="Gutscheine.pdf"
          style={{
            textDecoration: "none",
            padding: "10px 20px",
            color: "#fff",
            backgroundColor: "#007bff",
            borderRadius: 5,
          }}
          onClick={() => {
            markiereAlsGedruckt(); // Status auf "gedruckt" setzen
          }}
        >
          {({ loading }) =>
            loading ? "PDF wird erstellt..." : "Gutscheine PDF herunterladen"
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default GutscheinDruck;
