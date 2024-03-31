import React, { useState } from 'react';
import QrReader from 'react-qr-reader';

const KundenScanner = () => {
  const [error, setError] = useState(null);

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
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
        {error && <p>{error.message}</p>}
      </div>
    </div>
  );
};

export default KundenScanner;
