import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams importieren
import './ArbeitszeitErfassen.scss';
import axios from 'axios';

const ArbeitszeitErfassen = () => {
    const { kundenId, dienstleistungId } = useParams(); // dienstleistungId aus den URL-Parametern abrufen
    const [mitarbeiterSuche, setMitarbeiterSuche] = useState('');
    const [mitarbeiterId, setMitarbeiterId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [mitarbeiterVorschlaege, setMitarbeiterVorschlaege] = useState([]);
    const [mitarbeiter, setMitarbeiter] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validierung der Felder
        if (!mitarbeiterId || !startTime || !endTime) {
            setMessage('Bitte alle Felder ausfüllen.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/${kundenId}/${dienstleistungId}`, 
                { mitarbeiterId, startTime, endTime }, // dienstleistungId wird automatisch aus den Parametern übergeben
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setMessage(response.data.message);
            // Felder zurücksetzen
            setMitarbeiterId('');
            setStartTime('');
            setEndTime('');
            setMitarbeiterSuche('');
        } catch (error) {
            console.error('Fehler beim Erfassen der Arbeitszeit:', error);
            if (error.response) {
                setMessage(error.response.data.error || 'Fehler beim Erfassen der Arbeitszeit.');
            }
        }
    };
    

    // Effekt für das Abrufen der Mitarbeiter beim Laden der Komponente
    useEffect(() => {
        fetchMitarbeiter();
    }, []);

    useEffect(() => {
        fetchMitarbeiterVorschlaege();
    }, [mitarbeiterSuche, mitarbeiter]);

    return (
        <div className="arbeitszeit-form">
            <h2>Arbeitszeit erfassen (Admin)</h2>
            <form onSubmit={handleSubmit}>
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
                                    setMitarbeiterSuche(`${mitarbeiter.vorname} ${mitarbeiter.nachname}`);
                                    setMitarbeiterVorschlaege([]);
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
