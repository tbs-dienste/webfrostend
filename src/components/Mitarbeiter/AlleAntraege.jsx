import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AlleAntraege.scss';

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
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    }
                });

                if (response.data && response.data.data) {
                    const openRequests = response.data.data.filter(request => request.status === 'offen');
                    const acceptedRequests = response.data.data.filter(request => request.status === 'akzeptiert');
                    const rejectedRequests = response.data.data.filter(request => request.status === 'abgelehnt');

                    setRequests({
                        open: openRequests,
                        accepted: acceptedRequests,
                        rejected: rejectedRequests,
                    });
                } else {
                    setError("Datenformat stimmt nicht überein.");
                }
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

    const noRequestsMessage = (
        <div className="no-requests-message">
            <p>Es gibt keine Anträge von dir. Du kannst jetzt einen neuen Antrag stellen.</p>
            <Link to="/antrag" className="add-request-link">
                <button className="add-button">+</button> Neuer Antrag
            </Link>
        </div>
    );

    return (
        <div className="requests-container">
            <h1>Alle Anträge</h1>

            <div className="add-request-button">
                <Link to="/antrag" className="add-request-link">
                    <button className="add-button">+</button>
                    Neuer Antrag
                </Link>
            </div>

            <div className="requests-section">
                <h2>Offene Anträge</h2>
                {requests.open.length === 0 ? (
                    <div>{noRequestsMessage}</div>
                ) : (
                    <div className="request-boxes">
                        {requests.open.map((request) => (
                            <div key={request.id} className="request-box">
                                <p><strong>Mitarbeiter ID:</strong> {request.mitarbeiterId}</p>
                                <p><strong>Typ:</strong> {request.isHoliday ? 'Urlaub' : 'Freizeit'}</p>
                                <p><strong>Beschreibung:</strong> {request.description}</p>
                                <Link to={`/antragdetail/${request.id}`} className="request-link">
                                    Weitere Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {['accepted', 'rejected'].map((status) => (
                <div className="requests-section" key={status}>
                    <h2>{status === 'accepted' ? 'Akzeptierte' : 'Abgelehnte'} Anträge</h2>
                    {requests[status].length === 0 ? (
                        <p className="no-requests">Es wurden keine {status} Anträge gefunden.</p>
                    ) : (
                        <div className="request-boxes">
                            {requests[status].map((request) => (
                                <div key={request.id} className="request-box">
                                    <p><strong>Mitarbeiter ID:</strong> {request.mitarbeiterId}</p>
                                    <p><strong>Typ:</strong> {request.isHoliday ? 'Urlaub' : 'Freizeit'}</p>
                                    <p><strong>Beschreibung:</strong> {request.description}</p>
                                    <Link to={`/antragdetail/${request.id}`} className="request-link">
                                        Weitere Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AlleAntraege;
