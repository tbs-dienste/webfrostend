import React, { useState } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa'; // Icons für "Hinzufügen" und "Löschen"
import './AntragStellen.scss';

const AntragStellen = () => {
    const [requests, setRequests] = useState([
        {
            description: '',
            isHoliday: false,
            isFreewish: false,
            startDate: '',
            endDate: '',
        },
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Add a new request entry
    const handleAddRequest = () => {
        setRequests([
            ...requests,
            {
                description: '',
                isHoliday: false,
                isFreewish: false,
                startDate: '',
                endDate: '',
            },
        ]);
    };

    // Remove a specific request entry
    const handleRemoveRequest = (index) => {
        const newRequests = requests.filter((_, i) => i !== index);
        setRequests(newRequests);
    };

    // Handle input changes for each field
    const handleInputChange = (index, event) => {
        const { name, checked, type, value } = event.target;
        const newRequests = [...requests];

        if (type === 'checkbox') {
            if (name === 'isHoliday') {
                newRequests[index].isHoliday = checked;
                if (checked) newRequests[index].isFreewish = false;
            }
            if (name === 'isFreewish') {
                newRequests[index].isFreewish = checked;
                if (checked) newRequests[index].isHoliday = false;
            }
        } else {
            newRequests[index][name] = value;
        }

        setRequests(newRequests);
    };

    // Submit the requests with the Bearer token
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token nicht gefunden. Bitte einloggen!');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/wunsch',
                { requests },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            window.location.href = "/alleantraege";
        } catch (error) {
            setError(error.response?.data?.error || 'Fehler beim Erstellen der Anträge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="antrag-stellen">
            <h2 className="title">Antrag(e) stellen</h2>
            <form onSubmit={handleSubmit}>
                {requests.map((request, index) => (
                    <div key={index} className="request-form">
                        <div className="input-group">
                            <label>Beschreibung</label>
                            <input
                                type="text"
                                name="description"
                                value={request.description}
                                onChange={(event) => handleInputChange(index, event)}
                                placeholder="Beschreiben Sie Ihren Antrag"
                                required
                            />
                        </div>

                        <div className="checkbox-group">
                            <div className="checkbox">
                                <label>Urlaubsantrag</label>
                                <input
                                    type="checkbox"
                                    name="isHoliday"
                                    checked={request.isHoliday}
                                    onChange={(event) => handleInputChange(index, event)}
                                />
                            </div>
                            <div className="checkbox">
                                <label>Freizeitwunsch</label>
                                <input
                                    type="checkbox"
                                    name="isFreewish"
                                    checked={request.isFreewish}
                                    onChange={(event) => handleInputChange(index, event)}
                                />
                            </div>
                        </div>

                        <div className="date-inputs">
                            <div className="input-group">
                                <label>Startdatum</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={request.startDate}
                                    onChange={(event) => handleInputChange(index, event)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Enddatum</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={request.endDate}
                                    onChange={(event) => handleInputChange(index, event)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleRemoveRequest(index)}
                            className="remove-btn"
                        >
                            <FaTrashAlt /> Antrag entfernen
                        </button>
                    </div>
                ))}
                <div className="action-buttons">
                    <button
                        type="button"
                        onClick={handleAddRequest}
                        className="add-btn"
                    >
                        <FaPlusCircle /> Neuen Antrag hinzufügen
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Sende...' : 'Anträge einreichen'}
                    </button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AntragStellen;
