import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaEdit } from 'react-icons/fa';
import './MitarbeiterAnzeigen.scss'; // Importiere die SCSS-Datei

const MitarbeiterAnzeigen = () => {
    const { id } = useParams();  // Zugriff auf die Mitarbeiter-ID aus der URL
    const [selectedMitarbeiter, setSelectedMitarbeiter] = useState(null);  // Mitarbeiterdaten
    const [loading, setLoading] = useState(true);  // Ladezustand
    const [editMode, setEditMode] = useState(false);  // Schalter für Bearbeitungsmodus
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
        geburtstagdatum: '' // Hinzugefügt
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

                if (mitarbeiter) {
                    setSelectedMitarbeiter(mitarbeiter);
                    setFormData(mitarbeiter); // Setze die Mitarbeiterdaten im Formular
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
        setEditMode(!editMode); // Umschalten zwischen Bearbeitungs- und Anzeige-Modus
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            // Sende die Daten an den Backend-Server
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Mitarbeiterdaten erfolgreich gespeichert');
            setEditMode(false);  // Verlasse den Bearbeitungsmodus
            setSelectedMitarbeiter(formData);  // Setze die geänderten Daten als aktuelle Mitarbeiterdaten
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

            {/* Edit Mode Form */}
            {editMode ? (
                <div className="form-section">
                    {Object.keys(formData).map((field) => (
                        <div key={field}>
                            <label htmlFor={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
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
                        <button className="save-button" onClick={handleSave}>
                            Speichern <FaCheck />
                        </button>
                    </div>
                </div>
            ) : (
                // Anzeige-Modus (nur Lesemodus)
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
        </div>
    );
};

export default MitarbeiterAnzeigen;
