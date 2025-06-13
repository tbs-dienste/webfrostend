import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  useEffect(() => {
    fetchBilanzen();
  }, []);

  // Hilfsfunktion: Vormonat bestimmen (Datum im Format YYYY-MM-DD)
  const getVorMonatDatum = (datum) => {
    const date = new Date(datum);
    let month = date.getMonth(); // 0-11
    let year = date.getFullYear();
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    return `${year}-${String(month + 1).padStart(2, '0')}-01`;
  };

  // Neueste Bilanz finden (Datum sortiert, absteigend)
  const aktuelleBilanz = bilanzen.slice().sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
  const vorMonatDatum = aktuelleBilanz ? getVorMonatDatum(aktuelleBilanz.datum) : null;
  const vorMonatBilanz = bilanzen.find(b => b.datum === vorMonatDatum);

  // Daten für Chart aufbauen
  const chartData = aktuelleBilanz && vorMonatBilanz ? [
    {
      name: 'Einnahmen',
      'Aktueller Monat': Number(aktuelleBilanz.gesamt_einnahmen || 0),
      'Vormonat': Number(vorMonatBilanz.gesamt_einnahmen || 0),
    },
    {
      name: 'Ausgaben',
      'Aktueller Monat': Number(aktuelleBilanz.gesamt_ausgaben || 0),
      'Vormonat': Number(vorMonatBilanz.gesamt_ausgaben || 0),
    },
    {
      name: 'Lohnkosten',
      'Aktueller Monat': Number(aktuelleBilanz.gesamt_lohnkosten || 0),
      'Vormonat': Number(vorMonatBilanz.gesamt_lohnkosten || 0),
    },
    {
      name: 'Gewinn',
      'Aktueller Monat': Number(aktuelleBilanz.gesamt_gewinn || 0),
      'Vormonat': Number(vorMonatBilanz.gesamt_gewinn || 0),
    }
  ] : [];

  // Vergleichstexte generieren
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

  return (
    <div className="bilanz-dashboard">
      <header className="header">
        <h1>Bilanzverwaltung</h1>
        <div className="actions">
          <button onClick={() => alert('Erstellen noch nicht implementiert')} disabled={creating} className="btn btn-primary">
            {creating ? 'Erstelle...' : 'Neue Bilanz erstellen'}
          </button>
          <button onClick={() => alert('PDF Export noch nicht implementiert')} className="btn btn-secondary">
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
        <>
          <div className="chart-container" style={{ width: '100%', height: 300, marginBottom: 30 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="Aktueller Monat" fill="#004080" />
                  <Bar dataKey="Vormonat" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Keine Vormonatsdaten für Diagramm vorhanden.</p>
            )}
          </div>

          {renderComparison()}

          <div className="table-responsive" style={{ marginTop: 40 }}>
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
                      <button className="btn btn-detail" onClick={() => alert('Detail PDF exportieren')}>
                        Detail-PDF
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
