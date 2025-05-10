import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Rechnung.scss';
import { FaCheckCircle } from "react-icons/fa";

const Rechnung = () => {
    const [rechnungen, setRechnungen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        const fetchRechnungen = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen');
                setRechnungen(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Rechnungen:', error);
                setError('Fehler beim Abrufen der Rechnungen. Bitte versuchen Sie es später erneut.');
            } finally {
                setLoading(false);
            }
        };
        fetchRechnungen();
    }, []);

    const filteredRechnungen = rechnungen.filter(rechnung => {
        const nummerOhnePrefix = rechnung.rechnungsnummer.replace('RE', '').trim();
        const matchesSearchTerm = nummerOhnePrefix.includes(searchTerm);
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(rechnung.status);

        return matchesSearchTerm && matchesStatus; // Filtern nach Suchbegriff und Status
    });

    const handleStatusChange = (status) => {
        setSelectedStatuses(prevSelected => 
            prevSelected.includes(status) ? prevSelected.filter(s => s !== status) : [...prevSelected, status]
        );
    };

    const statuses = ['Entwurf', 'Offen', 'Bezahlt', '1. Mahnstufe', '2. Mahnstufe', '3. Mahnstufe', 'Überfällig'];

    const handleDropdownChange = (event) => {
        const value = event.target.value;
        if (value === 'alle') {
            setSelectedStatuses([]); // Alle auswählen
        } else {
            setSelectedStatuses([value]);
        }
    };

    if (loading) {
        return <p>Lade Rechnungen...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="rechnung-container">
            <div className="top-section">
                {/* Link zum Erstellen einer neuen Rechnung */}
                <Link to="/rechnungform" className="add-rechnung-button">
                    + Neue Rechnung erstellen
                </Link>
    
                {/* Suchfeld für Rechnungsnummer */}
                <input 
                    type="text" 
                    placeholder="Rechnungsnummer suchen..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
    
            {/* Filter für Status */}
            <div className="status-filter">
                {/* Dropdown für kleinere Bildschirme */}
                <select onChange={handleDropdownChange} className="status-dropdown" defaultValue="">
                    <option value="" disabled>Status auswählen</option>
                    <option value="alle">Alle</option>
                    {statuses.map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
    
                {/* Checkboxen für größere Bildschirme */}
                {statuses.map(status => (
                    <div key={status} className="checkbox-item">
                        <input 
                            type="checkbox" 
                            id={status} 
                            checked={selectedStatuses.includes(status)} 
                            onChange={() => handleStatusChange(status)}
                        />
                        <label htmlFor={status}>{status}</label>
                    </div>
                ))}
            </div>
    
            {/* Liste der Rechnungen */}
            <div className="rechnung-list">
                {filteredRechnungen.length === 0 ? (
                    <p>Keine Rechnungen gefunden.</p>
                ) : (
                    filteredRechnungen.map(rechnung => (
                        <div key={rechnung.id} className="rechnung-card">
                            <div className="rechnung-info">
                                {/* Link zur Detailansicht der Rechnung */}
                                <Link to={`/rechnungen/${rechnung.id}`} className="rechnung-link">
                                    {rechnung.rechnungsnummer}
                                </Link>
                                <div className={`status-box status-${rechnung.status.toLowerCase().replace(/ /g, '-')}`}>
                                    <p className="status">{rechnung.status}</p>
                                </div>
    
                                {/* Icon für gesendete Rechnungen */}
                                <div className="gesendet-icon-wrapper">
                                    <div
                                        className={`gesendet-icon ${rechnung.gesendet ? 'gesendet-true' : 'gesendet-false'}`}
                                        title={rechnung.gesendet ? `Gesendet am ${new Date(rechnung.gesendet_am).toLocaleString()}` : 'Noch nicht gesendet'}
                                    >
                                        <FaCheckCircle />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
    
};

export default Rechnung;
