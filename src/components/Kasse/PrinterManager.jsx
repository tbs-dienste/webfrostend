import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './PrinterManager.scss';

const PrinterManager = () => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inkLevels, setInkLevels] = useState(null);
  const [inkLoading, setInkLoading] = useState(false);

  useEffect(() => {
    fetchPrinters();
  }, []);

  const fetchInkLevels = useCallback(async () => {
    setInkLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/printer/check-ink', {
        headers: { Authorization: `Bearer ${token}` },
        params: { printerName: selectedPrinter },
      });
      setInkLevels(res.data.inkLevels);
    } catch (err) {
      console.error('Fehler beim Abrufen der Tintenfüllstände:', err);
    } finally {
      setInkLoading(false);
    }
  }, [selectedPrinter]);

  useEffect(() => {
    if (selectedPrinter) fetchInkLevels();
  }, [selectedPrinter, fetchInkLevels]);

  const fetchPrinters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/printer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrinters(res.data.printers);
      setSelectedPrinter(res.data.selectedPrinter);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrinter = async (printerName) => {
    setLoading(true);
    try {
      await axios.post('/api/printer/setPrinter', { printerName });
      setSelectedPrinter(printerName);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPrint = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/printer/testPrint', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Testdruck.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInkColor = (color) => {
    switch (color.toLowerCase()) {
      case 'schwarz': return '#000000';
      case 'gelb': return '#FFEB3B';
      case 'blau': return '#2196F3';
      case 'pink': return '#E91E63';
      default: return '#e0e0e0';
    }
  };

  return (
    <div className="printer-manager-container">
      <div className="status-window">
        <div className="status-header">
          <div className="epson-logo">EPSON</div>
          <div className="printer-model">C82 Series (USB)</div>
        </div>

        <div className="status-title">Verbleibender Tintenstand</div>

        <div className="ink-levels-container">
          {inkLevels ? (
            Object.entries(inkLevels).map(([color, level], index) => (
              <div className="ink-cartridge" key={index}>
                <div className="ink-label">{color.toUpperCase()}</div>
                <div className="ink-bar">
                  <div
                    className="ink-fill"
                    style={{
                      height: level,
                      backgroundColor: getInkColor(color)
                    }}
                  />
                </div>
                <div className="ink-percentage">{level}</div>
              </div>
            ))
          ) : (
            <div className="no-ink-data">Tintenstand nicht geladen</div>
          )}
        </div>


        <div className="status-footer">
          <button onClick={fetchPrinters}>Aktualisieren</button>
          <button onClick={handleTestPrint} disabled={!selectedPrinter || loading}>Testdruck</button>
        </div>
      </div>
    </div>
  );
};

export default PrinterManager;
