import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleGutscheine.scss';
import { FaPlus } from 'react-icons/fa';

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

            {/* + Button zum Erstellen eines neuen Gutscheins */}
            <button className="add-btn" onClick={() => window.location.href = '/gutschein'}>
                <FaPlus /> Neuer Gutschein
            </button>

            <ul>
                {gutscheine.map(gutschein => (
                    <li key={gutschein.gutscheincode}>
                        <div>
                            <strong>Kartennummer:</strong> {gutschein.kartennummer}
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