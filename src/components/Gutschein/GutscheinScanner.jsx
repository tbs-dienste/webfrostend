import React, { useState, useEffect, useRef } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';
import './GutscheinScanner.scss';

// Importiere das transparente Bild für den Muster-Barcode
import transparentBarcodePatternImage from './transparent-barcode-pattern.png';

const GutscheinScanner = () => {
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  const startScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
        if (result) {
          handleScan(result.getText());
        } else {
          setError(error);
        }
      });
    } catch (err) {
      setError(new Error('Die Kamera wird von diesem Browser nicht unterstützt.'));
    }
  };

  const stopScan = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  const handleScan = (data) => {
    if (data) {
      // Navigiere zur Kunden-Detailseite mit der Kunden-ID aus dem Barcode
      window.location.href = `/gutscheine/${data}`;
    }
  };

  useEffect(() => {
    codeReader.current = new BrowserBarcodeReader();
    startScan();
    return () => {
      stopScan();
    };
  }, []);

  return (
    <div className="gutscheine-scanner-container">
      <div className="qr-scanner">
        <video ref={videoRef} autoPlay className="video-element"></video>
        {/* Overlay mit dem transparenten Muster-Barcode */}
        <img src={transparentBarcodePatternImage} alt="Transparent Barcode Pattern" className="transparent-barcode-pattern" />
        {error && <p className="error-message">{error.message}</p>}
      </div>
    </div>
  );
};

export default GutscheinScanner;
