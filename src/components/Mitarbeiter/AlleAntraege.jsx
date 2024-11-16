import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Zum Erstellen von Links
import './AlleAntraege.scss'; // Import für benutzerdefiniertes Styling

const AlleAntraege = () => {
    const [requests, setRequests] = useState({
        open: [],
        accepted: [],
        rejected: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/wunsch', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Token für Authentifizierung
                    }
                });

                // Aufteilen der Anträge in verschiedene Statusgruppen
                const openRequests = response.data.data.filter(request => request.status === 'offen');
                const acceptedRequests = response.data.data.filter(request => request.status === 'akzeptiert');
                const rejectedRequests = response.data.data.filter(request => request.status === 'abgelehnt');

                setRequests({
                    open: openRequests,
                    accepted: acceptedRequests,
                    rejected: rejectedRequests,
                });
            } catch (err) {
                setError('Fehler beim Abrufen der Anträge. Bitte versuchen Sie es später erneut.');
                console.error('Fehler:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) {
        return <div className="loading">Lade Anträge...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="requests-container">
            <h1>Alle Anträge</h1>

            {/* Anzeige der offenen Anträge */}
            <div className="requests-section">
                <h2>Offene Anträge</h2>
                {requests.open.length === 0 ? (
                    <p className="no-requests">Es wurden keine offenen Anträge gefunden.</p>
                ) : (
                    <div className="request-boxes">
                        {requests.open.map((request) => (
                            <div key={request.id} className="request-box">
                                <p><strong>Mitarbeiter ID:</strong> {request.mitarbeiterId}</p>
                                <p><strong>Typ:</strong> {request.isHoliday ? 'Urlaub' : 'Freizeit'}</p>
                                <Link to={`/antragdetail/${request.id}`} className="request-link">
                                    Weitere Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Anzeige der akzeptierten Anträge */}
            <div className="requests-section">
                <h2>Akzeptierte Anträge</h2>
                {requests.accepted.length === 0 ? (
                    <p className="no-requests">Es wurden keine akzeptierten Anträge gefunden.</p>
                ) : (
                    <div className="request-boxes">
                        {requests.accepted.map((request) => (
                            <div key={request.id} className="request-box">
                                <p><strong>Mitarbeiter ID:</strong> {request.mitarbeiterId}</p>
                                <p><strong>Typ:</strong> {request.isHoliday ? 'Urlaub' : 'Freizeit'}</p>
                                <Link to={`/antragdetail/${request.id}`} className="request-link">
                                    Weitere Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Anzeige der abgelehnten Anträge */}
            <div className="requests-section">
                <h2>Abgelehnte Anträge</h2>
                {requests.rejected.length === 0 ? (
                    <p className="no-requests">Es wurden keine abgelehnten Anträge gefunden.</p>
                ) : (
                    <div className="request-boxes">
                        {requests.rejected.map((request) => (
                            <div key={request.id} className="request-box">
                                <p><strong>Mitarbeiter ID:</strong> {request.mitarbeiterId}</p>
                                <p><strong>Typ:</strong> {request.isHoliday ? 'Urlaub' : 'Freizeit'}</p>
                                <Link to={`/antragdetail/${request.id}`} className="request-link">
                                    Weitere Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlleAntraege;
