import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleGutscheine.scss';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';

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
                setGutscheine(response.data.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Gutscheine:', error);
                alert('Es gab ein Problem beim Abrufen der Gutscheine. Bitte versuchen Sie es später erneut.');
            }
        };

        fetchGutscheine();
    }, []);

    const handleToggle = async (id, isActive) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/${id}/activate`, 
                { gutscheinaktiviert: !isActive }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedGutscheine = gutscheine.map(gutschein => {
                if (gutschein.id === id) {
                    return { ...gutschein, gutscheinaktiviert: !isActive };
                }
                return gutschein;
            });
            setGutscheine(updatedGutscheine);
        } catch (error) {
            console.error('Fehler beim Umschalten des Gutscheins:', error);
            alert('Es gab ein Problem beim Umschalten des Gutscheins. Bitte versuchen Sie es später erneut.');
        }
    };

    // Funktion zum Löschen eines Gutscheins
    const handleLoeschen = async (id) => {
        try {
            const token = localStorage.getItem('token');
            // Anfrage zum Löschen des Gutscheins
            await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Entfernen des Gutscheins aus dem Zustand, nachdem er gelöscht wurde
            const updatedGutscheine = gutscheine.filter(gutschein => gutschein.id !== id);
            setGutscheine(updatedGutscheine);
        } catch (error) {
            console.error('Fehler beim Löschen des Gutscheins:', error);
            alert('Es gab ein Problem beim Löschen des Gutscheins. Bitte versuchen Sie es später erneut.');
        }
    };

    return (
        <div className="alle-gutscheine">
            <h2>Alle verfügbaren Gutscheincodes</h2>
            <button className="add-btn" onClick={() => window.location.href = '/gutschein'}>
                <FaPlus /> Neuer Gutschein
            </button>
            <ul>
                {gutscheine.map(gutschein => (
                    <li key={gutschein.id}>
                        <div>
                            <strong>Gutschein Code:</strong> {gutschein.gutscheincode}
                        </div>
                        <div>
                            <strong>Guthaben:</strong> {gutschein.guthaben} CHF
                        </div>
                        <div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={gutschein.gutscheinaktiviert}
                                    onChange={() => handleToggle(gutschein.id, gutschein.gutscheinaktiviert)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <button onClick={() => handleLoeschen(gutschein.id)}><FaTrashAlt /> Löschen</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlleGutscheine;
