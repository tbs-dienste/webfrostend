import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './Bilanz.scss';

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
      // Erwartet: Array mit Objekten [{name: "Einnahmen", "Aktueller Monat": 6000, "Vormonat": 5000}, ...]
      // Falls anders, muss hier umgewandelt werden
      // Du hast Beispiel "vergleich" mit feld, aktuell, vormonat, ...
      const chartFormatted = res.data.vergleich.map(item => ({
  name: item.feld,
  'Aktueller Monat': item.aktuell,
  'Vormonat': item.vormonat,
  'Differenz': item.differenz,   // <-- korrigiert
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
  const vorMonatBilanz = bilanzen.find(b => b.datum.startsWith(vorMonatDatum)); // falls Zeitstempel

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

  // PDF exportiert nur Tabellen & Text, kein Chart-Bild!
  const exportPDF = () => {
    if (!aktuelleBilanz) {
      alert('Keine aktuelle Bilanz zum Exportieren vorhanden.');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('Bilanz Übersicht', 14, 20);

    doc.setFontSize(12);
    doc.text(`Datum der aktuellen Bilanz: ${aktuelleBilanz.datum.slice(0, 10)}`, 14, 30);
    if (vorMonatBilanz) {
      doc.text(`Vormonatsbilanz Datum: ${vorMonatBilanz.datum.slice(0, 10)}`, 14, 38);
    } else {
      doc.text('Keine Vormonatsbilanz zum Vergleich vorhanden.', 14, 38);
    }

    // Tabelle mit aktueller Bilanz
    autoTable(doc, {
      startY: 45,
      head: [['Feld', 'Betrag (CHF)']],
      body: [
        ['Einnahmen', Number(aktuelleBilanz.gesamt_einnahmen || 0).toFixed(2)],
        ['Ausgaben', Number(aktuelleBilanz.gesamt_ausgaben || 0).toFixed(2)],
        ['Lohnkosten', Number(aktuelleBilanz.gesamt_lohnkosten || 0).toFixed(2)],
        ['Gewinn', Number(aktuelleBilanz.gesamt_gewinn || 0).toFixed(2)],
      ],
      theme: 'grid',
    });

    // Vergleichstabelle Vormonat
    if (vorMonatBilanz) {
      const propsToCompare = ['gesamt_einnahmen', 'gesamt_ausgaben', 'gesamt_lohnkosten', 'gesamt_gewinn'];
      const labels = ['Einnahmen', 'Ausgaben', 'Lohnkosten', 'Gewinn'];

      const body = propsToCompare.map((prop, i) => {
        const aktuell = Number(aktuelleBilanz[prop] || 0);
        const vorher = Number(vorMonatBilanz[prop] || 0);
        const diff = aktuell - vorher;
        const prozent = vorher === 0 ? '–' : ((diff / vorher) * 100).toFixed(1);
        const besser = diff > 0 ? 'besser' : diff < 0 ? 'schlechter' : 'gleich';

        return [
          labels[i],
          aktuell.toFixed(2),
          vorher.toFixed(2),
          `${prozent}%`,
          besser,
        ];
      });

      doc.text('Vergleich mit Vormonat:', 14, doc.lastAutoTable.finalY + 10);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Feld', 'Aktueller Monat', 'Vormonat', 'Differenz (%)', 'Status']],
        body,
        theme: 'striped',
      });
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
          <ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="Aktueller Monat" stroke="#4caf50" />
    <Line type="monotone" dataKey="Vormonat" stroke="#f44336" />
    <Line type="monotone" dataKey="Differenz" stroke="#2196f3" />
  </LineChart>
</ResponsiveContainer>



          <div className="table-box">
            <table className="bilanz-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Einnahmen</th>
                  <th>Ausgaben</th>
                  <th>Lohnkosten</th>
                  <th>Gewinn</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {bilanzen.map((b, index) => (
                  <tr key={index}>
                    <td>{b.datum.slice(0, 10)}</td>
                    <td>{Number(b.gesamt_einnahmen || 0).toFixed(2)}</td>
                    <td>{Number(b.gesamt_ausgaben || 0).toFixed(2)}</td>
                    <td>{Number(b.gesamt_lohnkosten || 0).toFixed(2)}</td>
                    <td>{Number(b.gesamt_gewinn || 0).toFixed(2)}</td>
                    <td>
                      <button onClick={() => alert('Detailansicht noch nicht implementiert')} className="btn link">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Bilanz;
