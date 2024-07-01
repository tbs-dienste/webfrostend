import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Rechnung.scss'; // Importieren Sie das SCSS-Stylesheet

const Rechnung = () => {
    const { id } = useParams();
    const [arbeitszeit, setArbeitszeit] = useState(0);
    const [message, setMessage] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [preis, setPreis] = useState(0);
    const [kunde, setKunde] = useState({});
    const [rabattCode, setRabattCode] = useState('');
    const [rabatt, setRabatt] = useState(0);
    const [rabattBetrag, setRabattBetrag] = useState(0);

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

    const handleRabattCodeChange = (event) => {
        setRabattCode(event.target.value);
    };

    const applyDiscount = async () => {
        try {
            const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine');
            const gutscheine = response.data.data;
            const gutscheincodeObj = gutscheine.find(gutschein => gutschein.gutscheincode === rabattCode && gutschein.gutscheinaktiviert);

            if (gutscheincodeObj) {
                const gueltigBis = new Date(gutscheincodeObj.gueltigBis);
                if (gueltigBis > new Date()) {
                    setRabatt(parseFloat(gutscheincodeObj.gutscheinrabatt));
                    setMessage(`Rabatt von ${parseFloat(gutscheincodeObj.gutscheinrabatt) * 100}% angewendet.`);
                } else {
                    setRabatt(0);
                    setMessage('Rabattcode ist abgelaufen.');
                }
            } else {
                setRabatt(0);
                setMessage('Ungültiger Rabattcode.');
            }
        } catch (error) {
            console.error("Fehler beim Überprüfen des Rabattcodes:", error);
            setMessage('Fehler beim Überprüfen des Rabattcodes.');
        }
    };

    const calculateTotal = () => {
        return arbeitszeit * preis;
    };

    const calculateDiscountedTotal = () => {
        const total = calculateTotal();
        const discountAmount = total * rabatt;
        setRabattBetrag(discountAmount);
        return total - discountAmount;
    };

    const calculateMwSt = (total) => {
        const mwstRate = 0.19; // 19% MwSt
        return total * mwstRate;
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const total = calculateTotal();
        const discountedTotal = calculateDiscountedTotal();
        const mwst = calculateMwSt(discountedTotal);
        const totalWithMwSt = discountedTotal + mwst;

        const textColor = 0; // Schwarz

        doc.setFontSize(12);
        doc.setTextColor(textColor); // Setzt die Textfarbe auf Schwarz
        doc.text('TBs Solutions', 20, 20);
        doc.text('Kontakt: tbs-digital-solutions@gmail.com', 20, 30);

        doc.text(`Rechnungsnummer: ${id}`, 140, 20);
        doc.text(`Datum: ${new Date().toLocaleDateString()}`, 140, 30);

        doc.text('Rechnung an:', 20, 50);
        doc.text(`${kunde.vorname} ${kunde.nachname}`, 20, 60);
        doc.text(`${kunde.strasseHausnummer}`, 20, 65);
        doc.text(`${kunde.postleitzahl} ${kunde.ort}`, 20, 70);

        doc.autoTable({
            startY: 90,
            head: [['Position', 'Beschreibung', 'Arbeitszeit', 'Preis']],
            body: [
                ['1', beschreibung, `${arbeitszeit} Stunden`, `${preis} €`],
            ],
            foot: [
                ['', '', 'Zwischensumme', `${total.toFixed(2)} €`],
                ['', '', 'Rabatt', `${rabattBetrag.toFixed(2)} €`],
                ['', '', 'Zwischensumme nach Rabatt', `${discountedTotal.toFixed(2)} €`],
                ['', '', 'MwSt (19%)', `${mwst.toFixed(2)} €`],
                ['', '', 'Gesamt inkl. MwSt', `${totalWithMwSt.toFixed(2)} €`],
            ],
            styles: {
                fontSize: 10,
                cellPadding: 2, // Verringern Sie den Innenabstand
                overflow: 'linebreak',
                halign: 'center',
                valign: 'middle',
                textColor: textColor // Setzt die Textfarbe in den Zellen auf Schwarz
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255], // Weißer Text im Header
                fontSize: 11,
            },
            footStyles: {
                fillColor: [245, 245, 245],
                textColor: textColor,
                fontSize: 11,
                fontStyle: ''
            }
        });

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
                <label htmlFor="rabatt-input">Rabattcode:</label>
                <input
                    type="text"
                    id="rabatt-input"
                    value={rabattCode}
                    onChange={handleRabattCodeChange}
                />
                <button onClick={applyDiscount}>Rabatt anwenden</button>
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
                            <td>{preis} €</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={generatePDF}>PDF generieren</button>
            </div>
        </div>
    );
};

export default Rechnung;
