import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Zum Abrufen der URL-Parameter
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa'; // React Icons
import "./AntragDetail.scss";

const AntragDetail = () => {
    const { wunschId } = useParams(); // URL-Parameter 'wunschId' abrufen
    const [antrag, setAntrag] = useState(null);
    const [accepted, setAccepted] = useState(null);
    const [rejected, setRejected] = useState(null);
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [userRole, setUserRole] = useState(''); // Benutzerrolle

    useEffect(() => {
        // Benutzerrolle aus dem Token im LocalStorage extrahieren
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserRole(decodedToken.userType); // Benutzerrolle extrahieren
        }

        // Antragdetails anhand der wunschId laden
        const fetchAntrag = async () => {
            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/wunsch/${wunschId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Bearer Token hinzufügen
                    }
                });
                setAntrag(response.data.data);
            } catch (error) {
                console.error('Fehler beim Abrufen des Antrags:', error);
                setMessage('Fehler beim Abrufen des Antrags.');
            }
        };

        fetchAntrag();
    }, [wunschId]);

    const handleStatusUpdate = async () => {
        // Überprüfe, ob akzeptiert und abgelehnt gleichzeitig aktiviert sind
        if ((accepted && rejected) || (reason === '' && (accepted || rejected))) {
            setMessage('Ein Fehler ist aufgetreten: Beide Zustimmungen (akzeptiert und abgelehnt) sind nicht erlaubt oder ein Grund fehlt.');
            return;
        }

        try {
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/wunsch/status/${wunschId}`, {
                accepted,
                rejected,
                reason
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Bearer Token für die PUT-Anfrage hinzufügen
                }
            });
            setMessage('Antragstatus erfolgreich aktualisiert.');
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Antragstatus:', error);
            setMessage('Fehler beim Aktualisieren des Antragstatus.');
        }
    };

    if (!antrag) {
        return <div className="loading">Lädt...</div>;
    }

    return (
        <div className="wunsch-antrag-status">
            <h2 className="title">Wunsch-Antrag Details</h2>

            <div className="antrag-details">
                <div className="antrag-info">
                    <p><strong>Beschreibung:</strong> {antrag.description}</p>
                    <p><strong>Urlaub:</strong> {antrag.isHoliday ? 'Ja' : 'Nein'}</p>
                    <p><strong>Freien Wunsch:</strong> {antrag.isFreewish ? 'Ja' : 'Nein'}</p>
                    <p><strong>Startdatum:</strong> {new Date(antrag.startDate).toLocaleDateString()}</p>
                    <p><strong>Enddatum:</strong> {new Date(antrag.endDate).toLocaleDateString()}</p>
                </div>

                {/* Anzeige der Buttons nur für Administratoren */}
                {userRole === 'admin' ? (
                    <div className="actions">
                        <button
                            className="accept-btn"
                            onClick={() => { setAccepted(true); setRejected(false); }}
                            disabled={accepted === true}
                        >
                            <FaCheckCircle /> Akzeptieren
                        </button>
                        <button
                            className="reject-btn"
                            onClick={() => { setRejected(true); setAccepted(false); }}
                            disabled={rejected === true}
                        >
                            <FaTimesCircle /> Ablehnen
                        </button>
                        {accepted || rejected ? (
                            <div className="reason-input">
                                <label htmlFor="reason">Grund:</label>
                                <textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Geben Sie einen Grund ein"
                                ></textarea>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="no-access-message">
                        <p>Sie haben keine Berechtigung, diesen Antrag zu bearbeiten.</p>
                    </div>
                )}

                {userRole === 'admin' && (
                    <div className="update-btn">
                        <button onClick={handleStatusUpdate}>Status aktualisieren</button>
                    </div>
                )}

                {message && <div className="message">{message}</div>}
            </div>
        </div>
    );
};

export default AntragDetail;
