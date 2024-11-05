import React, { useState } from 'react';
import axios from 'axios';

const CreateAufgabe = ({ kundenId, dienstleistungenId }) => {
    const [titel, setTitel] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`/api/aufgaben/${kundenId}/${dienstleistungenId}`, { titel });
            setMessage(response.data.message);
        } catch (error) {
            console.error("Fehler beim Erstellen der Aufgabe:", error);
            setMessage("Fehler beim Erstellen der Aufgabe.");
        }
    };

    return (
        <div>
            <h2>Aufgabe Erstellen</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titel:</label>
                    <input
                        type="text"
                        value={titel}
                        onChange={(e) => setTitel(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Erstellen</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateAufgabe;
