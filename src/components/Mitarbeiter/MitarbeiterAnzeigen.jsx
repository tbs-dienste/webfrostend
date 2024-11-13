import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import './MitarbeiterAnzeigen.scss'; // Importiere die SCSS-Datei

const MitarbeiterAnzeigen = () => {
    const { id } = useParams();
    const [selectedMitarbeiter, setSelectedMitarbeiter] = useState(null);
    const [selectedChecklisteIds, setSelectedChecklisteIds] = useState([]); // Beispiel für die Definition der Variable
    const [checkliste, setCheckliste] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editModeCheckliste, setEditModeCheckliste] = useState(false); // Edit mode für Checkliste
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

    const handleResetPassword = () => {
        window.location.href = `/mitarbeiter/${id}/reset-password`;
    };

    // Handle Edit Mode für Checkliste
    const handleChecklisteEditToggle = () => {
        setEditModeCheckliste(!editModeCheckliste);
    };

    // Speichern der bearbeiteten Checkliste
    const handleSaveCheckliste = async () => {
        try {
            const token = localStorage.getItem('token');
            await Promise.all(
                checkliste.map((item) =>
                    axios.put(
                        `https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/checkliste/${item.id}`,
                        { erledigt: true },  // Nur den Status auf TRUE setzen
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )
                )
            );
            alert('Checkliste erfolgreich gespeichert');
            setEditModeCheckliste(false);
        } catch (error) {
            console.error('Fehler beim Speichern der Checkliste:', error);
            alert('Fehler beim Speichern der Checkliste. Bitte versuche es erneut.');
        }
    };

    if (loading) {
        return <div className="loading">Lade Mitarbeiter...</div>;
    }

    return (
        <div className="mitarbeiter-anzeigen-container">
            <h2>Mitarbeiterdetails anzeigen</h2>
            {selectedMitarbeiter ? (
                <div>
                    {editMode ? (
                        <div className="edit-form">
                            <label>Mitarbeiternummer</label>
                            <input type="text" name="mitarbeiternummer" value={formData.mitarbeiternummer} onChange={(e) => setFormData({ ...formData, mitarbeiternummer: e.target.value })} />
                            <label>Vorname</label>
                            <input type="text" name="vorname" value={formData.vorname} onChange={(e) => setFormData({ ...formData, vorname: e.target.value })} />
                            <label>Nachname</label>
                            <input type="text" name="nachname" value={formData.nachname} onChange={(e) => setFormData({ ...formData, nachname: e.target.value })} />
                            <label>Adresse</label>
                            <input type="text" name="adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                            <label>PLZ</label>
                            <input type="text" name="postleitzahl" value={formData.postleitzahl} onChange={(e) => setFormData({ ...formData, postleitzahl: e.target.value })} />
                            <label>Ort</label>
                            <input type="text" name="ort" value={formData.ort} onChange={(e) => setFormData({ ...formData, ort: e.target.value })} />
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <label>Mobil</label>
                            <input type="text" name="mobil" value={formData.mobil} onChange={(e) => setFormData({ ...formData, mobil: e.target.value })} />
                            <label>Geschlecht</label>
                            <input type="text" name="geschlecht" value={formData.geschlecht} onChange={(e) => setFormData({ ...formData, geschlecht: e.target.value })} />
                            <label>Benutzername</label>
                            <input type="text" name="benutzername" value={formData.benutzername} onChange={(e) => setFormData({ ...formData, benutzername: e.target.value })} />
                            <label>IBAN</label>
                            <input type="text" name="iban" value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} />
                            <button className="btn-save" onClick={handleSave}>Speichern</button>
                        </div>
                    ) : (
                        <div className="employee-details">
                            <p><strong>Mitarbeiternummer:</strong> {selectedMitarbeiter.mitarbeiternummer}</p>
                            <p><strong>Vorname:</strong> {selectedMitarbeiter.vorname}</p>
                            <p><strong>Nachname:</strong> {selectedMitarbeiter.nachname}</p>
                            <p><strong>Adresse:</strong> {selectedMitarbeiter.adresse}</p>
                            <p><strong>PLZ:</strong> {selectedMitarbeiter.postleitzahl}</p>
                            <p><strong>Ort:</strong> {selectedMitarbeiter.ort}</p>
                            <p><strong>Email:</strong> {selectedMitarbeiter.email}</p>
                            <p><strong>Mobil:</strong> {selectedMitarbeiter.mobil}</p>
                            <p><strong>Geschlecht:</strong> {selectedMitarbeiter.geschlecht}</p>
                            <p><strong>Benutzername:</strong> {selectedMitarbeiter.benutzername}</p>
                            <p><strong>IBAN:</strong> {selectedMitarbeiter.iban}</p>
                            <button onClick={handleEditToggle}><FaEdit /> Bearbeiten</button>
                            <button onClick={handleResetPassword}>Passwort zurücksetzen</button>

                            <h3>Checkliste</h3>
                            {/* Checkliste */}
                            <div className="checkliste-section">
                                <h3>Checkliste</h3>
                                <button onClick={handleChecklisteEditToggle} className="edit-button">
                                    {editModeCheckliste ? 'Speichern' : 'Bearbeiten'}
                                </button>
                                <ul className="checkliste">
                                    {checkliste.map((item) => (
                                        <li key={item.id} className={`checkliste-item ${item.erledigt ? 'completed' : ''}`}>
                                            {editModeCheckliste ? (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedChecklisteIds.includes(item.id)}
                                                    onChange={() => handleCheckboxChange(item.id)}
                                                />
                                            ) : (
                                                <span>{item.erledigt ? <FaCheck /> : '○'}</span>
                                            )}
                                            <span className="aufgabe-text">{item.aufgabe}</span>
                                        </li>
                                    ))}
                                </ul>
                                {editModeCheckliste && (
                                    <button onClick={handleSaveCheckliste} className="save-button">
                                        Änderungen speichern
                                    </button>
                                )}
                            </div>
                            
                            <button onClick={handleChecklisteEditToggle}><FaEdit /> Checkliste bearbeiten</button>
                        </div>
                    )}
                </div>
            ) : (
                <div>Mitarbeiter nicht gefunden</div>
            )}
        </div>
    );
};

export default MitarbeiterAnzeigen;
