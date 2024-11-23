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
        geburtstagdatum: '', // Hinzugefügt
        verfügung: '',
        teilzeit_prozent: null,
        fähigkeiten: ''
    });

    // Daten des Mitarbeiters abrufen
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

    // Bearbeitungsmodus umschalten
    const handleEditToggle = () => {
        setEditMode(!editMode); // Umschalten zwischen Bearbeitungs- und Anzeige-Modus
    };

    // Änderungen speichern
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
    
            // Überprüfen, ob das Geburtsdatum vorhanden ist, andernfalls nicht in die Anfrage aufnehmen
            const updatedFormData = { ...formData };
            if (!updatedFormData.geburtstagdatum) {
                updatedFormData.geburtstagdatum = null;  // Geburtsdatum auf null setzen, wenn leer
            }
    
            // Sende die aktualisierten Daten an den Backend-Server
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`, updatedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            alert('Mitarbeiterdaten erfolgreich gespeichert');
            setEditMode(false);  // Verlasse den Bearbeitungsmodus
            setSelectedMitarbeiter(updatedFormData);  // Setze die geänderten Daten als aktuelle Mitarbeiterdaten
        } catch (error) {
            console.error('Fehler beim Speichern der Mitarbeiterdaten:', error);
            alert('Fehler beim Speichern der Daten. Bitte versuche es erneut.');
        }
    };

    // Eingabewerte ändern
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Ladezustand anzeigen
    if (loading) {
        return <div className="loading">Lädt...</div>;
    }

    // Funktion zum Formatieren des Geburtsdatums
    const formatDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString('de-DE');  // Format: DD.MM.YYYY
    };

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
                        <div key={field} className="input-group">
                            <label htmlFor={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            {field === 'geburtstagdatum' ? (
                                // Geburtsdatum als Date-Feld im Bearbeitungsmodus
                                <input
                                    type="date"
                                    id={field}
                                    name={field}
                                    value={formData[field] || ''}  // Fallback auf einen leeren String
                                    onChange={handleInputChange}
                                    className="input-date"
                                />
                            ) : (
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={formData[field] || ''}  // Fallback auf einen leeren String
                                    onChange={handleInputChange}
                                    className="input-text"
                                />
                            )}
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
                            <div key={field} className="info-group">
                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                {field === 'geburtstagdatum' ? (
                                    <p>{formatDate(selectedMitarbeiter[field])}</p>
                                ) : (
                                    <p>{selectedMitarbeiter[field]}</p>
                                )}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default MitarbeiterAnzeigen;
