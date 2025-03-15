import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './PrinterManager.scss';
import Sidebar from './Sidebar';

const PrinterManager = ({ onKassenModusChange }) => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inkLevels, setInkLevels] = useState(null);
  const [inkLoading, setInkLoading] = useState(false);

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

  const handleTestPrint = async () => {
    if (!selectedPrinter) return alert('Kein Drucker ausgewählt!');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/printer/testPrint',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { printerName: selectedPrinter },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Testdruck.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Fehler beim Testdruck:', err);
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


        <h2>Druckerverwaltung</h2>

        <div className="printer-selection">
          <label htmlFor="printer-select">Drucker auswählen:</label>
          <select
            id="printer-select"
            value={selectedPrinter || ''}
            onChange={(e) => handleSetPrinter(e.target.value)}
            disabled={loading}
          >
            {printers.map((printer, index) => (
              <option key={index} value={printer}>
                {printer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="status-window">
          <div className="status-header">
            <div className="epson-logo">EPSON</div>
            <div className="printer-model">{selectedPrinter || 'Kein Drucker ausgewählt'}</div>
          </div>

          <div className="status-title">Tintenfüllstände</div>

          <div className="ink-levels-container">
            {inkLoading ? (
              <div className="loading">Lade...</div>
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
                </div>
              ))
            ) : (
              <div className="no-ink-data">Keine Daten verfügbar</div>
            )}
          </div>

          <div className="status-footer">
            <button onClick={fetchPrinters} disabled={loading}>
              Aktualisieren
            </button>
            <button onClick={handleTestPrint} disabled={!selectedPrinter || loading}>
              Testdruck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterManager;
