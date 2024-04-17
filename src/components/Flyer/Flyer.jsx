import React from 'react';
import pdfA4 from './Flyer_A4.pdf';
import './Flyer.scss'; // Importieren Sie das SCSS-Styling

const Flyer = () => {
  const pdfArray = [
    { id: 1, url: pdfA4 },
    // Weitere PDF-Dateien hier hinzufügen, falls nötig
  ];

  return (
    <div className="flyer-container">
      <h1 className="flyer-title">Meine Flyer Vorschau</h1>
      <div className="pdf-list">
        {pdfArray.map((pdf, index) => (
          <div key={index} className="pdf-item">
            <object data={pdf.url} type="application/pdf" width="300" height="200">
              <p className="pdf-error">Das PDF kann nicht angezeigt werden. Du kannst es jedoch herunterladen:</p>
              <a href={pdf.url} download={`flyer_${index + 1}.pdf`} className="pdf-download">PDF herunterladen</a>
            </object>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flyer;
