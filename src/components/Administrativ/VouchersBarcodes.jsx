import React, { useEffect, useState } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";

// PDF-Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    fontFamily: "Helvetica",
  },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20, fontWeight: "bold" },
  card: {
    width: "100%",
    padding: 20,
    border: "2px solid black",
    borderRadius: 10,
    textAlign: "center",
  },
  productText: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  barcodeImage: { width: 300, height: 150, marginVertical: 20 },
  barcodeText: { fontSize: 16, marginTop: 10 },
  detailsText: { fontSize: 14, marginVertical: 5 },
});

// PDF-Komponente für Gutscheine
const GutscheinePDF = ({ gutscheine }) => (
  <Document>
    {gutscheine.map((gutschein) => (
      <Page key={gutschein.kartennummer} size="A4" style={styles.page}>
        <Text style={styles.title}>Gutschein</Text>
        <View style={styles.card}>
          <Text style={styles.productText}>Kartentyp: {gutschein.kartentyp}</Text>
          <Image src={gutschein.barcodeImage} style={styles.barcodeImage} />
          <Text style={styles.barcodeText}>Kartennummer: {gutschein.kartennummer}</Text>
          <Text style={styles.detailsText}>Guthaben: {gutschein.guthaben} CHF</Text>
          <Text style={styles.detailsText}>
            Gültig bis: {gutschein.gueltigBis ? new Date(gutschein.gueltigBis).toLocaleDateString() : "Unbegrenzt"}
          </Text>
          <Text style={styles.detailsText}>Status: {gutschein.status}</Text>
        </View>
      </Page>
    ))}
  </Document>
);

// Hauptkomponente
const GutscheinBarcodes = () => {
  const [gutscheine, setGutscheine] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Kein Token gefunden!");
      return;
    }

    axios
      .get("https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetchedGutscheine = Array.isArray(response.data) ? response.data : response.data.data || [];

        const updatedGutscheine = fetchedGutscheine.map((gutschein) => {
          const canvas = document.createElement("canvas");
          JsBarcode(canvas, String(gutschein.kartennummer), {
            format: "CODE128",
            width: 3,
            height: 100,
            text: `${gutschein.kartennummer}`,
          });
          return {
            ...gutschein,
            barcodeImage: canvas.toDataURL("image/png"),
          };
        });

        setGutscheine(updatedGutscheine);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Gutscheine:", error);
        setGutscheine([]);
      });
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Gutscheine Barcodes</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {gutscheine.map((gutschein) => (
          <div key={gutschein.kartennummer} className="p-4 border rounded-lg shadow-lg text-center w-64">
            <h3 className="mb-2 font-semibold text-lg">Kartennummer:</h3>
            <p className="font-mono text-sm">{gutschein.kartennummer}</p>
            <img src={gutschein.barcodeImage} alt={`Barcode ${gutschein.kartennummer}`} className="mx-auto mt-4" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        {gutscheine.length > 0 && (
          <PDFDownloadLink document={<GutscheinePDF gutscheine={gutscheine} />} fileName="gutscheine_barcodes.pdf">
            {({ loading }) => (
              <button className="px-4 py-2 bg-blue-600 text-white rounded shadow">
                {loading ? "PDF wird erstellt..." : "PDF herunterladen"}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default GutscheinBarcodes;
