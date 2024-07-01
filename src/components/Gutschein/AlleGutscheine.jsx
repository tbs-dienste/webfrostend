import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleGutscheine.scss';
import { FaTrashAlt } from 'react-icons/fa';

const AlleGutscheine = () => {
    const [gutscheine, setGutscheine] = useState([]);

    useEffect(() => {
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
        } catch (error) {
            console.error(error);
            alert('Es gab ein Problem beim Aktivieren des Gutscheins. Bitte versuchen Sie es später erneut.');
        }
    };

    const handleDeaktivieren = async (id) => {
        try {
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/${id}/activate`, { gutscheinaktiviert: false });
            const updatedGutscheine = gutscheine.map(gutschein => {
                if (gutschein.id === id) {
                    return { ...gutschein, gutscheinaktiviert: false };
                }
                return gutschein;
            });
            setGutscheine(updatedGutscheine);
        } catch (error) {
            console.error(error);
            alert('Es gab ein Problem beim Deaktivieren des Gutscheins. Bitte versuchen Sie es später erneut.');
        }
    };

    const handleToggle = (id, isActive) => {
        if (isActive) {
            handleDeaktivieren(id);
        } else {
            handleAktivieren(id);
        }
    };

    const handleLoeschen = async (id) => {
        try {
            await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/${id}`);
            const filteredGutscheine = gutscheine.filter(gutschein => gutschein.id !== id);
            setGutscheine(filteredGutscheine);
        } catch (error) {
            console.error(error);
            alert('Es gab ein Problem beim Löschen des Gutscheins. Bitte versuchen Sie es später erneut.');
        }
    };

    return (
        <div className="alle-gutscheine">
            <h2>Alle verfügbaren Gutscheincodes</h2>
            <ul>
                {gutscheine.map(gutschein => (
                    <li key={gutschein.id} className="gutschein-item">
                        <div className="gutschein-details">
                            <span>Gutscheincode: <strong>{gutschein.gutscheincode}</strong></span>
                            {gutschein.gutscheinrabatt > 0 ? (
                                <span>Rabatt: <strong>{gutschein.gutscheinrabatt * 100} %</strong></span> // Umrechnung in Prozent
                            ) : (
                                <span>Betrag: <strong>{gutschein.guthaben} €</strong></span>
                            )}
                        </div>
                        <div className="switch-container">
                            <span className={`gutschein-aktiviert ${gutschein.gutscheinaktiviert ? 'aktiviert' : 'nicht-aktiviert'}`}>
                                {gutschein.gutscheinaktiviert ? 'Aktiviert' : 'Nicht aktiviert'}
                            </span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={gutschein.gutscheinaktiviert}
                                    onChange={() => handleToggle(gutschein.id, gutschein.gutscheinaktiviert)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <button className="loeschen-btn" onClick={() => handleLoeschen(gutschein.id)}>
                            <FaTrashAlt /> 
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlleGutscheine;
