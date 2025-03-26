import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // jwt-decode importieren
import './Stellenanzeigen.scss';

const Stellenanzeigen = () => {
    const [stellen, setStellen] = useState([]);
    const [filteredStellen, setFilteredStellen] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedStelle, setSelectedStelle] = useState(null); // Zustand für die Details der ausgewählten Stelle

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

                // Nur veröffentlichte Stellen ohne Token anzeigen
                const filtered = fetchedStellen.filter(stelle => 
                    stelle.status === 'Veröffentlicht' && !localStorage.getItem('token')
                );

                setStellen(fetchedStellen);
                setFilteredStellen(filtered); // Nur veröffentlichte Stellen ohne Token
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
                (stelle.status === 'Veröffentlicht' || isAdmin) // Alle anzeigen, wenn Admin oder 'Veröffentlicht'
            ));
        } else {
            const filtered = stellen.filter(stelle => 
                stelle.status === status && (isAdmin || status !== 'Veröffentlicht')
            );
            setFilteredStellen(filtered);
        }
    };

    // Funktion zum Anzeigen der Details der ausgewählten Stelle
    const handleMehrErfahren = (stelle) => {
        setSelectedStelle(stelle); // Setze die ausgewählte Stelle
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

                            {/* "Mehr erfahren"-Button */}
                            <button 
                                className="mehr-erfahren-button" 
                                onClick={() => handleMehrErfahren(stelle)}>
                                Mehr erfahren
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedStelle && (
                <div className="stellen-details">
                    <h2>Details zur Stelle</h2>
                    <p><strong>Bezeichnung:</strong> {selectedStelle.bezeichnung}</p>
                    <p><strong>Vorgesetzter:</strong> {selectedStelle.vorgesetzter}</p>
                    <p><strong>Startdatum:</strong> {new Date(selectedStelle.start_datum).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {selectedStelle.status}</p>
                    <p><strong>Arbeitszeit:</strong> {selectedStelle.arbeitszeit_prozent}%</p>
                    <p><strong>Teilzeitoption:</strong> {selectedStelle.teilzeit_option ? 'Ja' : 'Nein'}</p>
                    <button onClick={() => setSelectedStelle(null)}>Schließen</button>
                </div>
            )}
        </div>
    );
};

export default Stellenanzeigen;
