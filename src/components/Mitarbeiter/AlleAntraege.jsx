import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlleAntraege.scss'; // Import für benutzerdefiniertes Styling

const AlleAntraege = () => {
    const [requests, setRequests] = useState([]);
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
                // Filtert nur die offenen Anträge
                const openRequests = response.data.data.filter(request => !request.accepted && !request.rejected);
                setRequests(openRequests);
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
            <h1>Offene Anträge</h1>
            {requests.length === 0 ? (
                <p className="no-requests">Es wurden keine offenen Anträge gefunden.</p>
            ) : (
                <div className="request-boxes">
                    {requests.map((request) => (
                        <div key={request.id} className="request-box">
                            <p><strong>Mitarbeiter ID:</strong> {request.mitarbeiterId}</p>
                            <p><strong>Typ:</strong> {request.isHoliday ? 'Urlaub' : 'Freizeit'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlleAntraege;
