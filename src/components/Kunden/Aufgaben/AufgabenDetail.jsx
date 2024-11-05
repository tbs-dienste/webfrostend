import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link, useLocation } from 'react-router-dom'; 
import './AufgabenDetail.scss';

const AufgabenDetail = () => { 
    const { unteraufgabenId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const kundenId = queryParams.get('kundenId'); // Kunden-ID aus der URL abfragen
    const [unteraufgabe, setUnteraufgabe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnteraufgabe = async () => {
            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/unteraufgaben/${unteraufgabenId}`);
                setUnteraufgabe(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUnteraufgabe();
    }, [unteraufgabenId]);

    if (loading) return <p className="loading">Lade Unteraufgabe...</p>;
    if (error) return <p className="error">Fehler: {error}</p>;

    return (
        <div className="unteraufgabe-detail">
            {unteraufgabe ? (
                <>
                    <h1 className="detail-title">
                        <FontAwesomeIcon icon={faClipboardList} /> {unteraufgabe.titel}
                    </h1>
                    <div className="detail-info">
                        <div className="info-item">
                            <FontAwesomeIcon icon={faUser} />
                            <span> Mitarbeiter: {unteraufgabe.mitarbeiter_id || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faUser} />
                            <span> Admin: {unteraufgabe.admin_id || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span> Abgabedatum: {new Date(unteraufgabe.abgabedatum).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="description">
                        <h2>Beschreibung</h2>
                        <p>{unteraufgabe.beschreibung}</p>
                    </div>
                    <div className="status">
                        <h2>Status</h2>
                        <p>{unteraufgabe.status}</p>
                    </div>
                    <div className="schwierigkeitsgrad">
                        <h2>Schwierigkeitsgrad</h2>
                        <p>{unteraufgabe.schwierigkeitsgrad}</p>
                    </div>
                    {/* Link zur Kunden-ID */}
                    <Link to={`/aufgaben/${kundenId}`} className="back-link">
                        Zurück zu Kunden
                    </Link>
                </>
            ) : (
                <p className="no-data">Keine Daten für diese Unteraufgabe gefunden.</p>
            )}
        </div>
    );
};

export default AufgabenDetail;
