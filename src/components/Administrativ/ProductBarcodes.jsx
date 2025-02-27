import React, { useEffect, useState } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";

// PDF-Styles
const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 20, fontFamily: "Helvetica" },
  title: { fontSize: 20, textAlign: "center", marginBottom: 10, fontWeight: "bold" },
  container: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  card: { width: "45%", margin: 10, padding: 10, border: "1px solid black", borderRadius: 5, textAlign: "center" },
  productText: { fontSize: 14, marginBottom: 5, fontWeight: "bold" },
  barcodeImage: { width: 200, height: 100, alignSelf: "center" }, // Vergrößert den Barcode
  barcodeText: { fontSize: 14, marginTop: 5 }, // Text unter dem Barcode
});

// Barcode-PDF-Komponente
const BarcodePDF = ({ products }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Produkt-Barcodes</Text>
      <View style={styles.container}>
        {products.map((product) => (
          <View key={product.barcode} style={styles.card}>
            <Text style={styles.productText}>{product.article_short_text}</Text>
            <Image src={product.barcodeImage} style={styles.barcodeImage} />
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Hauptkomponente
const ProductBarcodes = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Token aus localStorage holen

    if (!token) {
      console.error("Kein Token gefunden!");
      return;
    }

    axios
      .get("https://tbsdigitalsolutionsbackend.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.data || [];

        // Barcodes generieren und in Base64 konvertieren
        const updatedProducts = fetchedProducts.map(product => {
          const canvas = document.createElement("canvas");
          JsBarcode(canvas, product.barcode, { format: "CODE128", width: 3, height: 100, text: product.barcode });
          return { ...product, barcodeImage: canvas.toDataURL("image/png") };
        });

        setProducts(updatedProducts);
      })
      .catch(error => {
        console.error("Fehler beim Laden der Produkte:", error);
        setProducts([]);
      });
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Produkt-Barcodes</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product) => (
          <div key={product.barcode} className="p-4 border rounded-lg shadow-lg text-center w-64">
            <h3 className="mb-2 font-semibold text-lg">{product.article_short_text}</h3>
            <img src={product.barcodeImage} alt={`Barcode ${product.barcode}`} className="mx-auto" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        {products.length > 0 && (
          <PDFDownloadLink document={<BarcodePDF products={products} />} fileName="barcodes.pdf">
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

export default ProductBarcodes;
