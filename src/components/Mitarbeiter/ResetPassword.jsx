import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './ResetPassword.scss'; // SCSS-Stylesheet importieren

const ResetPassword = () => {
    const { id } = useParams(); // ID von der URL abrufen
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading State

    const handleResetPassword = async () => {
        setLoading(true); // Ladezustand aktivieren
        try {
            const token = localStorage.getItem('token'); // Token aus localStorage abrufen
            const response = await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}/reset-password`, {
                newPasswort: newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Token im Header hinzufügen
                },
            });

            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Zurücksetzen des Passworts.');
            setMessage('');
        } finally {
            setLoading(false); // Ladezustand deaktivieren
        }
    };

    return (
        <div className="reset-password-container">
            <h3>Passwort zurücksetzen für Mitarbeiter-ID: {id}</h3>
            <input
                type="password"
                placeholder="Neues Passwort"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Lädt...' : 'Passwort zurücksetzen'}
            </button>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <Link to={`/mitarbeiter/${id}`} className="back-link">Zurück zu Mitarbeiter anzeigen</Link> {/* Link zur Mitarbeiter-Anzeige */}
        </div>
    );
};

export default ResetPassword;
