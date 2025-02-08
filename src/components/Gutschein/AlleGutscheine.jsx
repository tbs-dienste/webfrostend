import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleGutscheine.scss';

const AlleGutscheine = () => {
    const [gutscheine, setGutscheine] = useState([]);

    useEffect(() => {
        const fetchGutscheine = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setGutscheine(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Gutscheine:', error);
                alert('Es gab ein Problem beim Abrufen der Gutscheine. Bitte versuchen Sie es später erneut.');
            }
        };

        fetchGutscheine();
    }, []);

    return (
        <div className="alle-gutscheine">
            <h2>Alle verfügbaren Gutscheincodes</h2>
            <ul>
                {gutscheine.map(gutschein => (
                    <li key={gutschein.gutscheincode}>
                        <div>
                            <strong>Gutscheincode:</strong> {gutschein.gutscheincode}
                        </div>
                        <div>
                            <strong>Guthaben:</strong> {gutschein.guthaben} CHF
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlleGutscheine;