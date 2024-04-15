import React from 'react';
import pdfA4 from './Flyer_A4.pdf';

const Flyer = () => {
  const pdfArray = [
    { id: 1, url: pdfA4 },
    // Weitere PDF-Dateien hier hinzufügen, falls nötig
  ];

  return (
    <div>
      <h1>Meine Flyer Vorschau</h1>
      <div>
        {pdfArray.map((pdf, index) => (
          <div key={index}>
            <object data={pdf.url} type="application/pdf" width="300" height="200">
              <p>Das PDF kann nicht angezeigt werden. Du kannst es jedoch herunterladen:</p>
              <a href={pdf.url} download={`flyer_${index + 1}.pdf`}>PDF herunterladen</a>
            </object>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flyer;
