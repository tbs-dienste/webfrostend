import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './BilanzDashboard.scss';

const Bilanz = () => {
  const [bilanzen, setBilanzen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem('token');

  const fetchBilanzen = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bilanz/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBilanzen(res.data.bilanzen);
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
      const res = await axios.post('/api/bilanz/create', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Bilanz erstellt!');
      await fetchBilanzen();
    } catch (err) {
      alert('Fehler beim Erstellen der Bilanz.');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Bilanzen Übersicht', 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [[
        'Datum', 'Version', 'Erstellt von', 
        'Einnahmen (€)', 'Ausgaben (€)', 
        'Lohnkosten (€)', 'Gewinn (€)'
      ]],
      body: bilanzen.map(b => [
        b.datum,
        b.version,
        b.erstellt_von,
        b.gesamt_einnahmen.toFixed(2),
        b.gesamt_ausgaben.toFixed(2),
        b.gesamt_lohnkosten.toFixed(2),
        b.gesamt_gewinn.toFixed(2),
      ]),
    });
    doc.save('bilanzen.pdf');
  };

  useEffect(() => {
    fetchBilanzen();
  }, []);

  return (
    <div className="bilanz-dashboard">
      <div className="header">
        <h1>Bilanzverwaltung</h1>
        <div className="actions">
          <button onClick={createBilanz} disabled={creating}>
            {creating ? 'Erstelle...' : 'Neue Bilanz erstellen'}
          </button>
          <button onClick={exportPDF}>PDF Export</button>
        </div>
      </div>

      {loading ? (
        <p>Lade Daten...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="bilanz-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Version</th>
              <th>Erstellt von</th>
              <th>Einnahmen (€)</th>
              <th>Ausgaben (€)</th>
              <th>Lohnkosten (€)</th>
              <th>Gewinn (€)</th>
            </tr>
          </thead>
          <tbody>
            {bilanzen.map(b => (
              <tr key={`${b.id}`}>
                <td>{b.datum}</td>
                <td>{b.version}</td>
                <td>{b.erstellt_von}</td>
                <td>{b.gesamt_einnahmen.toFixed(2)}</td>
                <td>{b.gesamt_ausgaben.toFixed(2)}</td>
                <td>{b.gesamt_lohnkosten.toFixed(2)}</td>
                <td className={b.gesamt_gewinn >= 0 ? 'plus' : 'minus'}>
                  {b.gesamt_gewinn.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bilanz;