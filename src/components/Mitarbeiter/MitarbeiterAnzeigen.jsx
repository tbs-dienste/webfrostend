import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import './MitarbeiterAnzeigen.scss'; // Importiere die SCSS-Datei

const MitarbeiterAnzeigen = () => {
    const { id } = useParams();
    const [selectedMitarbeiter, setSelectedMitarbeiter] = useState(null);
    const [selectedChecklisteIds, setSelectedChecklisteIds] = useState([]);
    const [checkliste, setCheckliste] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editModeCheckliste, setEditModeCheckliste] = useState(false);
    const [formData, setFormData] = useState({
        mitarbeiternummer: '',
        vorname: '',
        nachname: '',
        adresse: '',
        postleitzahl: '',
        ort: '',
        email: '',
        mobil: '',
        geschlecht: '',
        benutzername: '',
        iban: '',
    });

    useEffect(() => {
        async function fetchMitarbeiter() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const mitarbeiter = response.data.data.mitarbeiter;
                const checkliste = response.data.data.checkliste;

                if (mitarbeiter) {
                    setSelectedMitarbeiter(mitarbeiter);
                    setCheckliste(checkliste);
                    setFormData(mitarbeiter);
                } else {
                    console.error('Mitarbeiter nicht gefunden');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen des Mitarbeiters:', error);
                alert('Fehler beim Abrufen der Mitarbeiterdaten. Bitte versuche es später noch einmal.');
            } finally {
                setLoading(false);
            }
        }

        fetchMitarbeiter();
    }, [id]);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleCheckboxChange = (id) => {
        setSelectedChecklisteIds((prev) =>
            prev.includes(id)
                ? prev.filter((checkId) => checkId !== id)
                : [...prev, id]
        );
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Mitarbeiterdaten erfolgreich gespeichert');
            setEditMode(false);
            setSelectedMitarbeiter(formData);
        } catch (error) {
            console.error('Fehler beim Speichern der Mitarbeiterdaten:', error);
            alert('Fehler beim Speichern der Daten. Bitte versuche es erneut.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    if (loading) {
        return <div className="loading">Lädt...</div>;
    }

    return (
        <div className="mitarbeiter-anzeigen">
            <div className="header-section">
                <h2>Mitarbeiterdetails</h2>
                <button className="edit-button" onClick={handleEditToggle}>
                    {editMode ? 'Abbrechen' : 'Bearbeiten'} <FaEdit />
                </button>
            </div>
            {editMode ? (
                <div className="form-section">
                    {Object.keys(formData).map((field) => (
                        <div key={field}>
                            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type="text"
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                    <div className="button-group">
                        <button className="save-button" onClick={handleSave}>Speichern <FaCheck /></button>
                    </div>
                </div>
            ) : (
                <div className="form-section">
                    {selectedMitarbeiter &&
                        Object.keys(selectedMitarbeiter).map((field) => (
                            <div key={field}>
                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <p>{selectedMitarbeiter[field]}</p>
                            </div>
                        ))}
                </div>
            )}

            <div className="checklist-section">
                <h3>Checkliste</h3>
                {checkliste.map((item) => (
                    <div key={item.id} className="checklist-item">
                        <input
                            type="checkbox"
                            checked={selectedChecklisteIds.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                        />
                        <span>{item.aufgabe}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MitarbeiterAnzeigen;
