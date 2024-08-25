import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaRegCopy } from 'react-icons/fa';
import './Kontoangaben.scss';

const Kontoangaben = () => {
    const location = useLocation();
    const { auftragsnummer, kunde } = location.state || {};

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert(`"${text}" wurde kopiert!`);
    };

    const openPostFinanceQR = () => {
        window.open('https://www.postfinance.ch/de/support/services/tools-rechner/qr-generator.html#/', '_blank');
    };

    if (!auftragsnummer || !kunde) {
        return <p>Keine Auftragsdaten verfügbar.</p>;
    }

    return (
        <div className="kontoangaben-container">
            <h2>Kontoangaben</h2>

            <div className="kontoangaben-row">
                <span className="label">Auftragsnummer:</span>
                <span>{auftragsnummer}</span>
            </div>

            <div className="kontoangaben-row">
                <span className="label">IBAN:</span>
                <span>CH52 0844 0256 5100 2200 2</span>
                <button onClick={() => handleCopy('CH52 0844 0256 5100 2200 2')} className="copy-button">
                    <FaRegCopy />
                </button>
            </div>

            <div className="kontoangaben-row">
                <span className="label">Name oder Firma:</span>
                <span>TBs Solutions, Timo Blumer</span>
                <button onClick={() => handleCopy('TBs Solutions, Timo Blumer')} className="copy-button">
                    <FaRegCopy />
                </button>
            </div>

            <div className="kontoangaben-row">
                <span className="label">Land:</span>
                <span>Schweiz</span>
                <button onClick={() => handleCopy('Schweiz')} className="copy-button">
                    <FaRegCopy />
                </button>
            </div>

            <div className="kontoangaben-row">
                <span className="label">PLZ / Ort:</span>
                <span>4052 Basel</span>
                <button onClick={() => handleCopy('4052 Basel')} className="copy-button">
                    <FaRegCopy />
                </button>
            </div>

            <div className="kontoangaben-row">
                <span className="label">Strasse / Nummer:</span>
                <span>Aeschenplatz 3</span>
                <button onClick={() => handleCopy('Aeschenplatz 3')} className="copy-button">
                    <FaRegCopy />
                </button>
            </div>

            <div className="kontoangaben-row">
                <span className="label">Mitteilung:</span>
                <span>Rechnung {auftragsnummer}</span>
                <button onClick={() => handleCopy(`Rechnung ${auftragsnummer}`)} className="copy-button">
                    <FaRegCopy />
                </button>
            </div>

            <button onClick={openPostFinanceQR} className="qr-button">PostFinance QR Code Generator</button>
        </div>
    );
};

export default Kontoangaben;
