import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import './Stellenanzeigen.scss';

const Stellenanzeigen = () => {
    const [stellen, setStellen] = useState([]);
    const [filteredStellen, setFilteredStellen] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Initialisiere die Komponenten und lade Stellenausschreibungen
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
                
                // Filtere Stellen für nicht-Admin-Nutzer
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

    // Filter für Stellenanzeigen je nach Status
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

    // Navigiere zu Detailansicht der Stelle
    const handleMehrErfahren = (stelleId) => {
        navigate(`/stellen-detail/${stelleId}`);
    };

    return (
        <div className="stellen-container">
            <h1 className="stellen-title">Starte Deine Karriere bei uns – Deine Zukunft beginnt hier!</h1>
            <p className="stellen-intro">
                Entdecke spannende Möglichkeiten, die genau zu Deinem Profil passen. Werde Teil eines dynamischen Teams und entwickle Dich in einer herausfordernden und fördernden Arbeitsumgebung.
            </p>

            {/* Admin-Filterbuttons für den Status */}
            {isAdmin && (
                <div className="filter-buttons">
                    <button onClick={() => filterStellen('')} className={statusFilter === '' ? 'active' : ''}>Alle</button>
                    <button onClick={() => filterStellen('Entwurf')} className={statusFilter === 'Entwurf' ? 'active' : ''}>Entwurf</button>
                    <button onClick={() => filterStellen('Veröffentlicht')} className={statusFilter === 'Veröffentlicht' ? 'active' : ''}>Veröffentlicht</button>
                    <button onClick={() => filterStellen('Abgeschlossen')} className={statusFilter === 'Abgeschlossen' ? 'active' : ''}>Abgeschlossen</button>
                </div>
            )}

            {/* Anzeige der Stellenanzeigen */}
            {filteredStellen.length === 0 ? (
                <p className="no-stellen">Aktuell gibt es keine offenen Stellen – aber bleib dran! Schicke uns Deine Bewerbung und werde Teil des nächsten Teams!</p>
            ) : (
                <ul className="stellen-list">
                    {filteredStellen.map((stelle) => (
                        <li className="stellen-item" key={stelle.id}>
                            <div className="stellen-header">
                                <h2 className="stellen-bezeichnung">{stelle.bezeichnung}</h2>
                                {isAdmin && (
                                    <span className={`status ${stelle.status.toLowerCase()}`}>{stelle.status}</span>
                                )}
                            </div>

                            <p className="stellen-detail"><strong>Abteilung:</strong> {stelle.abteilung_name}</p>
                            <p className="stellen-detail"><strong>Startdatum:</strong> {new Date(stelle.start_datum).toLocaleDateString()}</p>
                            
                            
                            {/* Hinweis zu Arbeitszeiten und Optionen */}
                            <p className="stellen-detail">
                                <strong>Arbeitszeit:</strong> {stelle.arbeitszeit_prozent}% - {stelle.teilzeit_option ? 'Teilzeitoption verfügbar' : 'Vollzeit'}
                            </p>

                            <button 
                                className="mehr-erfahren-button" 
                                onClick={() => handleMehrErfahren(stelle.id)}
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
