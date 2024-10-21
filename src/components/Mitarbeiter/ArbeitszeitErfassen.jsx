import React, { useState, useEffect } from 'react';
import './ArbeitszeitErfassen.scss';
import axios from 'axios';

const ArbeitszeitErfassen = () => {
    const [kundenSuche, setKundenSuche] = useState('');
    const [mitarbeiterSuche, setMitarbeiterSuche] = useState('');
    const [kundenId, setKundenId] = useState('');
    const [dienstleistungId, setDienstleistungId] = useState('');
    const [mitarbeiterId, setMitarbeiterId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [kundenVorschlaege, setKundenVorschlaege] = useState([]);
    const [mitarbeiterVorschlaege, setMitarbeiterVorschlaege] = useState([]);
    const [kunden, setKunden] = useState([]); // Zustand für die Kunden
    const [mitarbeiter, setMitarbeiter] = useState([]); // Zustand für die Mitarbeiter

    // Funktion zum Abrufen der Kunden von der API
    const fetchKunden = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKunden(response.data.data); // Setze die erhaltenen Kunden in den Zustand
        } catch (error) {
            console.error('Fehler beim Abrufen der Kunden:', error);
        }
    };

    // Funktion zum Abrufen der Mitarbeiter von der API
    const fetchMitarbeiter = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMitarbeiter(response.data.data); // Setze die erhaltenen Mitarbeiter in den Zustand
        } catch (error) {
            console.error('Fehler beim Abrufen der Mitarbeiter:', error);
        }
    };

    // Funktion zum Abrufen der Mitarbeitervorschläge basierend auf der Sucheingabe
    const fetchMitarbeiterVorschlaege = () => {
        if (mitarbeiterSuche.length > 2) {
            const filteredMitarbeiter = mitarbeiter.filter((mitarbeiter) =>
                `${mitarbeiter.vorname} ${mitarbeiter.nachname}`.toLowerCase().includes(mitarbeiterSuche.toLowerCase())
            );
            setMitarbeiterVorschlaege(filteredMitarbeiter);
        } else {
            setMitarbeiterVorschlaege([]);
        }
    };

    // Funktion zum Abrufen der Kundenvorschläge basierend auf der Sucheingabe
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validierung der Felder
        if (!kundenId || !dienstleistungId || !mitarbeiterId || !startTime || !endTime) {
            setMessage('Bitte alle Felder ausfüllen.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/mitarbeiter',
                { kundenId, dienstleistungId, mitarbeiterId, startTime, endTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);
            // Felder zurücksetzen
            setKundenId('');
            setDienstleistungId('');
            setMitarbeiterId('');
            setStartTime('');
            setEndTime('');
            setKundenSuche('');
            setMitarbeiterSuche('');
        } catch (error) {
            console.error('Fehler beim Erfassen der Arbeitszeit:', error);
            setMessage('Fehler beim Erfassen der Arbeitszeit.');
        }
    };

    // Effekt für das Abrufen der Kunden und Mitarbeiter beim Laden der Komponente
    useEffect(() => {
        fetchKunden();
        fetchMitarbeiter();
    }, []);

    useEffect(() => {
        fetchMitarbeiterVorschlaege();
    }, [mitarbeiterSuche, mitarbeiter]);

    useEffect(() => {
        fetchKundenVorschlaege();
    }, [kundenSuche, kunden]);

    return (
        <div className="arbeitszeit-form">
            <h2>Arbeitszeit erfassen (Admin)</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Kunde suchen:</label>
                    <input 
                        type="text" 
                        value={kundenSuche} 
                        onChange={(e) => setKundenSuche(e.target.value)} 
                        placeholder="Kunden Vor- oder Nachname eingeben" 
                    />
                    {kundenVorschlaege.length > 0 && (
                        <ul>
                            {kundenVorschlaege.map((kunde) => (
                                <li key={kunde.id} onClick={() => {
                                    setKundenId(kunde.id);
                                    setKundenSuche(`${kunde.vorname} ${kunde.nachname}`); // Setze den Namen ins Eingabefeld
                                    setKundenVorschlaege([]); // Leere die Vorschläge
                                }}>
                                    {kunde.vorname} {kunde.nachname}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <label>Dienstleistung ID:</label>
                    <input 
                        type="text" 
                        value={dienstleistungId} 
                        onChange={(e) => setDienstleistungId(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Mitarbeiter suchen:</label>
                    <input 
                        type="text" 
                        value={mitarbeiterSuche} 
                        onChange={(e) => setMitarbeiterSuche(e.target.value)} 
                        placeholder="Mitarbeiter Vor- oder Nachname eingeben" 
                    />
                    {mitarbeiterVorschlaege.length > 0 && (
                        <ul>
                            {mitarbeiterVorschlaege.map((mitarbeiter) => (
                                <li key={mitarbeiter.id} onClick={() => {
                                    setMitarbeiterId(mitarbeiter.id);
                                    setMitarbeiterSuche(`${mitarbeiter.vorname} ${mitarbeiter.nachname}`); // Setze den Namen ins Eingabefeld
                                    setMitarbeiterVorschlaege([]); // Leere die Vorschläge
                                }}>
                                    {mitarbeiter.vorname} {mitarbeiter.nachname}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <label>Startzeit:</label>
                    <input 
                        type="datetime-local" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Endzeit:</label>
                    <input 
                        type="datetime-local" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Arbeitszeit erfassen</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ArbeitszeitErfassen;
