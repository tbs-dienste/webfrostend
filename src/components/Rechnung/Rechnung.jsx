import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Rechnung.scss';

const Rechnung = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Verwende useNavigate Hook
    const [arbeitszeit, setArbeitszeit] = useState(0);
    const [message, setMessage] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [preis, setPreis] = useState(0);
    const [kunde, setKunde] = useState({});
    const [rabattCode, setRabattCode] = useState('');
    const [rabatt, setRabatt] = useState(0);
    const [rabattBetrag, setRabattBetrag] = useState(0);
    const [positionen, setPositionen] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [optionen, setOptionen] = useState([]); // Zustand für die Optionen

    useEffect(() => {
        fetchKundenDaten();
        fetchDienstleistungen();
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

    const fetchDienstleistungen = async () => {
        try {
            const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
            const dienstleistungen = response.data.data;
            setOptionen(dienstleistungen.map(dienstleistung => dienstleistung.title));
        } catch (error) {
            console.error("Fehler beim Abrufen der Dienstleistungen:", error);
            setMessage('Fehler beim Abrufen der Dienstleistungen.');
        }
    };

    const handleBeschreibungChange = (event) => {
        setBeschreibung(event.target.value);
    };

    const handlePreisChange = (event) => {
        setPreis(parseFloat(event.target.value));
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
        return positionen.reduce((acc, pos) => acc + pos.arbeitszeit * pos.preis, 0);
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

    const addPosition = () => {
        const newPosition = {
            beschreibung,
            arbeitszeit: Math.round(arbeitszeit), // Rundet die Arbeitszeit auf die nächste ganze Zahl
            preis
        };
        if (editIndex !== null) {
            const updatedPositionen = [...positionen];
            updatedPositionen[editIndex] = newPosition;
            setPositionen(updatedPositionen);
            setEditIndex(null);
        } else {
            setPositionen([...positionen, newPosition]);
        }
        setBeschreibung('');
        setArbeitszeit(0);
        setPreis(0);
    };

    const editPosition = (index) => {
        const position = positionen[index];
        setBeschreibung(position.beschreibung);
        setArbeitszeit(position.arbeitszeit);
        setPreis(position.preis);
        setEditIndex(index);
    };

    const deletePosition = (index) => {
        setPositionen(positionen.filter((_, i) => i !== index));
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const total = calculateTotal();
        const discountedTotal = calculateDiscountedTotal();
    
        const textColor = 0; // Black
    
        doc.setFontSize(12);
        doc.setTextColor(textColor); // Set text color to black
    
        // Firmenkopf
        doc.text('TBs Solutions', 20, 20);
        doc.text('Adresse: Musterstraße 1, 12345 Musterstadt', 20, 30);
        doc.text('Telefon: 01234 567890', 20, 40);
        doc.text('E-Mail: tbs-digital-solutions@gmail.com', 20, 50);
        
        // Rechnungsinformationen
        doc.text(`Rechnungsnummer: ${id}`, 150, 20);
        doc.text(`Datum: ${new Date().toLocaleDateString()}`, 150, 30);
    
        // Kundenadresse
        doc.text('Rechnung an:', 20, 70);
        doc.text(`${kunde.vorname} ${kunde.nachname}`, 20, 80);
        doc.text(`${kunde.strasseHausnummer}`, 20, 90);
        doc.text(`${kunde.postleitzahl} ${kunde.ort}`, 20, 100);
    
        const anrede = kunde.geschlecht === 'männlich' ? 'Herr' : 'Frau';
        const begruessung = kunde.geschlecht === 'männlich' ? 'geehrter' : 'geehrte';
    
        doc.text(`Sehr ${begruessung} ${anrede} ${kunde.nachname},`, 20, 120);
        doc.text('anbei erhalten Sie unsere Rechnung für die erbrachten Leistungen.', 20, 130);
        doc.text('Wir bitten um Überprüfung und fristgerechte Zahlung.', 20, 140);
    
        // Tabelle der Positionen
        let startY = 160;
    
        const tableData = positionen.map((pos, index) => [
            index + 1, pos.beschreibung, `${Math.round(pos.arbeitszeit)}`, `${pos.preis.toFixed(2)} CHF`, `${(pos.arbeitszeit * pos.preis).toFixed(2)} CHF`
        ]);
    
        const totalsData = [
            ['', '', '', 'Rabatt', `${rabattBetrag.toFixed(2)} CHF`],
            ['', '', '', 'Gesamtbetrag nach Rabatt', `${discountedTotal.toFixed(2)} CHF`],
        ];
    
        const allData = [...tableData, ...totalsData];
    
        doc.autoTable({
            startY,
            head: [['Nr.', 'Beschreibung', 'Anzahl', 'Preis', 'Total']],
            body: allData,
            styles: {
                fontSize: 10,
                cellPadding: 2, // Decrease padding
                overflow: 'linebreak',
                halign: 'center',
                valign: 'middle',
                textColor: textColor // Set cell text color to black
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255]
            },
            margin: { horizontal: 10 },
        });
    
        // Zahlungsinformationen
        const paymentInfoY = doc.lastAutoTable.finalY + 10;
        doc.text('Zahlungsinformationen:', 20, paymentInfoY);
        doc.text('Bankverbindung: Musterbank', 20, paymentInfoY + 10);
        doc.text('IBAN: DE12345678901234567890', 20, paymentInfoY + 20);
        doc.text('BIC: BANKDEFFXXX', 20, paymentInfoY + 30);
        doc.text('Verwendungszweck: Rechnungsnummer ' + id, 20, paymentInfoY + 40);
    
        doc.text('Bitte überweisen Sie den Gesamtbetrag innerhalb von 14 Tagen.', 20, paymentInfoY + 50);
    
        doc.text('Mit freundlichen Grüßen,', 20, paymentInfoY + 80);
        doc.text('TBs Solutions', 20, paymentInfoY + 90);
        doc.text('Mitarbeiter: [Name des Mitarbeiters]', 20, paymentInfoY + 100);
    
        doc.save('Rechnung.pdf');
    
        navigate('/kontoangaben', { state: { auftragsnummer: id, kunde: kunde } });
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
                <label htmlFor="arbeitszeit-input">Arbeitszeit (Stunden):</label>
                <input id="arbeitszeit-input" type="number" value={arbeitszeit} onChange={(e) => setArbeitszeit(Math.round(parseFloat(e.target.value)))} />
                <label htmlFor="preis-input">Preis pro Stunde (CHF):</label>
                <input id="preis-input" type="number" step="0.01" value={preis} onChange={handlePreisChange} />
                <button onClick={addPosition}>{editIndex !== null ? 'Position aktualisieren' : 'Position hinzufügen'}</button>
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
                            <th>Anzahl</th>
                            <th>Preis</th>
                            <th>Total</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positionen.map((pos, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{pos.beschreibung}</td>
                                <td>{Math.round(pos.arbeitszeit)}</td>
                                <td>{pos.preis.toFixed(2)} CHF</td>
                                <td>{(pos.arbeitszeit * pos.preis).toFixed(2)} CHF</td>
                                <td>
                                    <button onClick={() => editPosition(index)}>Bearbeiten</button>
                                    <button onClick={() => deletePosition(index)}>Löschen</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={generatePDF}>PDF generieren</button>
            </div>
        </div>
    );
};

export default Rechnung;
