import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Rechnung.scss';

const Rechnung = () => {
    const [rechnungen, setRechnungen] = useState([]);

    useEffect(() => {
        const fetchRechnungen = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen');
                setRechnungen(response.data); // Annahme: response.data enthält ein Array von Rechnungen
            } catch (error) {
                console.error('Fehler beim Abrufen der Rechnungen:', error);
            }
        };
        fetchRechnungen();
    }, []);

    return (
        <div className="rechnung-container">
            <h2>Alle Rechnungen</h2>
            <Link to="/rechnungform">+</Link>
            <div className="rechnung-list">
                {rechnungen.length === 0 ? (
                    <p>Keine Rechnungen gefunden.</p>
                ) : (
                    rechnungen.map(rechnung => (
                        <div key={rechnung.id} className="rechnung-card">
                            <p>
                                <span>Rechnungs-ID:</span> {rechnung.id}
                            </p>
                            <p>
                                <span>Rechnungsnummer:</span> 
                                <Link to={`/rechnungen/${rechnung.id}`} className="rechnung-link">
                                    {rechnung.rechnungsnummer}
                                </Link>
                            </p>
                            <p>
                                <span>Status:</span> {rechnung.status}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Rechnung;
