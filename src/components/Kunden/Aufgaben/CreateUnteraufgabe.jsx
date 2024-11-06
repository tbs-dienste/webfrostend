import React, { useState } from 'react';
import axios from 'axios';
import './CreateUnteraufgabe.scss'; // Importiere die SCSS-Datei
import { useParams } from 'react-router-dom';

const CreateUnteraufgabe = () => {
    const { aufgabenId } = useParams(); // Nur Aufgaben-ID aus den URL-Parametern extrahieren
    const [titel, setTitel] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [abgabedatum, setAbgabedatum] = useState('');
    const [status, setStatus] = useState('');
    const [schwierigkeitsgrad, setSchwierigkeitsgrad] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("aufgabenId:", aufgabenId);
    
        // Überprüfung, ob die Aufgaben-ID definiert ist
        if (!aufgabenId) {
            setError("Aufgaben-ID ist nicht definiert.");
            return;
        }
    
        // Validierung der Formulareingaben
        if (!titel || !beschreibung || !abgabedatum || !status || !schwierigkeitsgrad) {
            setError("Alle Felder sind erforderlich.");
            return;
        }
    
        const unteraufgabeData = {
            titel,
            beschreibung,
            abgabedatum,
            status,
            schwierigkeitsgrad,
        };
    
        try {
            const response = await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/${aufgabenId}/unteraufgaben`, unteraufgabeData);
            setMessage(response.data.message);
            
            setError('');
        } catch (error) {
            console.error("Fehler beim Erstellen der Unteraufgabe:", error);
            setMessage('');
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Fehler beim Erstellen der Unteraufgabe.");
            }
        }
    };
    
    return (
        <div className="create-unteraufgabe">
            <h2>Unteraufgabe Erstellen</h2>
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
                    <label>Beschreibung:</label>
                    <textarea
                        value={beschreibung}
                        onChange={(e) => setBeschreibung(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Abgabedatum:</label>
                    <input
                        type="datetime-local"
                        value={abgabedatum}
                        onChange={(e) => setAbgabedatum(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Schwierigkeitsgrad:</label>
                    <select
                        value={schwierigkeitsgrad}
                        onChange={(e) => setSchwierigkeitsgrad(e.target.value)}
                        required
                    >
                        <option value="" disabled>Wählen Sie den Schwierigkeitsgrad</option>
                        <option value="1">Einfach</option>
                        <option value="2">Mittel</option>
                        <option value="3">Schwierig</option>
                    </select>
                </div>
                <button type="submit">Erstellen</button>
            </form>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default CreateUnteraufgabe;
