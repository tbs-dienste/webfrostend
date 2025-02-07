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
                setGutscheine(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Gutscheine:', error);
                alert('Es gab ein Problem beim Abrufen der Gutscheine. Bitte versuchen Sie es später erneut.');
            }
        };

        fetchGutscheine();
    }, []);

    const handleToggle = async (gutscheincode, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = currentStatus === 'aktiv' ? 'deaktiviert' : 'aktiv';

            await axios.put('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/activate', 
                { gutscheincode, guthaben: 0 },  // Guthaben bleibt unverändert
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setGutscheine(gutscheine.map(gutschein =>
                gutschein.gutscheincode === gutscheincode
                    ? { ...gutschein, status: newStatus }
                    : gutschein
            ));
        } catch (error) {
            console.error('Fehler beim Umschalten des Gutscheins:', error);
            alert('Es gab ein Problem beim Umschalten des Gutscheins. Bitte versuchen Sie es später erneut.');
        }
    };

    const handleLoeschen = async (gutscheincode) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/${gutscheincode}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setGutscheine(gutscheine.filter(gutschein => gutschein.gutscheincode !== gutscheincode));
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
                    <li key={gutschein.gutscheincode}>
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
                                    checked={gutschein.status === 'aktiv'}
                                    onChange={() => handleToggle(gutschein.gutscheincode, gutschein.status)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <button onClick={() => handleLoeschen(gutschein.gutscheincode)}>
                            <FaTrashAlt /> Löschen
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlleGutscheine;