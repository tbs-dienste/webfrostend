import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import './AlleGutscheine.scss';

const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 54;
const H_MARGIN_MM = 6;
const V_MARGIN_MM = 6;
const GRID_COLS = 2;
const GRID_ROWS = 5;

const AlleGutscheine = () => {
  const [gutscheine, setGutscheine] = useState([]);
  const [loading, setLoading] = useState(false);
  const barcodeCache = new Map();

  useEffect(() => {
    const fetchGutscheine = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT aus localStorage
        if (!token) return alert('Kein Token gefunden!');

        const res = await fetch('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Fehler beim Laden der Gutscheine');
        const data = await res.json();
        setGutscheine(data);
      } catch (err) {
        console.error(err);
        alert('Fehler beim Laden der Gutscheine.');
      }
    };
    fetchGutscheine();
  }, []);

  const makeBarcodeDataURL = (text) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, text, { format: 'CODE128', displayValue: false, margin: 0 });
    return canvas.toDataURL('image/png');
  };

  const generatePDF = async () => {
    if (!gutscheine.length) {
      return alert('Keine Gutscheine vorhanden.');
    }
    setLoading(true);

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      doc.setProperties({ title: 'Gutscheine – Kreditkarten-Design' });

      const brand = { primary: '#003366', accent: '#ffffff' };

      const drawCard = async (g, x, y) => {
        const code = g.kartennummer || g.id || '';
        const valueRight = g.guthaben ? `${g.guthaben} CHF` : '–';

        doc.setFillColor(brand.primary);
        doc.roundedRect(x, y, CARD_WIDTH_MM, CARD_HEIGHT_MM, 5, 5, 'F');

        doc.setTextColor(brand.accent);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('GUTSCHEIN', x + 6, y + 12);

        doc.setFontSize(10);
        doc.text(valueRight, x + CARD_WIDTH_MM - 6, y + 12, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`Nr: ${code}`, x + 6, y + CARD_HEIGHT_MM / 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text('Ihre Firma GmbH', x + 6, y + CARD_HEIGHT_MM - 6);

        let dataUrl = barcodeCache.get(code);
        if (!dataUrl) {
          dataUrl = makeBarcodeDataURL(code);
          barcodeCache.set(code, dataUrl);
        }
        const barcodeW = 40;
        const barcodeH = 12;
        doc.addImage(dataUrl, 'PNG', x + CARD_WIDTH_MM - barcodeW - 6, y + CARD_HEIGHT_MM - barcodeH - 6, barcodeW, barcodeH);
      };

      let col = 0, row = 0;
      for (let i = 0; i < gutscheine.length; i++) {
        const g = gutscheine[i];
        const x = H_MARGIN_MM + col * (CARD_WIDTH_MM + H_MARGIN_MM);
        const y = V_MARGIN_MM + row * (CARD_HEIGHT_MM + V_MARGIN_MM);

        await drawCard(g, x, y);

        col++;
        if (col >= GRID_COLS) {
          col = 0;
          row++;
        }
        if (row >= GRID_ROWS && i < gutscheine.length - 1) {
          doc.addPage('a4', 'portrait');
          row = 0;
          col = 0;
        }
      }

      doc.save('Gutscheine-Kreditkarten.pdf');
    } catch (err) {
      console.error(err);
      alert('Fehler beim Erstellen des PDFs.');
    } finally {
      setLoading(false);
    }
  };

  const JsBarcodeToDataURL = (code) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, code, { format: 'CODE128', displayValue: false });
    return canvas.toDataURL('image/png');
  };

  return (
    <div className="alle-gutscheine">
      <h1>Alle Gutscheine</h1>
      <button className="btn" onClick={generatePDF} disabled={loading}>
        {loading ? 'Wird erstellt…' : 'PDF (Kreditkarten-Design)'}
      </button>

      <div className="gutschein-grid">
        {gutscheine.map((g) => (
          <div key={g.id} className="gutschein-card-preview">
            <div className="card-header">GUTSCHEIN</div>
            <div className="card-guthaben">{g.guthaben} CHF</div>
            <div className="card-number">Nr: {g.kartennummer}</div>
            <div className="card-firma">Ihre Firma GmbH</div>
            <img
              className="card-barcode"
              src={JsBarcodeToDataURL(g.kartennummer)}
              alt="Barcode"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlleGutscheine;
