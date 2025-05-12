import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import JsBarcode from 'jsbarcode';
import './ProductDetails.scss';
import black from "./black.png";

const ProductDetails = () => {
  const { article_number } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Kein Token gefunden. Bitte logge dich ein.');
          return;
        }

        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/products/${article_number}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.data?.article_number === article_number) {
          setProduct(response.data.data);
          setError('');
        } else {
          setProduct(null);
          setError('Produkt nicht gefunden.');
        }
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden des Produkts.');
        setProduct(null);
      }
    };

    fetchProduct();
  }, [article_number]);

  const generatePDF = () => {
    if (!product) return;
  
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'A4',
    });
  
    const barcodeImage = generateBarcode(product.barcode);
    const logoUrl = black; // z. B. im public-Ordner platzieren
  
    // Logo einfügen
    const logoImg = new Image();
    logoImg.src = logoUrl;
    logoImg.onload = () => {
      doc.addImage(logoImg, 'PNG', 14, 10, 30, 15); // oben links
  
      // Titel
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text('Produktblatt', 105, 20, { align: 'center' });
  
      // Linien und Abschnitt
      doc.setLineWidth(0.5);
      doc.line(14, 28, 196, 28);
  
      // Produktdetails schön formatiert
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
  
      const info = [
        ['Artikelnummer', product.article_number],
        ['Produktname', product.article_short_text],
        ['Barcode', product.barcode],
        ['SAP-Nummer', product.sap_number],
        ['Hersteller', product.manufacturer],
        ['Kategorie', product.category],
        ['Beschreibung', product.description || 'Keine Beschreibung verfügbar'],
        ['Preis', `${product.price} EUR`],
        ['MwSt-Satz', `${product.mwst_satz}%`],
        ['Gültig', `${new Date(product.gueltig_ab).toLocaleDateString()} – ${new Date(product.gueltig_bis).toLocaleDateString()}`],
        ['Lagerbestand', `Min: ${product.min_stock} | Max: ${product.max_stock} | Aktuell: ${product.current_stock}`],
      ];
  
      let y = 35;
      info.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.text(`${label}:`, 14, y);
        doc.setFont(undefined, 'normal');
        doc.text(`${value}`, 60, y);
        y += 8;
      });
  
      // Barcode unterhalb
      y += 10;
      doc.addImage(barcodeImage, 'PNG', 14, y, 100, 30);
      y += 35;
  
      // Barcode-Nummer unter Barcode
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(product.barcode, 14, y);
  
      doc.save(`${product.article_number}_Produktblatt.pdf`);
    };
  };

  const generateBarcode = (barcode) => {
    const canvas = document.createElement('canvas');
  
    JsBarcode(canvas, barcode, {
      format: 'CODE128', // <-- statt EAN13
      width: 2,
      height: 60,
      displayValue: false,
    });
  
    return canvas.toDataURL('image/png');
  };
  

  return (
    <div className="product-details">
      <h2>Produktdetails für Artikelnummer: {article_number}</h2>

      {error && <div className="error-message">{error}</div>}

      {product ? (
        <div className="product-info">
          <div className="product-header">
            <h3>{product.article_short_text}</h3>
            <p className="manufacturer">Hersteller: {product.manufacturer}</p>
          </div>

          <div className="product-info-details">
            <p><strong>Artikelnummer:</strong> {product.article_number}</p>
            <p><strong>Barcode:</strong> {product.barcode}</p>
            <p><strong>SAP-Nummer:</strong> {product.sap_number}</p>
            <p><strong>Kategorie:</strong> {product.category}</p>
            <p><strong>Beschreibung:</strong> {product.description || 'Keine Beschreibung verfügbar'}</p>
            <p><strong>Preis:</strong> {product.price} EUR</p>
            <p><strong>MwSt-Satz:</strong> {product.mwst_satz}%</p>
            <p><strong>Gültig ab:</strong> {new Date(product.gueltig_ab).toLocaleDateString()}</p>
            <p><strong>Gültig bis:</strong> {new Date(product.gueltig_bis).toLocaleDateString()}</p>
            <p><strong>Min. Lagerbestand:</strong> {product.min_stock}</p>
            <p><strong>Max. Lagerbestand:</strong> {product.max_stock}</p>
            <p><strong>Aktueller Lagerbestand:</strong> {product.current_stock}</p>
          </div>

          <button className="generate-pdf-btn" onClick={generatePDF}>PDF generieren</button>
        </div>
      ) : (
        <div className="no-product">
          <p>Es konnte kein Produkt mit dieser Artikelnummer gefunden werden.</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
