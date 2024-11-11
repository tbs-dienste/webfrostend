import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateAufgaben.scss'; // Importiere die SCSS-Datei

const CreateAufgabe = () => {
    const { kundenId, dienstleistungId } = useParams(); // Holen Sie sich die kundenId und dienstleistungId aus den URL-Parametern
    const [titel, setTitel] = useState(''); // Titel der Aufgabe
    const [message, setMessage] = useState(''); // Erfolgs- oder Fehlermeldung

    // Aufgabe erstellen
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titel) {
            setMessage('Bitte alle Felder ausfüllen.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/${kundenId}/${dienstleistungId}`,
                { titel },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(response.data.message); // Erfolgsnachricht setzen
            setTitel(''); // Eingabefeld zurücksetzen

            // Weiterleitung zur Aufgabenübersicht mit window.location.href
            window.location.href = `/aufgaben/${kundenId}`;
        } catch (error) {
            console.error("Fehler beim Erstellen der Aufgabe:", error);
            setMessage('Fehler beim Erstellen der Aufgabe.');
        }
    };

    return (
        <div className="create-aufgabe-container">
            <h1>Neue Aufgabe erstellen</h1>

            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit} className="create-aufgabe-form">
                <div className="form-group">
                    <label htmlFor="titel">Titel</label>
                    <input
                        type="text"
                        id="titel"
                        value={titel}
                        onChange={(e) => setTitel(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">
                    Aufgabe erstellen
                </button>
            </form>
        </div>
    );
};

export default CreateAufgabe;
