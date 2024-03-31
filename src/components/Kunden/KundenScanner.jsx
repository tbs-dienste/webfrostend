import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader'; // Beachten Sie die Änderung hier

const KundenScanner = () => {
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startScan = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          setError(err);
        });
    } else {
      setError(new Error('Die Kamera wird von diesem Browser nicht unterstützt.'));
    }
  };

  const stopScan = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => {
      track.stop();
    });

    videoRef.current.srcObject = null;
  };

  const handleScan = (data) => {
    if (data) {
      // Navigiere zur Kunden-Detailseite mit der Kunden-ID aus dem Barcode
      window.location.href = `/kunden/${data}`;
    }
  };

  const handleError = (err) => {
    setError(err);
  };

  return (
    <div className="kunde-scannen">
      <div className="qr-scanner">
        <video ref={videoRef} autoPlay style={{ width: '100%' }}></video>
        <button onClick={startScan}>Start Scan</button>
        <button onClick={stopScan}>Stop Scan</button>
        <p>{error && error.message}</p>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ display: 'none' }} // Hide the QR reader component
        />
      </div>
    </div>
  );
};

export default KundenScanner;
