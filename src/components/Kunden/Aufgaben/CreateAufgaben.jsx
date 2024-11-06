import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateAufgaben.scss'; // Importiere die SCSS-Datei

const CreateAufgabe = () => {
    const { kundenId } = useParams();
    const [titel, setTitel] = useState('');
    const [dienstleistungen, setDienstleistungen] = useState([]);
    const [selectedDienstleistung, setSelectedDienstleistung] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDienstleistungen = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${kundenId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data && response.data.data && response.data.data.dienstleistungen) {
                    setDienstleistungen(response.data.data.dienstleistungen);
                    if (response.data.data.dienstleistungen.length > 0) {
                        setSelectedDienstleistung(response.data.data.dienstleistungen[0].id);
                    }
                } else {
                    setMessage("Keine Dienstleistungen verfügbar.");
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Dienstleistungen:", error);
                setMessage("Fehler beim Laden der Dienstleistungen.");
            } finally {
                setLoading(false);
            }
        };
        fetchDienstleistungen();
    }, [kundenId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/${kundenId}`, {
                titel,
                dienstleistungenId: selectedDienstleistung,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
           // Umleitung zur Aufgaben-Seite des Kunden
            window.location.href = `/aufgaben/${kundenId}`; // Hier den Platzhalter durch die echte Kunden-ID ersetzen
            setTitel('');
            setSelectedDienstleistung('');
        } catch (error) {
            console.error("Fehler beim Erstellen der Aufgabe:", error);
            setMessage("Fehler beim Erstellen der Aufgabe.");
        }
    };

    if (loading) {
        return <div className="loading">Lade Dienstleistungen...</div>;
    }

    return (
        <div className="create-aufgabe-container">
            <h2>Aufgabe Erstellen</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titel:</label>
                    <input
                        type="text"
                        value={titel}
                        onChange={(e) => setTitel(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Dienstleistung:</label>
                    <select
                        value={selectedDienstleistung}
                        onChange={(e) => setSelectedDienstleistung(e.target.value)}
                        required
                    >
                        <option value="">Bitte auswählen</option>
                        {dienstleistungen.map((dienstleistung) => (
                            <option key={dienstleistung.id} value={dienstleistung.id}>
                                {dienstleistung.title}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Erstellen</button>
            </form>
            {message && (
                <p className={`message ${message.includes('erfolgreich') ? 'success' : 'error'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default CreateAufgabe;
