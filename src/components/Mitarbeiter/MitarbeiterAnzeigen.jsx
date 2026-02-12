import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { jsPDF } from 'jspdf'; // Importiere jsPDF
import './MitarbeiterAnzeigen.scss'; // Importiere die SCSS-Datei

const MitarbeiterAnzeigen = () => {
    const navigate = useNavigate();

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
        geburtstagdatum: '',
        verfügung: '',
        teilzeit_prozent: null,
        fähigkeiten: ''
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
            const updatedFormData = { ...formData };
            if (!updatedFormData.geburtstagdatum) {
                updatedFormData.geburtstagdatum = null;  // Geburtsdatum auf null setzen, wenn leer
            }

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

    const toggleResetPassword = async () => {
        navigate(`/mitarbeiter/${id}/reset-password`)
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const generatePDF = () => {
        if (!selectedMitarbeiter) return;
    
        const doc = new jsPDF();
    
        // ===== HEADER =====
        doc.setFillColor(40, 40, 40);
        doc.rect(0, 0, 210, 25, "F");
    
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("Mitarbeiter Personalblatt", 20, 16);
    
        // Reset text color
        doc.setTextColor(0, 0, 0);
    
        // ===== FOTO =====
        doc.setDrawColor(150);
        doc.rect(150, 35, 40, 40);
    
        if (selectedMitarbeiter.foto) {
            doc.addImage(
                `data:image/png;base64,${selectedMitarbeiter.foto}`,
                "PNG",
                150,
                35,
                40,
                40
            );
        } else {
            doc.setFontSize(8);
            doc.text("Kein Foto", 160, 57);
        }
    
        // ===== TITEL =====
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Persönliche Daten", 20, 40);
    
        doc.setLineWidth(0.5);
        doc.line(20, 42, 140, 42);
    
        // ===== DATEN =====
        const fields = [
            ["Mitarbeiternummer", selectedMitarbeiter.mitarbeiternummer],
            ["Vorname", selectedMitarbeiter.vorname],
            ["Nachname", selectedMitarbeiter.nachname],
            ["Geschlecht", selectedMitarbeiter.geschlecht],
            ["Geburtstag", formatDate(selectedMitarbeiter.geburtstagdatum)],
            ["Adresse", selectedMitarbeiter.adresse],
            ["PLZ / Ort", `${selectedMitarbeiter.postleitzahl} ${selectedMitarbeiter.ort}`],
            ["Email", selectedMitarbeiter.email],
            ["Mobil", selectedMitarbeiter.mobil],
            ["Benutzername", selectedMitarbeiter.benutzername],
            ["IBAN", selectedMitarbeiter.iban],
            ["Teilzeit", selectedMitarbeiter.teilzeit_prozent ? `${selectedMitarbeiter.teilzeit_prozent}%` : "—"],
            ["Verfügbarkeit", selectedMitarbeiter.verfügung],
            ["Fähigkeiten", selectedMitarbeiter.fähigkeiten],
        ];
    
        let y = 50;
    
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
    
        fields.forEach(([label, value]) => {
            const displayValue = value || "—";
    
            doc.setFont("helvetica", "bold");
            doc.text(label + ":", 20, y);
    
            doc.setFont("helvetica", "normal");
            doc.text(String(displayValue), 70, y);
    
            y += 8;
        });
    
        // ===== TRENNLINIE =====
        doc.setDrawColor(180);
        doc.line(20, y + 5, 190, y + 5);
    
        // ===== FOOTER =====
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
            `Erstellt am: ${new Date().toLocaleDateString("de-DE")} | TBS Digital Solutions`,
            20,
            285
        );
    
        // ===== DATEINAME =====
        const filename = `Personalblatt_${selectedMitarbeiter.vorname}_${selectedMitarbeiter.nachname}.pdf`;
    
        doc.save(filename);
    };
    
    if (loading) {
        return <div className="loading">Lädt...</div>;
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString('de-DE');
    };

    return (
        <div className="mitarbeiter-anzeigen">
            <div className="header-section">
                <h2>Mitarbeiterdetails</h2>
    
                <button className="edit-button" onClick={handleEditToggle}>
                    {editMode ? 'Abbrechen' : 'Bearbeiten'} <FaEdit />
                </button>
    
                <button className="generate-pdf-button" onClick={generatePDF}>
                    PDF Generieren
                </button>
            </div>
    
            {/* FOTO ANZEIGE */}
            {selectedMitarbeiter?.foto && (
                <div className="foto-container">
                    <img
                        src={`data:image/png;base64,${selectedMitarbeiter.foto}`}
                        alt="Mitarbeiter"
                        className="mitarbeiter-foto"
                    />
                </div>
            )}
    
            {editMode ? (
                <div className="form-section">
                    {Object.keys(formData).map((field) => (
                        <div key={field} className="input-group">
                            <label htmlFor={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
    
                            {field === 'geburtstagdatum' ? (
                                <input
                                    type="date"
                                    id={field}
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleInputChange}
                                    className="input-date"
                                />
                            ) : (
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={formData[field] || ''}
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
                <div className="form-section">
                    {selectedMitarbeiter &&
                        Object.keys(selectedMitarbeiter).map((field) => {
                            if (field === "foto") return null; // Foto nicht doppelt anzeigen
    
                            return (
                                <div key={field} className="info-group">
                                    <label>
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
    
                                    {field === 'geburtstagdatum' && selectedMitarbeiter[field] ? (
                                        <p>{formatDate(selectedMitarbeiter[field])}</p>
                                    ) : (
                                        <p>{selectedMitarbeiter[field] || "—"}</p>
                                    )}
                                </div>
                            );
                        })}
    
                    <button className="edit-button" onClick={toggleResetPassword}>
                        <FaEdit /> Passwort zurücksetzen
                    </button>
                </div>
            )}
        </div>
    );
    
};

export default MitarbeiterAnzeigen;
