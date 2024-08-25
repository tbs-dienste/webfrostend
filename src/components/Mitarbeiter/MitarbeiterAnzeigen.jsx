import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MitarbeiterAnzeigen.scss';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaEdit, FaUndoAlt, FaSave, FaFilePdf } from 'react-icons/fa';
import logo from '../../logo.png';

const MitarbeiterAnzeigen = () => {
    const [mitarbeiter, setMitarbeiter] = useState(null);
    const [editedMitarbeiter, setEditedMitarbeiter] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchMitarbeiter = async () => {
            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`);
                const data = response.data.data;
                setMitarbeiter(data || null);
                setEditedMitarbeiter(data || null);
                setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden des Mitarbeiters:', error);
                setLoading(false);
            }
        };
        fetchMitarbeiter();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUndoClick = () => {
        setEditedMitarbeiter(mitarbeiter);
        setIsEditing(false);
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`, editedMitarbeiter);
            setMitarbeiter(editedMitarbeiter);
            setIsEditing(false);
        } catch (error) {
            console.error('Fehler beim Speichern der Mitarbeiterdaten:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedMitarbeiter({
            ...editedMitarbeiter,
            [name]: value,
        });
    };

    const generatePDF = () => {
        if (mitarbeiter) {
            const doc = new jsPDF();

            const img = new Image();
            img.src = logo;
            doc.addImage(img, 'PNG', 10, 10, 50, 20);

            doc.setFontSize(12);
            doc.text(`TBs Solutions`, 170, 20, { align: 'right' });
            doc.text(`3013 Bern`, 170, 26, { align: 'right' });
            doc.text(`Schweiz`, 170, 32, { align: 'right' });

            const today = new Date();
            const dateStr = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
            doc.text(dateStr, 150, 50, { align: 'right' });

            doc.text(`${mitarbeiter.vorname} ${mitarbeiter.nachname}`, 20, 70);
            doc.text(`${mitarbeiter.adresse}`, 20, 76);
            doc.text(`${mitarbeiter.postleitzahl} ${mitarbeiter.ort}`, 20, 82);

            doc.setFontSize(14);
            doc.text(`Betreff: Ihre Anstellung bei TBs Solutions`, 20, 100);

            doc.setFontSize(12);
            doc.text(`Sehr geehrte/r Frau/Herr ${mitarbeiter.nachname},`, 20, 120);

            const textBody = `Wir freuen uns, Ihnen mitteilen zu können, dass Sie als neuer Mitarbeiter bei uns anfangen werden. Hier sind Ihre Zugangsdaten für das interne System:\n\nBenutzername: ${mitarbeiter.benutzername}\nPasswort: ${mitarbeiter.passwort}\n\nBitte bewahren Sie diese Informationen sicher auf. Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Wir freuen uns auf eine erfolgreiche Zusammenarbeit.`;
            doc.text(textBody, 20, 130, { maxWidth: 170 });

            doc.text(`Mit freundlichen Grüßen,`, 20, 190);
            doc.text(`Timo Blumer`, 20, 212);
            doc.text(`TBs Solutions`, 20, 218);

            doc.save(`Mitarbeiter_Brief_${mitarbeiter.id}.pdf`);
        }
    };

    return (
        <div className="mitarbeiter-details">
            {loading ? (
                <p className="loading-message">Lade Mitarbeiterdetails...</p>
            ) : mitarbeiter ? (
                <>
                    <h2 className="details-title">Mitarbeiterdetails</h2>
                    <div className="details-container">
                        {Object.entries({
                            Geschlecht: editedMitarbeiter.geschlecht,
                            Vorname: editedMitarbeiter.vorname,
                            Nachname: editedMitarbeiter.nachname,
                            Adresse: editedMitarbeiter.adresse,
                            Postleitzahl: editedMitarbeiter.postleitzahl,
                            Ort: editedMitarbeiter.ort,
                            Email: editedMitarbeiter.email,
                            Mobil: editedMitarbeiter.mobil,
                            Benutzername: editedMitarbeiter.benutzername,
                            Passwort: editedMitarbeiter.passwort,
                            IBAN: editedMitarbeiter.iban,
                            Sprachen: `${editedMitarbeiter.sprache1}, ${editedMitarbeiter.sprache2}`,
                        }).map(([key, value]) => (
                            <div className="detail" key={key}>
                                <span className="detail-key">{key}:</span>
                                {isEditing ? (
                                    <input
                                        className="detail-value-input"
                                        type="text"
                                        name={key.toLowerCase()}
                                        value={value}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span className="detail-value">{value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="button-group">
                        <button onClick={generatePDF} className="action-button pdf-button">
                            <FaFilePdf /> PDF generieren
                        </button>
                        {isEditing ? (
                            <>
                                <button onClick={handleSaveClick} className="action-button save-button">
                                    <FaSave /> Speichern
                                </button>
                                <button onClick={handleUndoClick} className="action-button undo-button">
                                    <FaUndoAlt /> Änderungen rückgängig machen
                                </button>
                            </>
                        ) : (
                            <button onClick={handleEditClick} className="action-button edit-button">
                                <FaEdit /> Bearbeiten
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p className="error-message">Es konnten keine Mitarbeiterdetails gefunden werden.</p>
            )}
        </div>
    );
};

export default MitarbeiterAnzeigen;
