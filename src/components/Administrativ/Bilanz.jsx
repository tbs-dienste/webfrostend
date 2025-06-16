import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Bilanz.scss';
import * as htmlToImage from 'html-to-image';

const Bilanz = () => {
  const [bilanzen, setBilanzen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem('token');
  const chartRef = useRef(null);

  // Fetch Bilanzen-Liste
  const fetchBilanzen = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bilanz', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBilanzen(res.data.bilanzen);
      setError('');
    } catch (err) {
      setError('Fehler beim Laden der Bilanzen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Chart Daten für den Vergleich (aktuell vs. Vormonat)
  const fetchChartData = async () => {
    try {
      const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bilanz/vergleiche', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const chartFormatted = res.data.vergleich.map(item => ({
        name: item.feld,
        'Aktueller Monat': item.aktuell,
        'Vormonat': item.vormonat,
        'Differenz': item.differenz,
      }));
      setChartData(chartFormatted);
    } catch (err) {
      console.error('Fehler beim Laden der Chart-Daten', err);
    }
  };

  useEffect(() => {
    fetchBilanzen();
    fetchChartData();
  }, []);

  // Hilfsfunktion Vormonat-Datum
  const getVorMonatDatum = (datum) => {
    const date = new Date(datum);
    let month = date.getMonth();
    let year = date.getFullYear();
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    return `${year}-${String(month + 1).padStart(2, '0')}-01`;
  };

  const aktuelleBilanz = bilanzen.slice().sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
  const vorMonatDatum = aktuelleBilanz ? getVorMonatDatum(aktuelleBilanz.datum) : null;
  const vorMonatBilanz = bilanzen.find(b => b.datum.startsWith(vorMonatDatum));

  // Vergleichstext im JSX
  const renderComparison = () => {
    if (!aktuelleBilanz || !vorMonatBilanz) return <p>Keine Vormonatsbilanz zum Vergleich vorhanden.</p>;

    const propsToCompare = ['gesamt_einnahmen', 'gesamt_ausgaben', 'gesamt_lohnkosten', 'gesamt_gewinn'];
    const labels = ['Einnahmen', 'Ausgaben', 'Lohnkosten', 'Gewinn'];

    return (
      <div className="vergleich-text">
        {propsToCompare.map((prop, i) => {
          const aktuell = Number(aktuelleBilanz[prop] || 0);
          const vorher = Number(vorMonatBilanz[prop] || 0);
          const diff = aktuell - vorher;
          const prozent = vorher === 0 ? '–' : ((diff / vorher) * 100).toFixed(1);
          const besser = diff > 0 ? 'besser' : diff < 0 ? 'schlechter' : 'gleich';

          return (
            <p key={prop}>
              {labels[i]}: {aktuell.toFixed(2)} CHF ({prozent}% {besser} als Vormonat)
            </p>
          );
        })}
      </div>
    );
  };

  const exportPDF = async () => {
    if (!aktuelleBilanz) {
      alert('Keine aktuelle Bilanz zum Exportieren vorhanden.');
      return;
    }
  
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    const headerText = 'Bilanzübersicht';
    const createdDate = `Erstellt am: ${new Date().toLocaleDateString()}`;
    const headerFontSize = 14;
    const contentFontSize = 9;
    const lineHeight = 6;
  
    doc.setFont('times', 'normal');
    doc.setFontSize(headerFontSize);
  
    // Kopfzeile
    doc.text(headerText, 14, 15);
    doc.setFontSize(contentFontSize);
    doc.text(createdDate, pageWidth - 60, 15);
  
    let currentY = 25;
  
    // Aktuelles Bilanzdatum
    doc.setFontSize(10);
    doc.text(`Bilanzdatum: ${aktuelleBilanz.datum.slice(0, 10)}`, 14, currentY);
    currentY += lineHeight;
  
    if (vorMonatBilanz) {
      doc.text(`Vormonat: ${vorMonatBilanz.datum.slice(0, 10)}`, 14, currentY);
    } else {
      doc.text('Kein Vergleich mit Vormonat möglich.', 14, currentY);
    }
  
    currentY += 10;
  
    // Chart einfügen
    try {
      if (chartRef.current) {
        const imgData = await htmlToImage.toPng(chartRef.current);
        doc.addImage(imgData, 'PNG', 14, currentY, 180, 70);
        currentY += 80;
      }
    } catch (e) {
      console.warn('Chart-Bild konnte nicht eingefügt werden:', e);
    }
  
    // Aktuelle Bilanz-Tabelle
    autoTable(doc, {
      startY: currentY,
      head: [['Position', 'Betrag (CHF)']],
      body: [
        ['Einnahmen', Number(aktuelleBilanz.gesamt_einnahmen || 0).toFixed(2)],
        ['Ausgaben', Number(aktuelleBilanz.gesamt_ausgaben || 0).toFixed(2)],
        ['Lohnkosten', Number(aktuelleBilanz.gesamt_lohnkosten || 0).toFixed(2)],
        ['Gewinn', Number(aktuelleBilanz.gesamt_gewinn || 0).toFixed(2)],
      ],
      theme: 'plain',
      styles: {
        font: 'times',
        fontSize: contentFontSize,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        halign: 'center',
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });
  
    currentY = doc.lastAutoTable.finalY + 10;
  
    // Vergleich mit Vormonat
    if (vorMonatBilanz) {
      const props = ['gesamt_einnahmen', 'gesamt_ausgaben', 'gesamt_lohnkosten', 'gesamt_gewinn'];
      const labels = ['Einnahmen', 'Ausgaben', 'Lohnkosten', 'Gewinn'];
  
      const body = props.map((prop, i) => {
        const aktuell = Number(aktuelleBilanz[prop] || 0);
        const vorher = Number(vorMonatBilanz[prop] || 0);
        const diff = aktuell - vorher;
        const prozent = vorher === 0 ? '–' : ((diff / vorher) * 100).toFixed(1) + ' %';
        const status = diff > 0 ? 'Positiv' : diff < 0 ? 'Negativ' : 'Unverändert';
  
        return [labels[i], aktuell.toFixed(2), vorher.toFixed(2), prozent, status];
      });
  
      doc.setFontSize(10);
      doc.text('Vergleich zum Vormonat:', 14, currentY);
  
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Position', 'Aktuell (CHF)', 'Vormonat (CHF)', 'Differenz', 'Bewertung']],
        body,
        theme: 'plain',
        styles: {
          font: 'times',
          fontSize: contentFontSize,
          halign: 'center',
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
        },
      });
  
      currentY = doc.lastAutoTable.finalY + 10;
    }
  
    // Neue Seite mit Gesamttabelle
    doc.addPage();
  
    doc.setFontSize(11);
    doc.text('Gesamte Bilanzhistorie', 14, 20);
  
    autoTable(doc, {
      startY: 26,
      head: [['Datum', 'Einnahmen', 'Ausgaben', 'Lohnkosten', 'Gewinn']],
      body: bilanzen.map(b => [
        b.datum.slice(0, 10),
        Number(b.gesamt_einnahmen || 0).toFixed(2),
        Number(b.gesamt_ausgaben || 0).toFixed(2),
        Number(b.gesamt_lohnkosten || 0).toFixed(2),
        Number(b.gesamt_gewinn || 0).toFixed(2),
      ]),
      theme: 'plain',
      styles: {
        font: 'times',
        fontSize: contentFontSize,
        halign: 'center',
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });
  
    // Fußzeile (auf jeder Seite)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Seite ${i} von ${pageCount}`, pageWidth - 30, pageHeight - 10);
      doc.text('© TBs Soltutions – Vertraulich', 14, pageHeight - 10);
    }
  
    doc.save(`Bilanz_Uebersicht_${aktuelleBilanz.datum.slice(0, 10)}.pdf`);
  };
  
  

  return (
    <div className="bilanz-dashboard">
      <header className="header">
        <h1>Bilanzverwaltung</h1>
        <div className="actions">
          <button
            onClick={() => alert('Erstellen noch nicht implementiert')}
            disabled={creating}
            className="btn primary"
          >
            Neue Bilanz erstellen
          </button>
          <button onClick={exportPDF} className="btn secondary">
            PDF Übersicht exportieren
          </button>
        </div>
      </header>

      {loading ? (
        <p>Lade Bilanzen...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="vergleich-box">{renderComparison()}</div>

          <div ref={chartRef} style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="linear" dataKey="Aktueller Monat" stroke="#4caf50" />
                <Line type="linear" dataKey="Vormonat" stroke="#f44336" />
                <Line type="linear" dataKey="Differenz" stroke="#2196f3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <table className="bilanz-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Einnahmen</th>
                <th>Ausgaben</th>
                <th>Lohnkosten</th>
                <th>Gewinn</th>
              </tr>
            </thead>
            <tbody>
              {bilanzen.map((bilanz) => (
                <tr key={bilanz._id}>
                  <td>{bilanz.datum.slice(0, 10)}</td>
                  <td>{Number(bilanz.gesamt_einnahmen || 0).toFixed(2)}</td>
                  <td>{Number(bilanz.gesamt_ausgaben || 0).toFixed(2)}</td>
                  <td>{Number(bilanz.gesamt_lohnkosten || 0).toFixed(2)}</td>
                  <td>{Number(bilanz.gesamt_gewinn || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Bilanz;
