import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link, useLocation } from 'react-router-dom';
import './AufgabenDetail.scss';

const AufgabenDetail = () => {
    const { unteraufgabenId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const kundenId = queryParams.get('kundenId');
    const [unteraufgabe, setUnteraufgabe] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnteraufgabe = async () => {
            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/unteraufgabe/${unteraufgabenId}`);
                setUnteraufgabe(response.data.data);
                setFormData(response.data.data); // Initialisieren des Formulardatensatzes
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUnteraufgabe();
    }, [unteraufgabenId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/unteraufgabe/${unteraufgabenId}`, formData);
            setUnteraufgabe(formData);
            setEditMode(false);
        } catch (err) {
            setError('Fehler beim Speichern der Änderungen.');
        }
    };

    if (loading) return <p className="loading">Lade Unteraufgabe...</p>;
    if (error) return <p className="error">Fehler: {error}</p>;

    return (
        <div className="unteraufgabe-detail">
            {unteraufgabe ? (
                <>
                    <div className="header">
                        <h1 className="detail-title">
                            {editMode ? (
                                <input
                                    type="text"
                                    name="titel"
                                    value={formData.titel || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                unteraufgabe.titel
                            )}
                        </h1>
                        <button onClick={() => setEditMode(!editMode)}>
                            <FontAwesomeIcon icon={editMode ? faSave : faEdit} />
                        </button>
                    </div>
                    <div className="description">
                        <h2>Beschreibung</h2>
                        {editMode ? (
                            <textarea
                                name="beschreibung"
                                value={formData.beschreibung || ''}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <p>{unteraufgabe.beschreibung}</p>
                        )}
                    </div>
                    <div className="status">
                        <h2>Status</h2>
                        {editMode ? (
                            <input
                                type="text"
                                name="status"
                                value={formData.status || ''}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <p>{unteraufgabe.status}</p>
                        )}
                    </div>
                    <div className="schwierigkeitsgrad">
                        <h2>Schwierigkeitsgrad</h2>
                        {editMode ? (
                            <input
                                type="text"
                                name="schwierigkeitsgrad"
                                value={formData.schwierigkeitsgrad || ''}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <p>{unteraufgabe.schwierigkeitsgrad}</p>
                        )}
                    </div>
                    <div className="info-item">
                        <h2>Abgabedatum</h2>
                        {editMode ? (
                            <input
                                type="date"
                                name="abgabedatum"
                                value={formData.abgabedatum || ''}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <span>{unteraufgabe.abgabedatum || 'N/A'}</span>
                        )}
                    </div>
                    <div className="detail-info">
                        <h2>Mitarbeiter</h2>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faUser} />
                            {editMode ? (
                                <input
                                    type="text"
                                    name="mitarbeiter_id"
                                    value={formData.mitarbeiter_id || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span> Mitarbeiter: {unteraufgabe.mitarbeiter_id || 'N/A'}</span>
                            )}
                        </div>
                        <div className="info-item">
                            <FontAwesomeIcon icon={faUser} />
                            {editMode ? (
                                <input
                                    type="text"
                                    name="admin_id"
                                    value={formData.admin_id || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span> Admin: {unteraufgabe.admin_id || 'N/A'}</span>
                            )}
                        </div>
                    </div>
                    <div className="actions">
                        {editMode && (
                            <button className="save-button" onClick={handleSave}>
                                <FontAwesomeIcon icon={faSave} /> Speichern
                            </button>
                        )}
                    </div>
                    <Link to={`/aufgaben/${kundenId}`} className="back-link">
                        Zurück zu Aufgaben
                    </Link>
                </>
            ) : (
                <p className="no-data">Keine Details zur Unteraufgabe verfügbar.</p>
            )}
        </div>
    );
};

export default AufgabenDetail;
