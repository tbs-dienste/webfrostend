import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import './PdfMerger.scss';

function PdfMerger() {
  const [files, setFiles] = useState([null, null]);

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (!files[0] || !files[1]) {
      alert('Bitte lade beide PDFs hoch.');
      return;
    }

    try {
      // Erstelle ein neues PDF-Dokument
      const mergedPdf = await PDFDocument.create();

      // Füge die PDFs hinzu
      for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [firstPage] = await mergedPdf.copyPages(pdfDoc, [0]);
        mergedPdf.addPage(firstPage);
      }

      // Speichere das neue PDF
      const mergedPdfBytes = await mergedPdf.save();
      saveAs(new Blob([mergedPdfBytes], { type: 'application/pdf' }), 'merged.pdf');
    } catch (error) {
      console.error('Fehler beim Zusammenführen der PDFs:', error);
    }
  };

  return (
    <div className="pdf-merger-container">
      <h2>PDFs zusammenführen</h2>
      
      <div className="upload-section">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, 0)}
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, 1)}
        />
      </div>
      
      <button onClick={mergePdfs} className="merge-button">
        PDFs zusammenführen
      </button>
    </div>
  );
}

export default PdfMerger;
