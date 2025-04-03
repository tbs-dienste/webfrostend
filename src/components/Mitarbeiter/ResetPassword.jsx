import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.scss'; // SCSS-Stylesheet importieren

const ResetPassword = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // ID aus der URL abrufen
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Ladezustand

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}/reset-password`,
                { newPasswort: newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage("Passwort erfolgreich geändert!");
            setError('');
            
            // ⏳ Nach 3 Sekunden zurück zur Mitarbeiteranzeige navigieren
            setTimeout(() => {
                navigate(`/mitarbeiteranzeigen/${id}`);
            }, 1000);

        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Zurücksetzen des Passworts.');
            setMessage('');
        } finally {
            setLoading(false);
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
        </div>
    );
};

export default ResetPassword;
