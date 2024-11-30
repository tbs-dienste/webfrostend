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

                {/* Display services if a customer is selected */}
                {kundenId && (
                    <div className="services-display">
                        <h3>Benutzerdefinierte Dienstleistungen</h3>
                        {benutzerdefinierteDienstleistungen.map((dienst, index) => (
                            <div key={index} className="custom-service">
                                <input
                                    type="text"
                                    placeholder="Dienstleistung Titel"
                                    value={dienst.title}
                                    onChange={(e) => {
                                        const newDienstleistungen = [...benutzerdefinierteDienstleistungen];
                                        newDienstleistungen[index].title = e.target.value;
                                        setBenutzerdefinierteDienstleistungen(newDienstleistungen);
                                    }}
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Anzahl"
                                    value={dienst.anzahl}
                                    onChange={(e) => {
                                        const newDienstleistungen = [...benutzerdefinierteDienstleistungen];
                                        newDienstleistungen[index].anzahl = e.target.value;
                                        setBenutzerdefinierteDienstleistungen(newDienstleistungen);
                                    }}
                                    className="form-input"
                                    min="1"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Preis pro Einheit"
                                    value={dienst.preisProEinheit}
                                    onChange={(e) => {
                                        const newDienstleistungen = [...benutzerdefinierteDienstleistungen];
                                        newDienstleistungen[index].preisProEinheit = e.target.value;
                                        setBenutzerdefinierteDienstleistungen(newDienstleistungen);
                                    }}
                                    className="form-input"
                                    min="0"
                                    required
                                />
                                <div className="total-price">
                                    Total: {dienst.anzahl * dienst.preisProEinheit} CHF
                                </div>
                                <button type="button" className="remove-button" onClick={() => handleRemoveBenutzerdefinierteDienstleistung(index)}>
                                    Entfernen
                                </button>
                            </div>
                        ))}
                        {/* Show + button only if the customer is selected */}
                        <button type="button" className="add-service-button" onClick={handleAddBenutzerdefinierteDienstleistung}>
                            + Benutzerdefinierte Dienstleistung Hinzufügen
                        </button>
                    </div>
                )}

                <button type="submit" className="submit-button">
                    Rechnung Erstellen
                </button>
            </form>

            {message && <p className="error-message">{message}</p>}
        </div>
    );
};

export default RechnungForm;
