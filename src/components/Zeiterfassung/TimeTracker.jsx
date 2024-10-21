import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TimeTracker.scss';

const TimeTracker = () => {
    const { id } = useParams(); // Kunden-ID aus URL-Parametern
    const [dienstleistungen, setDienstleistungen] = useState([]); // Liste der Dienstleistungen
    const [selectedDienstleistung, setSelectedDienstleistung] = useState(''); // Ausgewählte Dienstleistung
    const [timer, setTimer] = useState(0); // Timer in Sekunden
    const [isRunning, setIsRunning] = useState(false); // Timer läuft?
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true); // Zustand für das Laden

    useEffect(() => {
        fetchDienstleistungen();
    }, [id]);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        } else if (!isRunning && timer !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    const fetchDienstleistungen = async () => {
        try {
            const token = localStorage.getItem('token'); // Token aus localStorage
            const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.data) {
                const dienstleistungenFromResponse = response.data.data.dienstleistungen;
                if (Array.isArray(dienstleistungenFromResponse) && dienstleistungenFromResponse.length > 0) {
                    setDienstleistungen(dienstleistungenFromResponse);
                    setSelectedDienstleistung(dienstleistungenFromResponse[0].id); // Standardmäßig die erste Dienstleistung auswählen
                } else {
                    setMessage('Keine Dienstleistungen verfügbar.');
                }
            } else {
                setMessage('Keine Daten verfügbar.');
            }
        } catch (error) {
            console.error("Fehler beim Abrufen der Dienstleistungen:", error);
            setMessage('Fehler beim Abrufen der Dienstleistungen.');
        } finally {
            setLoading(false); // Ladezustand beenden
        }
    };

    const handleStart = () => {
        setTimer(0);
        setIsRunning(true);
        setMessage('');
    };

    const handleStop = async () => {
        setIsRunning(false);
        await saveArbeitszeit();
    };

    const saveArbeitszeit = async () => {
        const startTime = new Date(); // Startzeit erfassen
        const endTime = new Date(startTime.getTime() + timer * 1000); // Endzeit berechnen
        const formattedHours = (timer / 3600).toFixed(2); // Arbeitszeit in Stunden

        // Speichern der Arbeitszeit
        try {
            const token = localStorage.getItem('token');
            await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/record`, {
                kundenId: id, // Kunden-ID
                dienstleistungId: selectedDienstleistung,
                startTime: startTime.toISOString(), // Startzeit im ISO-Format
                endTime: endTime.toISOString(), // Endzeit im ISO-Format
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Arbeitszeit erfolgreich gespeichert!');
        } catch (error) {
            console.error("Fehler beim Speichern der Arbeitszeit:", error);
            alert('Fehler beim Speichern der Arbeitszeit.');
        }
    };

    const handleCancel = () => {
        setIsRunning(false);
        setTimer(0); // Timer zurücksetzen
        setMessage('Timer abgebrochen.');
    };

    if (loading) {
        return <div className="loading">Lade Dienstleistungen...</div>;
    }

    return (
        <div className="time-tracker-container">
            <h2>Zeit Tracker</h2>
            <div>
                <label>Wählen Sie eine Dienstleistung:</label>
                <select 
                    value={selectedDienstleistung} 
                    onChange={(e) => setSelectedDienstleistung(e.target.value)} 
                    disabled={isRunning} // Dienstleistung nicht wechselbar, wenn der Timer läuft
                >
                    {dienstleistungen.map(dienstleistung => (
                        <option key={dienstleistung.id} value={dienstleistung.id}>
                            {dienstleistung.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="timer-circle">
                <div className="timer-display">
                    {new Date(timer * 1000).toISOString().substr(11, 8)}
                </div>
            </div>

            <div className="time-controls">
                {isRunning ? (
                    <>
                        <button onClick={handleStop}>Stoppen</button>
                        <button onClick={handleCancel}>Abbrechen</button>
                    </>
                ) : (
                    <button onClick={handleStart}>Starten</button>
                )}
            </div>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default TimeTracker;
