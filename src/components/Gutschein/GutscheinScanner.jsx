import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader, Code128Reader, Exception } from '@zxing/library';
import './GutscheinScanner.scss';
import transparentBarcodePatternImage from './transparent-barcode-pattern.png';

const GutscheinScanner = () => {
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const reader = new BrowserMultiFormatReader();

  const handleScan = (result) => {
    if (result) {
      setScanResult(result);
      alert(`Barcode erfolgreich gescannt: ${result.getText()}`);
    }
  };

  const handleError = (err) => {
    setError(new Error('Scan error: ' + err.message));
  };

  const startScanner = () => {
    try {
      reader.decodeFromVideoElement(videoRef.current, (result, error) => {
        if (result) {
          handleScan(result);
        } else if (error && error instanceof Exception) {
          handleError(error);
        }
      });
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="gutscheine-scanner-container">
      <div className="qr-scanner">
        <video ref={videoRef} width="100%" height="100%" autoPlay></video>
        {/* Overlay mit dem transparenten Muster-Barcode */}
        <img src={transparentBarcodePatternImage} alt="Transparent Barcode Pattern" className="transparent-barcode-pattern" />
        {error && <p className="error-message">{error.message}</p>}
        {scanResult && <p className="scan-result">Barcode: {scanResult.getText()}</p>}
      </div>
    </div>
  );
};

export default GutscheinScanner;
