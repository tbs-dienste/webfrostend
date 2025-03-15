import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Card, CardContent, Typography, Box } from '@mui/material';
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


  // Move fetchInkLevels above the useEffect
  const fetchInkLevels = useCallback(async () => {
    setInkLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/printer/check-ink', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          printerName: selectedPrinter,
        },
      });
      setInkLevels(res.data.inkLevels);
    } catch (err) {
      console.error('Fehler beim Abrufen der Tintenfüllstände:', err);
    } finally {
      setInkLoading(false);
    }
  }, [selectedPrinter]);


  useEffect(() => {
    if (selectedPrinter) {
      fetchInkLevels();
    }
  }, [selectedPrinter, fetchInkLevels]); // Add fetchInkLevels here
  

  const fetchPrinters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/printer', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleCheckInk = async () => {
    if (selectedPrinter) {
      fetchInkLevels();
    }
  };

  const getInkColor = (color) => {
    switch (color.toLowerCase()) {
      case 'schwarz':
        return '#000000'; // Black
      case 'gelb':
        return '#FFEB3B'; // Yellow
      case 'blau':
        return '#2196F3'; // Blue
      case 'pink':
        return '#E91E63'; // Pink
      default:
        return '#e0e0e0'; // Default gray
    }
  };

  return (
    <div className="printer-manager-container">
      <Card sx={{ maxWidth: 600, margin: 'auto', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Druckerverwaltung
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Verwalten Sie Ihre verbundenen Drucker und führen Sie Testdrucke aus.
          </Typography>

          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" color="primary" onClick={fetchPrinters}>
              Aktualisieren
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box mb={2}>
              {printers.length === 0 && <Typography variant="body2" color="error">Keine Drucker gefunden.</Typography>}
              {printers.map((printer) => (
                <Card
                  key={printer.name}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 2,
                    marginBottom: 1,
                    border: printer.name === selectedPrinter ? '2px solid #4f46e5' : '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: printer.name === selectedPrinter ? '#f3f4f6' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                  }}
                  onClick={() => handleSetPrinter(printer.name)}
                >
                  <Typography variant="h6">{printer.name}</Typography>
                  <Typography variant="body2" color={printer.status.toLowerCase() === 'connected' ? 'success.main' : 'error.main'}>
                    {printer.status}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleTestPrint}
              disabled={!selectedPrinter || loading}
            >
              Testdruck
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCheckInk}
              disabled={!selectedPrinter || inkLoading}
            >
              {inkLoading ? 'Prüfen...' : 'Tintenstand prüfen'}
            </Button>
          </Box>

          {inkLevels && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Tintenfüllstände:
              </Typography>
              {Object.entries(inkLevels).map(([color, level]) => (
                <Box key={color} mb={2} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body2" sx={{ width: 100 }}>
                    {color.toUpperCase()}
                  </Typography>
                  <Box sx={{ height: 300, width: 25, backgroundColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        height: `${level}%`,
                        width: '100%',
                        backgroundColor: getInkColor(color),
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </Box>
                  <Typography variant="body2">{level}%</Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrinterManager;
