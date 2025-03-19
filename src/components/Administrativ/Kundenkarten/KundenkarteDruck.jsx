import React, { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import axios from "axios";

// Maße in pt (1 pt = 1/72 inch)
const cardWidth = 255;
const cardHeight = 159;
const margin = 5;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: margin,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    marginBottom: 40, // Abstand nach unten zu den Karten (40pt)
    paddingHorizontal: 20,
  },
  headerLine: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5, // Abstand zwischen den Zeilen
  },
  pageContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  cardWrapper: {
    width: cardWidth,
    height: cardHeight,
    border: "1pt solid #333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginRight: margin,
    marginBottom: margin,
  },
  cardFront: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 8,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  cardBack: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 8,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  frontText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  barcodeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  barcodeImage: {
    width: 150,
    height: 30,
  },
  barcodeText: {
    fontSize: 6,
    marginTop: 2,
    color: "#333333",
  },
  topBar: {
    height: 20,
    left: 0,
    backgroundColor: "#000000",
    width: cardWidth,
    marginBottom: 5,
    borderRadius: 0,
  },
});

const KundenkartePDF = ({ kundenkarte }) => {
  const generateBarcode = (kundenkartennummer) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, kundenkartennummer, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false,
        background: "#ffffff",
        lineColor: "#000000",
      });
      resolve(canvas.toDataURL("image/png"));
    });
  };

  const [barcodeImage, setBarcodeImage] = useState(null);

  useEffect(() => {
    const fetchBarcode = async () => {
      if (kundenkarte && kundenkarte.kundenkartennummer) {
        const barcode = await generateBarcode(kundenkarte.kundenkartennummer);
        setBarcodeImage(barcode);
      }
    };
    fetchBarcode();
  }, [kundenkarte]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Text untereinander */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerLine}>
            Gerne überreichen wir Ihnen den Wiederholungsdruck Ihrer TBs Prime Club Karte,
          </Text>
          <Text style={styles.headerLine}>
            welchen Sie am heutigen Tag oder bis zum Erhalt Ihrer neuen TBs Prime Club Karte
          </Text>
          <Text style={styles.headerLine}>
            für das Sammeln von Goldpunkten einsetzen können.
          </Text>
          <Text style={styles.headerLine}>
            Bitte beachten Sie, dass diese Karte nicht als Zahlungsmittel genutzt werden kann.
          </Text>
          <Text style={styles.headerLine}>{" "}</Text> {/* Leerzeile */}
          <Text style={styles.headerLine}>
            Mit der TBs Prime Club Karte profitieren Sie von 4 Goldpunkten pro Einkaufsfranken.
          </Text>
          <Text style={styles.headerLine}>{" "}</Text> {/* Leerzeile */}
          <Text style={styles.headerLine}>
            Nun wünschen wir Ihnen viel Freude beim Einkaufen.
          </Text>
        </View>

        {/* Kartenbereich */}
        <View style={styles.pageContent}>
          {/* Vorderseite */}
          <View style={styles.cardWrapper}>
            <View style={styles.cardFront}>
              <Text style={styles.frontText}>{kundenkarte.name}</Text>
            </View>
          </View>

          {/* Rückseite */}
          <View style={styles.cardWrapper}>
            <View style={styles.cardBack}>
              <View style={styles.topBar} />
              {barcodeImage && (
                <View style={styles.barcodeContainer}>
                  <Image src={barcodeImage} style={styles.barcodeImage} />
                  <Text style={styles.barcodeText}>
                    {kundenkarte.kundenkartennummer}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const KundenkarteDruck = () => {
  const [kundenkarte, setKundenkarte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKundenkarte = async () => {
      try {
        const response = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten/1234567890123456789",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setKundenkarte(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Kundenkarte:", error);
        setLoading(false);
      }
    };

    fetchKundenkarte();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Kundenkarte PDF erstellen</h1>

      {loading ? (
        <p>Daten werden geladen...</p>
      ) : !kundenkarte ? (
        <p>Keine Kundenkarte gefunden!</p>
      ) : (
        <PDFDownloadLink
          document={<KundenkartePDF kundenkarte={kundenkarte} />}
          fileName={`Kundenkarte_${kundenkarte.kundenkartennummer}.pdf`}
          style={{
            textDecoration: "none",
            padding: "10px 20px",
            color: "#fff",
            backgroundColor: "#007bff",
            borderRadius: 5,
          }}
        >
          {({ loading }) =>
            loading
              ? "PDF wird erstellt..."
              : "Kundenkarte PDF herunterladen"
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default KundenkarteDruck;
