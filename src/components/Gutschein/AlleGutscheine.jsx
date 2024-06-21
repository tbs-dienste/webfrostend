import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleGutscheine.scss'; // Stelle sicher, dass der Pfad zur CSS-Datei korrekt ist

const AlleGutscheine = () => {
    const [gutscheine, setGutscheine] = useState([]);

    useEffect(() => {
        // Funktion zum Abrufen der Gutscheine von der API
        const fetchGutscheine = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine');
                setGutscheine(response.data.data);
            } catch (error) {
                console.error(error);
                alert('Es gab ein Problem beim Abrufen der Gutscheine. Bitte versuchen Sie es später erneut.');
            }
        };

        fetchGutscheine();
    }, []);

    // Funktion zum Aktivieren eines Gutscheins
    const handleAktivieren = async (id) => {
        try {
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/${id}/activate`, { gutscheinaktiviert: true });
            const updatedGutscheine = gutscheine.map(gutschein => {
                if (gutschein.id === id) {
                    return { ...gutschein, gutscheinaktiviert: true };
                }
                return gutschein;
            });
            setGutscheine(updatedGutscheine);
            alert('Gutschein erfolgreich aktiviert.');
        } catch (error) {
            console.error(error);
            alert('Es gab ein Problem beim Aktivieren des Gutscheins. Bitte versuchen Sie es später erneut.');
        }
    };

    return (
        <div className="alle-gutscheine">
            <h2>Alle verfügbaren Gutscheincodes:</h2>
            <ul>
                {gutscheine.map(gutschein => (
                    <li key={gutschein.id}>
                        <span>Gutscheincode: {gutschein.gutscheincode}</span>
                        <span>Betrag: {gutschein.guthaben} CHF</span>
                        <span className={`gutschein-aktiviert ${gutschein.gutscheinaktiviert ? 'aktiviert' : 'nicht-aktiviert'}`}>
                            {gutschein.gutscheinaktiviert ? 'Aktiviert' : 'Nicht aktiviert'}
                        </span>
                        {!gutschein.gutscheinaktiviert && (
                            <button onClick={() => handleAktivieren(gutschein.id)}>Aktivieren</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlleGutscheine;
