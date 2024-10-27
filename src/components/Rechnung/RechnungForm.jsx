// CreateInvoice.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RechnungForm.scss'; // Importiere die SCSS-Datei

const RechnungForm = () => {
    const [kundenId, setKundenId] = useState('');
    const [dienstleistungen, setDienstleistungen] = useState([]);
    const [benutzerdefinierteDienstleistungen, setBenutzerdefinierteDienstleistungen] = useState([{ title: '', anzahl: 1, preisProEinheit: 0 }]);
    
    // KundenID aus der URL abrufen (z.B. für eine Route wie /create-invoice/:kundenId)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('kundenId');
        if (id) {
            setKundenId(id);
            fetchDienstleistungen(id);
        }
    }, []);

    // Dienstleitungen für den Kunden abrufen
    const fetchDienstleistungen = async (id) => {
        try {
            const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`);
            setDienstleistungen(response.data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Dienstleistungen:', error);
        }
    };

    // Hinzufügen eines neuen benutzerdefinierten Dienstes
    const handleAddBenutzerdefinierteDienstleistung = () => {
        setBenutzerdefinierteDienstleistungen([...benutzerdefinierteDienstleistungen, { title: '', anzahl: 1, preisProEinheit: 0 }]);
    };

    // Entfernen eines benutzerdefinierten Dienstes
    const handleRemoveBenutzerdefinierteDienstleistung = (index) => {
        const newDienstleistungen = benutzerdefinierteDienstleistungen.filter((_, i) => i !== index);
        setBenutzerdefinierteDienstleistungen(newDienstleistungen);
    };

    // Formular absenden
    const handleSubmit = async (e) => {
        e.preventDefault();
        const invoiceData = {
            kundenId,
            benutzerdefinierteDienstleistungen
        };

        try {
            const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen', invoiceData);
            alert(`Rechnung erfolgreich erstellt: ${response.data.rechnungId}`);
        } catch (error) {
            console.error('Fehler beim Erstellen der Rechnung:', error);
        }
    };

    return (
        <div className="create-invoice">
            <h2>Rechnung Erstellen</h2>
            <form onSubmit={handleSubmit} className="invoice-form">
                <div className="form-group">
                    <label htmlFor="kundenId">Kunden ID:</label>
                    <input
                        type="text"
                        id="kundenId"
                        value={kundenId}
                        onChange={(e) => setKundenId(e.target.value)}
                        required
                    />
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
                <button type="button" onClick={handleAddBenutzerdefinierteDienstleistung}>Benutzerdefinierte Dienstleistung Hinzufügen</button>
                <button type="submit" className="submit-button">Rechnung Erstellen</button>
            </form>
        </div>
    );
};

export default RechnungForm;
