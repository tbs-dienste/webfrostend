import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RechnungForm.scss';

const RechnungForm = () => {
    const [kundenSuche, setKundenSuche] = useState('');
    const [kundenId, setKundenId] = useState('');
    const [kunden, setKunden] = useState([]); // State for customers
    const [kundenVorschlaege, setKundenVorschlaege] = useState([]);
    const [benutzerdefinierteDienstleistungen, setBenutzerdefinierteDienstleistungen] = useState([]);
    const [message, setMessage] = useState('');
    const [mehrwertsteuerStatus, setMehrwertsteuerStatus] = useState('inkl'); // Default: inkl.

    // Fetch all customers
    const fetchKunden = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKunden(response.data.data); // Set customers
        } catch (error) {
            console.error('Fehler beim Abrufen der Kunden:', error);
        }
    };

    // Filter customer suggestions based on search input
    const fetchKundenVorschlaege = () => {
        if (kundenSuche.length > 2) {
            const filteredKunden = kunden.filter((kunde) =>
                `${kunde.vorname} ${kunde.nachname}`.toLowerCase().includes(kundenSuche.toLowerCase())
            );
            setKundenVorschlaege(filteredKunden);
        } else {
            setKundenVorschlaege([]);
        }
    };

    // Add custom service
    const handleAddBenutzerdefinierteDienstleistung = () => {
        setBenutzerdefinierteDienstleistungen([
            ...benutzerdefinierteDienstleistungen,
            { title: '', anzahl: 1, preisProEinheit: 0 },
        ]);
    };

    // Remove custom service
    const handleRemoveBenutzerdefinierteDienstleistung = (index) => {
        const newDienstleistungen = benutzerdefinierteDienstleistungen.filter((_, i) => i !== index);
        setBenutzerdefinierteDienstleistungen(newDienstleistungen);
    };

    // Update custom service
    const handleUpdateBenutzerdefinierteDienstleistung = (index, field, value) => {
        const updatedDienstleistungen = [...benutzerdefinierteDienstleistungen];
        updatedDienstleistungen[index][field] = value;
        setBenutzerdefinierteDienstleistungen(updatedDienstleistungen);
    };

    // Set the first custom service to show default title and price
    useEffect(() => {
        if (kundenId && benutzerdefinierteDienstleistungen.length === 0) {
            setBenutzerdefinierteDienstleistungen([
                { title: 'Arbeitszeit', anzahl: 1, preisProEinheit: 100 }, // Example working time
            ]);
        }
    }, [kundenId]);

    // Calculate total with or without VAT
    const calculateTotalWithoutVAT = () => {
        let total = 0;
        benutzerdefinierteDienstleistungen.forEach(dienst => {
            const serviceTotal = dienst.anzahl * dienst.preisProEinheit;
            total += serviceTotal;
        });
        return total.toFixed(2);
    };

    const calculateVAT = () => {
        const totalWithoutVAT = parseFloat(calculateTotalWithoutVAT());
        const vatRate = mehrwertsteuerStatus === 'exkl' ? 0.081 : 0;
        return (totalWithoutVAT * vatRate).toFixed(2);
    };

    const calculateTotalWithVAT = () => {
        const totalWithoutVAT = parseFloat(calculateTotalWithoutVAT());
        const vatAmount = parseFloat(calculateVAT());
        return (totalWithoutVAT + vatAmount).toFixed(2);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kundenId) {
            setMessage('Bitte einen Kunden auswählen.');
            return;
        }

        const invoiceData = {
            kundenId,
            benutzerdefinierteDienstleistungen,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen',
                invoiceData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            window.location.href = "/rechnungen";
            setMessage('');
            setBenutzerdefinierteDienstleistungen([]);
            setKundenSuche('');
            setKundenId('');
        } catch (error) {
            console.error('Fehler beim Erstellen der Rechnung:', error);
        }
    };

    // Fetch customers on component mount
    useEffect(() => {
        fetchKunden();
    }, []);

    // Fetch customer suggestions whenever the search input changes
    useEffect(() => {
        fetchKundenVorschlaege();
    }, [kundenSuche, kunden]);

    return (
        <div className="create-invoice">
            <h2>Rechnung Erstellen</h2>
            <form onSubmit={handleSubmit} className="invoice-form">
                {!kundenId && (
                    <div className="form-group">
                        <label>Kunden suchen:</label>
                        <input
                            type="text"
                            value={kundenSuche}
                            onChange={(e) => setKundenSuche(e.target.value)}
                            placeholder="Kunden Vor- oder Nachname eingeben"
                            className="form-input"
                        />
                        {kundenVorschlaege.length > 0 && (
                            <ul className="customer-suggestions">
                                {kundenVorschlaege.map((kunde) => (
                                    <li
                                        key={kunde.id}
                                        onClick={() => {
                                            setKundenId(kunde.id);
                                            setKundenSuche(`${kunde.vorname} ${kunde.nachname}`);
                                            setKundenVorschlaege([]);
                                        }}
                                    >
                                        {kunde.vorname} {kunde.nachname}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {kundenId && (
                    <div className="kunden-info-box">
                        {(() => {
                            const gewaehlterKunde = kunden.find(k => k.id === kundenId);
                            if (!gewaehlterKunde) return <p>Kunde nicht gefunden.</p>;

                            return (
                                <div className="kunden-details">
                                    <p>{gewaehlterKunde.vorname} {gewaehlterKunde.nachname}</p>
                                    <p>{gewaehlterKunde.strasseHausnummer}</p>
                                    <p>{gewaehlterKunde.postleitzahl} {gewaehlterKunde.ort}</p>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Mehrwertsteuer Auswahl */}
                <div className="form-group">
                    <label>Mehrwertsteuer:</label>
                    <select 
                        value={mehrwertsteuerStatus} 
                        onChange={(e) => setMehrwertsteuerStatus(e.target.value)} 
                        className="form-input"
                    >
                        <option value="inkl">Inkl. MwSt. (inklusive)</option>
                        <option value="exkl">Exkl. MwSt. (zzgl. 8.1%)</option>
                    </select>
                </div>

                {/* Display services if a customer is selected */}
                {kundenId && (
                    <div className="services-display">
                        <h3>Benutzerdefinierte Dienstleistungen</h3>

                        <table className="services-table">
                            <thead>
                                <tr>
                                    <th>Pos</th>
                                    <th>Bezeichnung</th>
                                    <th>Anzahl</th>
                                    <th>Einzelpreis (CHF)</th>
                                    <th>Total (CHF)</th>
                                    <th>Aktionen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {benutzerdefinierteDienstleistungen.map((dienst, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Dienstleistung"
                                                value={dienst.title}
                                                onChange={(e) => handleUpdateBenutzerdefinierteDienstleistung(index, 'title', e.target.value)}
                                                required
                                                disabled={index === 0} // Disable first row
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={dienst.anzahl}
                                                onChange={(e) => handleUpdateBenutzerdefinierteDienstleistung(index, 'anzahl', e.target.value)}
                                                required
                                                disabled={index === 0} // Disable first row
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={dienst.preisProEinheit}
                                                onChange={(e) => handleUpdateBenutzerdefinierteDienstleistung(index, 'preisProEinheit', e.target.value)}
                                                required
                                                disabled={index === 0} // Disable first row
                                            />
                                        </td>
                                        <td>
                                            {(dienst.anzahl * dienst.preisProEinheit).toFixed(2)}
                                        </td>
                                        <td>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBenutzerdefinierteDienstleistung(index)}
                                                    className="remove-button"
                                                >
                                                    Entfernen
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button type="button" onClick={handleAddBenutzerdefinierteDienstleistung} className="add-service-button">
                            Weitere Dienstleistung hinzufügen
                        </button>
                    </div>
                )}

                {/* Final Total */}
                {kundenId && (
                    <div className="final-total">
                        <p>Gesamt ohne MwSt.: {calculateTotalWithoutVAT()} CHF</p>
                        <p>Mehrwertsteuer ({mehrwertsteuerStatus === 'inkl' ? 'inkl.' : 'exkl.'}): {calculateVAT()} CHF</p>
                        <p>Gesamt mit MwSt.: {calculateTotalWithVAT()} CHF</p>
                    </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="submit-button">
                    Rechnung erstellen
                </button>

                {message && <p className="error-message">{message}</p>}
            </form>
        </div>
    );
};

export default RechnungForm;
