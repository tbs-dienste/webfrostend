import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Rechnung.scss'; // Importieren Sie das SCSS-Stylesheet

const Rechnung = () => {
    const { id } = useParams();
    const [arbeitszeit, setArbeitszeit] = useState(0); // Initialisierung von 'arbeitszeit'
    const [message, setMessage] = useState(''); // Initialisierung von 'message'
    const [beschreibung, setBeschreibung] = useState(''); // Initialisierung von 'beschreibung'
    const [preis, setPreis] = useState(0); // Initialisierung von 'preis'
    const [kunde, setKunde] = useState({}); // Initialisierung von 'kunde'

    const optionen = [
        "Website Erstellen",
        "Diashow Erstellen",
        "Gaming PC Zusammenstellung",
        "Musik und Sounddesign"
    ];

    useEffect(() => {
        fetchKundenDaten();
    }, [id]);

    const fetchKundenDaten = async () => {
        try {
            const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
            const kundenDaten = response.data.data[0];
            setArbeitszeit(kundenDaten.arbeitszeit);
            setPreis(kundenDaten.stundensatzvorschlag || 0);
            setKunde(kundenDaten);
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
            setMessage('Fehler beim Abrufen der Daten.');
        }
    };

    const handleBeschreibungChange = (event) => {
        setBeschreibung(event.target.value);
    };

    const handlePreisChange = (event) => {
        setPreis(event.target.value);
    };

    const calculateTotal = () => {
        return arbeitszeit * preis;
    };

    const calculateMwSt = (total) => {
        const mwstRate = 0.19; // 19% MwSt
        return total * mwstRate;
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const total = calculateTotal();
        const mwst = calculateMwSt(total);
        const totalWithMwSt = total + mwst;

        // Header information
        doc.setFontSize(12);
        doc.text('TBs Solutions', 20, 20);
        doc.text('Kontakt: tbs-digital-solutions@gmail.com', 20, 30);

        doc.text(`Rechnungsnummer: ${id}`, 140, 20);
        doc.text(`Datum: ${new Date().toLocaleDateString()}`, 140, 30);

        doc.text('Rechnung an:', 20, 50);
        doc.text(`${kunde.vorname} ${kunde.nachname}`, 20, 60);
        doc.text(`${kunde.strasseHausnummer}`, 20, 65);
        doc.text(`${kunde.postleitzahl} ${kunde.ort}`, 20, 70);

        // Table with all details
        doc.autoTable({
            startY: 90,
            head: [['Position', 'Beschreibung', 'Arbeitszeit', 'Preis']],
            body: [
                ['1', beschreibung, `${arbeitszeit} Stunden`, `${preis} CHF`],
            ],
            foot: [
                ['', '', 'Zwischensumme', `${total.toFixed(2)} CHF`],
                ['', '', 'MwSt (19%)', `${mwst.toFixed(2)} CHF`],
                ['', '', 'Gesamt inkl. MwSt', `${totalWithMwSt.toFixed(2)} CHF`],
            ],
            styles: {
                fontSize: 10,
                cellPadding: 5,
                overflow: 'linebreak',
                halign: 'center',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontSize: 11,
            },
            footStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0],
                fontSize: 11,
                fontStyle: ''
            }
        });

        // Additional text below the table
        const finalY = doc.lastAutoTable.finalY;

        doc.text('Bankverbindung:', 20, finalY + 20);
        doc.text('IBAN: DE12345678901234567890', 20, finalY + 30);
        doc.text('BIC: ABCDEF1X2Y3', 20, finalY + 40);

        doc.text('Zahlungsbedingungen:', 20, finalY + 60);
        doc.text('Bitte überweisen Sie den Betrag innerhalb von 14 Tagen auf das oben genannte Konto.', 20, finalY + 70);

        doc.text('Vielen Dank für Ihren Auftrag!', 20, finalY + 90);

        doc.save('Rechnung.pdf');
    };

    return (
        <div className="time-tracker">
            <h2>Rechnung</h2>
            {message && <p className="error-message">{message}</p>}
            <div className="work-time">
                <label htmlFor="beschreibung-dropdown">Beschreibung auswählen:</label>
                <select id="beschreibung-dropdown" value={beschreibung} onChange={handleBeschreibungChange}>
                    <option value="" disabled>Bitte wählen</option>
                    {optionen.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                <label htmlFor="preis-input">Preis pro Stunde:</label>
                <input
                    type="number"
                    id="preis-input"
                    value={preis}
                    onChange={handlePreisChange}
                    min="0"
                />
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Beschreibung</th>
                            <th>Arbeitszeit</th>
                            <th>Preis</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>{beschreibung}</td>
                            <td>{arbeitszeit} Stunden</td>
                            <td>{preis} CHF</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={generatePDF}>PDF generieren</button>
            </div>
        </div>
    );
};

export default Rechnung;
