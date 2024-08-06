// src/components/DownloadButton.jsx
import React from 'react';
import './Infos.scss'; // Importiere die SCSS-Datei
import pdfFile from './betriebsordnung.pdf'; // Importiere die PDF-Datei

const Infos = () => {
  const handleDownload = () => {
    // PDF-Datei als Blob erstellen
    fetch(pdfFile)
      .then(response => response.blob())
      .then(blob => {
        // Erstellen eines URL-Objekts aus dem Blob
        const url = window.URL.createObjectURL(blob);
        // Erstellen eines temporären Links und Klicken darauf
        const a = document.createElement('a');
        a.href = url;
        a.download = 'betriebsordnung.pdf'; // Name der heruntergeladenen Datei
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Fehler beim Herunterladen des PDFs:', error));
  };

  return (
    <div className="download-container">
      <button className="download-button" onClick={handleDownload}>
        Betriebsordnung herunterladen
      </button>
    </div>
  );
};

export default Infos;
