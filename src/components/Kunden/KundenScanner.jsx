import React, { useState, useEffect, useRef } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';

const KundenScanner = () => {
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserBarcodeReader();
    startScan();
    return () => {
      stopScan();
    };
  }, []);

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
      window.location.href = `/kunden/${data}`;
    }
  };

  return (
    <div className="kunde-scannen">
      <div className="qr-scanner">
        <video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
        <p>{error && error.message}</p>
      </div>
    </div>
  );
};

export default KundenScanner;
