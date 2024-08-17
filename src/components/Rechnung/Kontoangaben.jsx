import React from 'react';
import { FaRegCopy } from 'react-icons/fa';
import './Kontoangaben.scss';

function Kontoangaben() {
  const kontoDaten = {
    iban: 'CH52 0844 0256 5100 2200 2',
    nameOrFirma: 'TBs Solutions, Timo Blumer',
    land: 'Schweiz',
    plz: '4052',
    ort: 'Basel',
    strasse: 'Aeschenplatz',
    nummer: '3',
    kundennummer: '987654321', // Kundennummer/Auftragsnummer
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`"${text}" wurde kopiert!`);
  };

  const openPostFinanceQR = () => {
    window.open('https://www.postfinance.ch/de/support/services/tools-rechner/qr-generator.html#/', '_blank');
  };

  return (
    <div className="kontoangaben-container">
      <h2>Kontoangaben</h2>

      <div className="kontoangaben-row">
        <span className="label">IBAN:</span>
        <span>{kontoDaten.iban}</span>
        <button onClick={() => handleCopy(kontoDaten.iban)} className="copy-button">
          <FaRegCopy />
        </button>
      </div>

      <div className="kontoangaben-row">
        <span className="label">Name oder Firma:</span>
        <span>{kontoDaten.nameOrFirma}</span>
        <button onClick={() => handleCopy(kontoDaten.nameOrFirma)} className="copy-button">
          <FaRegCopy />
        </button>
      </div>

      <div className="kontoangaben-row">
        <span className="label">Land:</span>
        <span>{kontoDaten.land}</span>
        <button onClick={() => handleCopy(kontoDaten.land)} className="copy-button">
          <FaRegCopy />
        </button>
      </div>

      <div className="kontoangaben-row">
        <span className="label">PLZ / Ort:</span>
        <span>{kontoDaten.plz} {kontoDaten.ort}</span>
        <button onClick={() => handleCopy(`${kontoDaten.plz} ${kontoDaten.ort}`)} className="copy-button">
          <FaRegCopy />
        </button>
      </div>

    

      <div className="kontoangaben-row">
        <span className="label">Strasse / Nummer:</span>
        <span>{kontoDaten.strasse} {kontoDaten.nummer}</span>
        <button onClick={() => handleCopy(`${kontoDaten.strasse} ${kontoDaten.nummer}`)} className="copy-button">
          <FaRegCopy />
        </button>
      </div>

      <div className="kontoangaben-row">
        <span className="label">Mitteilung:</span>
        <span>Rechnung {kontoDaten.kundennummer}</span>
        <button onClick={() => handleCopy(`Rechnung ${kontoDaten.kundennummer}`)} className="copy-button">
          <FaRegCopy />
        </button>
      </div>

      <button onClick={openPostFinanceQR} className="qr-button">PostFinance QR Code Generator</button>
    </div>
  );
}

export default Kontoangaben;
