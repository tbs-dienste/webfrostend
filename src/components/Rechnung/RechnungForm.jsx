import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RechnungForm.scss';

const RechnungForm = () => {
    const [kundenSuche, setKundenSuche] = useState('');
    const [kundenId, setKundenId] = useState('');
    const [kundenVorschlaege, setKundenVorschlaege] = useState([]);
    const [kunden, setKunden] = useState([]);
    const [benutzerdefinierteDienstleistungen, setBenutzerdefinierteDienstleistungen] = useState([{ title: '', anzahl: 1, preisProEinheit: 0 }]);
    const [message, setMessage] = useState('');

    // Kunden von der API abrufen
    const fetchKunden = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKunden(response.data.data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Kunden:', error);
        }
    };

    // Vorschläge für Kunden basierend auf der Suche anzeigen
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

    // Benutzerdefinierte Dienstleistungen hinzufügen
    const handleAddBenutzerdefinierteDienstleistung = () => {
        setBenutzerdefinierteDienstleistungen([...benutzerdefinierteDienstleistungen, { title: '', anzahl: 1, preisProEinheit: 0 }]);
    };

    // Benutzerdefinierte Dienstleistungen entfernen
    const handleRemoveBenutzerdefinierteDienstleistung = (index) => {
        const newDienstleistungen = benutzerdefinierteDienstleistungen.filter((_, i) => i !== index);
        setBenutzerdefinierteDienstleistungen(newDienstleistungen);
    };

    // Rechnung erstellen
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kundenId) {
            setMessage('Bitte einen Kunden auswählen.');
            return;
        }

        const invoiceData = {
            kundenId,
            benutzerdefinierteDienstleistungen
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen', invoiceData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Rechnung erfolgreich erstellt: ${response.data.rechnungId}`);
            setMessage('');
            setBenutzerdefinierteDienstleistungen([{ title: '', anzahl: 1, preisProEinheit: 0 }]);
            setKundenSuche('');
            setKundenId('');
        } catch (error) {
            console.error('Fehler beim Erstellen der Rechnung:', error);
        }
    };

    useEffect(() => {
        fetchKunden();
    }, []);

    useEffect(() => {
        fetchKundenVorschlaege();
    }, [kundenSuche, kunden]);

    return (
        <div className="create-invoice">
            <h2>Rechnung Erstellen</h2>
            <form onSubmit={handleSubmit} className="invoice-form">
                <div>
                    <label>Kunden suchen:</label>
                    <input
                        type="text"
                        value={kundenSuche}
                        onChange={(e) => setKundenSuche(e.target.value)}
                        placeholder="Kunden Vor- oder Nachname eingeben"
                    />
                    {kundenVorschlaege.length > 0 && (
                        <ul>
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
                            min="0"
                            required
                        />
                        <button type="button" onClick={() => handleRemoveBenutzerdefinierteDienstleistung(index)}>Entfernen</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddBenutzerdefinierteDienstleistung}>
                    Benutzerdefinierte Dienstleistung Hinzufügen
                </button>
                <button type="submit" className="submit-button">
                    Rechnung Erstellen
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RechnungForm;