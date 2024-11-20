import React from 'react';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import Arbeitsvertrag from './Arbeitsvertrag.docx'; // Ersetze dies mit dem tatsächlichen Pfad
import Unternehmensrichtlinien from './Unternehmensrichtlinien.pdf'; // Ersetze dies mit dem tatsächlichen Pfad
import Datenschutzrichtlinien from './Datenschutzrichtlinien.pdf'; // Ersetze dies mit dem tatsächlichen Pfad

import "./Download.scss";

function Download() {
  const documents = [
    { name: 'Arbeitsvertrag', url: Arbeitsvertrag, icon: <FaFileWord />, type: 'Word', description: 'Offizieller Arbeitsvertrag zur Ansicht.' },
    { name: 'Unternehmensrichtlinien', url: Unternehmensrichtlinien, icon: <FaFilePdf />, type: 'PDF', description: 'Hier sind unsere Unternehmensrichtlinien.' },
    { name: 'Datenschutzrichtlinien', url: Datenschutzrichtlinien, icon: <FaFilePdf />, type: 'PDF', description: 'Hier sind unsere Datenschutzrichtlinien.' }
  ];

  const handleDownload = (url, fileName) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Dateidownload fehlgeschlagen!');
        }
      })
      .then((blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        alert('Fehler beim Herunterladen der Datei!');
      });
  };

  return (
    <div className="document-download">
      <h2 className="document-download__title">Wichtige Dokumente herunterladen</h2>
      <p className="document-download__subtitle">Unten finden Sie eine Auswahl wichtiger Dokumente zum Herunterladen. Bitte überprüfen Sie diese und speichern Sie sie für zukünftige Referenz.</p>
      <div className="document-download__buttons">
        {documents.map((doc, index) => (
          <div key={index} className="document-download__item">
            <button className="document-download__button" onClick={() => handleDownload(doc.url, doc.name)}>
              {doc.icon} <span className="document-download__button-text">Download {doc.name}</span>
            </button>
            <p className="document-download__description">Typ: {doc.type} | {doc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Download;
