import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './PrinterManager.scss';
import Sidebar from './Sidebar';
import { Loader2, RefreshCcw, Printer } from 'lucide-react';

const PrinterManager = ({ onKassenModusChange }) => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inkLevels, setInkLevels] = useState(null);
  const [inkLoading, setInkLoading] = useState(false);
  const [printerStatus, setPrinterStatus] = useState(null);
  const [printerStats, setPrinterStats] = useState(null);

  useEffect(() => {
    fetchPrinters();
  }, []);

  useEffect(() => {
    onKassenModusChange(true);
    return () => onKassenModusChange(false);
  }, [onKassenModusChange]);

  const fetchInkLevels = useCallback(async () => {
    if (!selectedPrinter) return;
    setInkLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/printer/check-ink',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { printerName: selectedPrinter },
        }
      );
      setInkLevels(res.data.inkLevels);
      setPrinterStatus(res.data.status || 'Bereit');
      setPrinterStats(res.data.stats || { gedruckt: 230, seitenProTag: 12 });
    } catch (err) {
      console.error('Fehler beim Abrufen der Tintenfüllstände:', err);
    } finally {
      setInkLoading(false);
    }
  }, [selectedPrinter]);

  useEffect(() => {
    fetchInkLevels();
  }, [selectedPrinter, fetchInkLevels]);

  const fetchPrinters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/printer',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrinters(res.data.printers);
      setSelectedPrinter(res.data.selectedPrinter || res.data.printers[0]);
    } catch (err) {
      console.error('Fehler beim Abrufen der Druckerliste:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrinter = async (printerName) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/printer/setPrinter',
        { printerName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedPrinter(printerName);
      fetchInkLevels();
    } catch (err) {
      console.error('Fehler beim Setzen des Druckers:', err);
    } finally {
      setLoading(false);
    }
  };


  const getInkColor = (color) => {
    switch (color.toLowerCase()) {
      case 'schwarz':
      case 'black':
        return '#000';
      case 'gelb':
      case 'yellow':
        return '#FFEB3B';
      case 'cyan':
      case 'blau':
        return '#03A9F4';
      case 'magenta':
      case 'pink':
        return '#E91E63';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className='printer-manager-wrapper'>
      <Sidebar />
      <div className="printer-manager-container">
        <h2 className="title">🖨️ Druckerverwaltung</h2>

        <div className="printer-selection">
          <label htmlFor="printer-select">Drucker auswählen:</label>
          <div className="dropdown-container">
            <select
              id="printer-select"
              value={selectedPrinter || ''}
              onChange={(e) => handleSetPrinter(e.target.value)}
              disabled={loading}
            >
              {printers.map((printer, index) => (
                <option key={index} value={printer}>
                  {printer.name} ({printer.type || 'Unbekannt'})
                </option>
              ))}

              {/* Option zum Hinzufügen eines Druckers */}
              <option value="add-printer">Drucker hinzufügen...</option>
            </select>

            {/* Optionaler Button zum Hinzufügen eines Druckers */}
            {selectedPrinter === "add-printer" && (
              <button
                className="add-printer-btn"
                onClick={() => alert("Drucker hinzufügen Funktionalität hier implementieren")}
              >
                Drucker hinzufügen
              </button>
            )}
          </div>
        </div>



        <div className="status-window">
          <div className="status-header">
            <div className="epson-logo">
              {selectedPrinter || 'Kein Drucker ausgewählt'}
            </div>
            <div className={`status-indicator ${printerStatus === 'Bereit' ? 'online' : 'offline'}`}>
              {printerStatus || 'Unbekannt'}
            </div>
          </div>

          <div className="status-title">Tintenfüllstände</div>

          <div className="ink-levels-container">
            {inkLoading ? (
              <div className="loading">
                <Loader2 className="spinner" /> Lade...
              </div>
            ) : inkLevels ? (
              Object.entries(inkLevels).map(([color, level], index) => (
                <div className="ink-cartridge" key={index}>
                  <div className="ink-label">{color.toUpperCase()}</div>
                  <div className="ink-bar">
                    <div
                      className="ink-fill"
                      style={{
                        height: `${level}`,
                        backgroundColor: getInkColor(color),
                      }}
                    />
                  </div>
                  <div className="ink-percentage">{level}</div>
                  {parseInt(level) <= 10 && (
                    <div className="low-ink-warning">⚠️ </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-ink-data">Keine Daten verfügbar</div>
            )}
          </div>

          <div className="printer-stats">
            <h4>Druckerstatistik</h4>
            <ul>
              <li>Gedruckte Seiten: <strong>{printerStats?.gedruckt || 0}</strong></li>
              <li>Seiten pro Tag: <strong>{printerStats?.seitenProTag || 0}</strong></li>
              <li>Letzter Testdruck: <strong>{printerStats?.lastTest || 'Nie'}</strong></li>
            </ul>
          </div>


        </div>
      </div>
    </div>
  );
};

export default PrinterManager;
