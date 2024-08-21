import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TimeTracker.scss'; // Importieren Sie das SCSS-Stylesheet

const TimeTracker = () => {
    const { id } = useParams();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [arbeitszeit, setArbeitszeit] = useState('0.00'); // Initialisierung mit '0.00'
    const [message, setMessage] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        fetchArbeitszeit();
    }, [id]); // Fetch der Arbeitszeit bei Änderungen an 'id'

    const fetchArbeitszeit = async () => {
        try {
            const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/arbeitszeit`);
            setArbeitszeit(response.data.arbeitszeit); // Setzen der Arbeitszeit aus der Antwort
        } catch (error) {
            console.error("Fehler beim Abrufen der Arbeitszeit:", error);
            setMessage('Fehler beim Abrufen der Arbeitszeit.');
        }
    };

    const handleStart = () => {
        setStartTime(new Date().toISOString());
        setIsRunning(true);
        setMessage('');
    };

    const handleStop = () => {
        setEndTime(new Date().toISOString());
        setIsRunning(false);
        calculateAndSaveArbeitszeit();
    };

    const calculateAndSaveArbeitszeit = async () => {
        try {
            const response = await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/arbeitszeit`, { startTime, endTime });
            setMessage(response.data.message);
            fetchArbeitszeit(); // Update der angezeigten Arbeitszeit nach der Erfassung
        } catch (error) {
            console.error("Fehler beim Erfassen der Arbeitszeit:", error);
            setMessage('Fehler beim Erfassen der Arbeitszeit.');
        }
    };

    return (
        <div className="time-tracker">
            <h2>Arbeitszeitstempelung</h2>
            <div className="buttons">
                {!isRunning ? (
                    <button className="start-button" onClick={handleStart}>Start</button>
                ) : (
                    <button className="stop-button" onClick={handleStop}>Stop</button>
                )}
            </div>
            {isRunning && (
                <div className="time-display">
                    <label>
                        Startzeit: {new Date(startTime).toLocaleString()}
                    </label>
                </div>
            )}
            {!isRunning && startTime && (
                <div className="time-display">
                    <label>
                        Startzeit: {new Date(startTime).toLocaleString()}
                    </label>
                    <br />
                    <label>
                        Endzeit: {new Date(endTime).toLocaleString()}
                    </label>
                    <br />
                    <button className="record-button" onClick={handleStop}>Arbeitszeit erfassen</button>
                </div>
            )}
            {message && <div className="message">{message}</div>}
            <div className="work-time">
                <h3>Erfasste Arbeitszeit</h3>
                <p>{arbeitszeit} Stunden</p>
            </div>
        </div>
    );
};

export default TimeTracker;
