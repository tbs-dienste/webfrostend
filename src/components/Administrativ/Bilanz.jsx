import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Bilanz.scss';

const Bilanz = () => {
  const [bilanzen, setBilanzen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem('token');

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

  const createBilanz = async () => {
    try {
      setCreating(true);
      await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/bilanz/create', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Bilanz erfolgreich erstellt!');
      fetchBilanzen();
    } catch (err) {
      alert('Fehler beim Erstellen der Bilanz.');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };


  // PDF Export: Übersicht aller Bilanzen
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor('#004080');
    doc.text('Bilanzen Übersicht', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);

    autoTable(doc, {
      startY: 30,
      headStyles: {
        fillColor: '#004080',
        textColor: 'white',
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: { halign: 'center' },
      columns: [
        { header: 'Datum', dataKey: 'datum' },
        { header: 'Version', dataKey: 'version' },
        { header: 'Erstellt von', dataKey: 'erstellt_von' },
        { header: 'Einnahmen (CHF)', dataKey: 'gesamt_einnahmen' },
        { header: 'Ausgaben (CHF)', dataKey: 'gesamt_ausgaben' },
        { header: 'Lohnkosten (CHF)', dataKey: 'gesamt_lohnkosten' },
        { header: 'Gewinn (CHF)', dataKey: 'gesamt_gewinn' },
      ],
      body: bilanzen.map(b => ({
        datum: b.datum,
        version: b.version,
        erstellt_von: b.erstellt_von,
        gesamt_einnahmen: b.gesamt_einnahmen.toFixed(2),
        gesamt_ausgaben: b.gesamt_ausgaben.toFixed(2),
        gesamt_lohnkosten: b.gesamt_lohnkosten.toFixed(2),
        gesamt_gewinn: b.gesamt_gewinn.toFixed(2),
      })),
      margin: { top: 30, left: 14, right: 14 },
      styles: { fontSize: 10 },
    });

    doc.save('bilanzen_uebersicht.pdf');
  };

  const exportDetailPDF = (bilanz) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
  
    doc.setFontSize(22);
    doc.setTextColor('#003366');
    doc.text(`Monatsbilanz: ${bilanz.datum}`, pageWidth / 2, 20, { align: 'center' });
  
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Version: ${bilanz.version}`, 14, 30);
    doc.text(`Erstellt von: ${bilanz.erstellt_von}`, 14, 38);
  
    doc.setDrawColor('#004080');
    doc.setLineWidth(0.8);
    doc.line(14, 42, pageWidth - 14, 42);
  
    doc.setFontSize(14);
    doc.setTextColor('#004080');
    doc.text('Finanzübersicht', 14, 52);
  
    const toNumberSafe = (value) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };
  
    const summaryData = [
      ['Einnahmen (CHF)', toNumberSafe(bilanz.gesamt_einnahmen).toFixed(2)],
      ['Ausgaben (CHF)', toNumberSafe(bilanz.gesamt_ausgaben).toFixed(2)],
      ['Lohnkosten (CHF)', toNumberSafe(bilanz.gesamt_lohnkosten).toFixed(2)],
      ['Gewinn (CHF)', toNumberSafe(bilanz.gesamt_gewinn).toFixed(2)],
    ];
  
    autoTable(doc, {
      startY: 56,
      theme: 'grid',
      head: [['Kategorie', 'Betrag']],
      body: summaryData,
      headStyles: {
        fillColor: '#004080',
        textColor: 'white',
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: { halign: 'right', fontSize: 12 },
      columnStyles: {
        0: { halign: 'left', cellWidth: 110 },
        1: { halign: 'right', cellWidth: 60 },
      },
      margin: { left: 14, right: 14 },
    });
  
    if (bilanz.details && bilanz.details.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor('#004080');
      doc.text('Details', 14, doc.lastAutoTable.finalY + 15);
  
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Kategorie', 'Beschreibung', 'Betrag (CHF)']],
        body: bilanz.details.map(d => [
          d.kategorie,
          d.beschreibung,
          toNumberSafe(d.betrag).toFixed(2)
        ]),
        headStyles: {
          fillColor: '#004080',
          textColor: 'white',
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: { halign: 'right', fontSize: 10 },
        columnStyles: {
          0: { halign: 'left', cellWidth: 60 },
          1: { halign: 'left', cellWidth: 90 },
          2: { halign: 'right', cellWidth: 30 },
        },
        margin: { left: 14, right: 14 },
        styles: { cellPadding: 2 },
      });
    }
  
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Erstellt am: ${date}`, 14, 290);
    doc.text('TBS Digital Solutions', pageWidth - 14, 290, { align: 'right' });
  
    doc.save(`Monatsbilanz_${bilanz.datum.replace(/\./g, '-')}.pdf`);
  };
  
  useEffect(() => {
    fetchBilanzen();
  }, []);

  return (
    <div className="bilanz-dashboard">
      <header className="header">
        <h1>Bilanzverwaltung</h1>
        <div className="actions">
          <button
            onClick={createBilanz}
            disabled={creating}
            className="btn btn-primary"
          >
            {creating ? 'Erstelle...' : 'Neue Bilanz erstellen'}
          </button>
          <button onClick={exportPDF} className="btn btn-secondary">
            PDF Übersicht exportieren
          </button>
        </div>
      </header>

      {loading ? (
        <p className="info-text">Lade Daten...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : bilanzen.length === 0 ? (
        <p className="info-text">Keine Bilanzen vorhanden.</p>
      ) : (
        <div className="table-responsive">
          <table className="bilanz-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Version</th>
                <th>Erstellt von</th>
                <th>Einnahmen (CHF)</th>
                <th>Ausgaben (CHF)</th>
                <th>Lohnkosten (CHF)</th>
                <th>Gewinn (CHF)</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {bilanzen.map((b) => (
                <tr key={b.id}>
                  <td>{b.datum}</td>
                  <td>{b.version}</td>
                  <td>{b.erstellt_von}</td>
                  <td>{Number(b.gesamt_einnahmen || 0).toFixed(2)}</td>
                  <td>{Number(b.gesamt_ausgaben || 0).toFixed(2)}</td>
                  <td>{Number(b.gesamt_lohnkosten || 0).toFixed(2)}</td>
                  <td className={Number(b.gesamt_gewinn || 0) >= 0 ? 'plus' : 'minus'}>
                    {Number(b.gesamt_gewinn || 0).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn btn-detail"
                      onClick={() => exportDetailPDF(b)}
                    >
                      Detail-PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Bilanz;