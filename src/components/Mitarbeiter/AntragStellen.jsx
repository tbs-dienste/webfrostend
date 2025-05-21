import React, { useState } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaTrashAlt, FaPaperPlane } from 'react-icons/fa';
import './AntragStellen.scss';

const AntragStellen = () => {
    const [requests, setRequests] = useState([
        { description: '', isHoliday: false, isFreewish: false, startDate: '', endDate: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddRequest = () => {
        setRequests([...requests, { description: '', isHoliday: false, isFreewish: false, startDate: '', endDate: '' }]);
    };

    const handleRemoveRequest = (index) => {
        setRequests(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedRequests = [...requests];
        if (type === 'checkbox') {
            if (name === 'isHoliday') {
                updatedRequests[index].isHoliday = checked;
                if (checked) updatedRequests[index].isFreewish = false;
            } else if (name === 'isFreewish') {
                updatedRequests[index].isFreewish = checked;
                if (checked) updatedRequests[index].isHoliday = false;
            }
        } else {
            updatedRequests[index][name] = value;
        }
        setRequests(updatedRequests);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token nicht gefunden. Bitte einloggen!');
            setLoading(false);
            return;
        }
        try {
            await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/wunsch', { requests }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.href = "/alleantraege";
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Erstellen der Anträge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="antrag-container">
            <h1><FaPaperPlane className="icon-title" /> Antrag(e) stellen</h1>
            <form onSubmit={handleSubmit}>
                {requests.map((req, index) => (
                    <div key={index} className="antrag-card">
                        <div className="antrag-header">
                            <h2>Antrag {index + 1}</h2>
                            <button type="button" onClick={() => handleRemoveRequest(index)} className="icon-btn remove">
                                <FaTrashAlt /> Entfernen
                            </button>
                        </div>

                        <div className="form-row">
                            <label>Beschreibung</label>
                            <input
                                type="text"
                                name="description"
                                value={req.description}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Beschreiben Sie Ihren Antrag"
                                required
                            />
                        </div>

                        <div className="form-row checkboxes">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isHoliday"
                                    checked={req.isHoliday}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                Urlaubsantrag
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="isFreewish"
                                    checked={req.isFreewish}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                Freizeitwunsch
                            </label>
                        </div>

                        <div className="form-row date-row">
                            <div>
                                <label>Startdatum</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={req.startDate}
                                    onChange={(e) => handleInputChange(index, e)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Enddatum</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={req.endDate}
                                    onChange={(e) => handleInputChange(index, e)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="button-group">
                    <button type="button" onClick={handleAddRequest} className="icon-btn add">
                        <FaPlusCircle /> Neuen Antrag hinzufügen
                    </button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        <FaPaperPlane /> {loading ? 'Senden...' : 'Anträge einreichen'}
                    </button>
                </div>
                {error && <p className="error-msg">{error}</p>}
            </form>
        </div>
    );
};

export default AntragStellen;
