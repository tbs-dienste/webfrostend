import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Rechnung.scss';
import logoFoto from '../../logo.png';

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
          const kundenDaten = response.data.data;
          console.log(kundenDaten); // Füge dies hinzu, um die Daten in der Konsole zu überprüfen
          setArbeitszeit(kundenDaten.arbeitszeit);
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
    
        // Firmenlogo und Kopf
        doc.addImage(logoFoto, 'PNG', 20, 10, 50, 15); // Firmenlogo hinzufügen
        doc.setFontSize(10);
        doc.text('Adresse: Musterstraße 1, 12345 Musterstadt', 140, 15);
        doc.text('Telefon: 01234 567890', 140, 20);
        doc.text('E-Mail: tbs-digital-solutions@gmail.com', 140, 25);
    
        // Linien und Layout für den Kopfbereich
        doc.line(20, 35, 190, 35); // Horizontale Linie
        doc.setFontSize(12);
        doc.text(`Rechnungsnummer: ${id}`, 20, 45);
        doc.text(`Datum: ${new Date().toLocaleDateString()}`, 150, 45);
    
        // Kundenadresse
        doc.setFontSize(10);
        doc.text(`${kunde.vorname} ${kunde.nachname}`, 20, 65);
        doc.text(`${kunde.strasseHausnummer}`, 20, 70);
        doc.text(`${kunde.postleitzahl} ${kunde.ort}`, 20, 75);
    
        const anrede = kunde.geschlecht === 'männlich' ? 'Herr' : 'Frau';
        const begruessung = kunde.geschlecht === 'männlich' ? 'geehrter' : 'geehrte';
    
        doc.setFontSize(12);
        doc.text(`Sehr ${begruessung} ${anrede} ${kunde.nachname},`, 20, 90);
        doc.text('anbei erhalten Sie unsere Rechnung für die erbrachten Leistungen.', 20, 100);
        doc.text('Wir bitten um Überprüfung und fristgerechte Zahlung.', 20, 110);
    
        // Tabelle der Positionen
        let startY = 120;
    
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
                cellPadding: 3, // Slightly increase padding for better readability
                overflow: 'linebreak',
                halign: 'center',
                valign: 'middle',
                textColor: textColor // Set cell text color to black
            },
            headStyles: {
                fillColor: [41, 128, 185], // Unternehmensfarbe für die Kopfzeile
                textColor: [255, 255, 255]
            },
            margin: { horizontal: 10 },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.1,
            columnStyles: {
                0: { cellWidth: 10 }, // Nummernspalte schmaler machen
                2: { cellWidth: 15 }, // Anzahl schmaler machen
                3: { cellWidth: 25 }, // Preisspalte breiter machen
                4: { cellWidth: 25 }, // Total-Spalte breiter machen
            },
        });
    
        // Zahlungsinformationen und Footer
        const paymentInfoY = doc.lastAutoTable.finalY + 10;
    
        doc.setFontSize(10);
        doc.text('Bitte überweisen Sie den Gesamtbetrag innerhalb von 14 Tagen.', 20, paymentInfoY + 10);
        doc.text('Mit freundlichen Grüßen,', 20, paymentInfoY + 30);
        doc.text('TBs Solutions', 20, paymentInfoY + 40);
        doc.text('Mitarbeiter: [Name des Mitarbeiters]', 20, paymentInfoY + 50);
    
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
