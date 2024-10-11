import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RechnungForm.scss';

const RechnungForm = () => {
    const [kunden, setKunden] = useState([]);
    const [ausgewählterKundeId, setAusgewählterKundeId] = useState('');
    const [dienstleistungen, setDienstleistungen] = useState([{ dienstleistungsId: '' }]);
    const [allDienstleistungen, setAllDienstleistungen] = useState([]);
    const [message, setMessage] = useState('');

    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Laden der Kunden
    useEffect(() => {
        const fetchKunden = async () => {
            const token = getToken();
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setKunden(response.data.data);
            } catch (error) {
                console.error('Fehler beim Laden der Kunden:', error);
            }
        };

        fetchKunden();
    }, []);

    // Laden der Dienstleistungen
    useEffect(() => {
        const fetchDienstleistungen = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
                const dienstleistungen = Array.isArray(response.data.data) ? response.data.data : response.data.dienstleistungen;
                setAllDienstleistungen(dienstleistungen);
            } catch (error) {
                console.error('Fehler beim Laden der Dienstleistungen:', error);
            }
        };

        fetchDienstleistungen();
    }, []);

    const handleAddDienstleistung = () => {
        setDienstleistungen([...dienstleistungen, { dienstleistungsId: '' }]);
    };

    const handleDienstleistungChange = (index, value) => {
        const newDienstleistungen = [...dienstleistungen];
        newDienstleistungen[index].dienstleistungsId = value;
        setDienstleistungen(newDienstleistungen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        try {
            const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen', {
                kundenId: ausgewählterKundeId,
                dienstleistungen,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
            setAusgewählterKundeId('');
            setDienstleistungen([{ dienstleistungsId: '' }]);
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'Fehler beim Erstellen der Rechnung.');
        }
    };

    return (
        <div className="rechnung-form">
            <h2>Rechnung Erfassen</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Ausgewählten Kunden:</label>
                    <select
                        value={ausgewählterKundeId}
                        onChange={(e) => setAusgewählterKundeId(e.target.value)}
                        required
                    >
                        <option value="">Bitte wählen</option>
                        {kunden.map(kunde => (
                            <option key={kunde.id} value={kunde.id}>
                                {kunde.vorname} {kunde.nachname}
                            </option>
                        ))}
                    </select>
                </div>

                
                {dienstleistungen.map((dienstleistung, index) => (
                    <div className="form-group" key={index}>
                        <label>Dienstleistung:</label>
                        <select
                            value={dienstleistung.dienstleistungsId}
                            onChange={(e) => handleDienstleistungChange(index, e.target.value)}
                            required
                        >
                            <option value="">Bitte wählen</option>
                            {Array.isArray(allDienstleistungen) && allDienstleistungen.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.title}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                <button type="button" onClick={handleAddDienstleistung}>+ Weitere Dienstleistung hinzufügen</button>
                <button type="submit" disabled={!ausgewählterKundeId}>Rechnung erstellen</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default RechnungForm;
