import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Für Navigation importieren
import { jwtDecode } from "jwt-decode"; 
import './Stellenanzeigen.scss';

const Stellenanzeigen = () => {
    const [stellen, setStellen] = useState([]);
    const [filteredStellen, setFilteredStellen] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); // Navigation Hook

    // Admin-Check und Stellenanzeige laden
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.userType === 'admin') {
                setIsAdmin(true);
            }
        }

        const fetchStellen = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/stellen');
                const fetchedStellen = response.data.data;

                const filtered = fetchedStellen.filter(stelle => 
                    stelle.status === 'Veröffentlicht' && !localStorage.getItem('token')
                );

                setStellen(fetchedStellen);
                setFilteredStellen(filtered); 
            } catch (error) {
                console.error("Fehler beim Abrufen der Stellen:", error);
            }
        };

        fetchStellen();
    }, []);

    // Filter für Stellenanzeigen basierend auf Status
    const filterStellen = (status) => {
        setStatusFilter(status);
        if (status === '') {
            setFilteredStellen(stellen.filter(stelle => 
                (stelle.status === 'Veröffentlicht' || isAdmin)
            ));
        } else {
            const filtered = stellen.filter(stelle => 
                stelle.status === status && (isAdmin || status !== 'Veröffentlicht')
            );
            setFilteredStellen(filtered);
        }
    };

    // Funktion zum Weiterleiten auf Stellen-Detail-Seite mit Stellen-ID
    const handleMehrErfahren = (stelleId) => {
        navigate(`/stellen-detail/${stelleId}`); // Weiterleitung mit Stellen-ID als Parameter
    };

    return (
        <div className="stellen-container">
            <h1 className="stellen-title">Verfügbare Stellen</h1>

            {isAdmin && (
                <div className="filter-buttons">
                    <button onClick={() => filterStellen('')} className={statusFilter === '' ? 'active' : ''}>Alle</button>
                    <button onClick={() => filterStellen('Entwurf')} className={statusFilter === 'Entwurf' ? 'active' : ''}>Entwurf</button>
                    <button onClick={() => filterStellen('Veröffentlicht')} className={statusFilter === 'Veröffentlicht' ? 'active' : ''}>Veröffentlicht</button>
                    <button onClick={() => filterStellen('Abgeschlossen')} className={statusFilter === 'Abgeschlossen' ? 'active' : ''}>Abgeschlossen</button>
                </div>
            )}

            {filteredStellen.length === 0 ? (
                <p className="no-stellen">Derzeit sind keine Stellen verfügbar.</p>
            ) : (
                <ul className="stellen-list">
                    {filteredStellen.map((stelle) => (
                        <li className="stellen-item" key={stelle.id}>
                            <div className="stellen-header">
                                <h2>{stelle.bezeichnung}</h2>

                                {isAdmin && (
                                    <span className={`status ${stelle.status.toLowerCase()}`}>{stelle.status}</span>
                                )}
                            </div>
                            <p><strong>Vorgesetzter:</strong> {stelle.vorgesetzter}</p>
                            <p><strong>Startdatum:</strong> {new Date(stelle.start_datum).toLocaleDateString()}</p>

                            <button 
                                className="mehr-erfahren-button" 
                                onClick={() => handleMehrErfahren(stelle.id)} // Bei Klick wird die Stellen-ID weitergegeben
                            >
                                Mehr erfahren
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Stellenanzeigen;
