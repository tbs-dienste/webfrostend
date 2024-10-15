import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';
import { Document, Page, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import './MitarbeiterAnzeigen.scss'; // Importiere die SCSS-Datei

// Styles für das PDF-Dokument
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    header: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 10,
        lineHeight: 1.5,
    },
    content: {
        marginBottom: 5,
    },
    signature: {
        marginTop: 30,
        fontSize: 12,
        fontStyle: 'italic',
    },
    date: {
        marginBottom: 20,
    },
});

const handleDownloadPDF = async (formData) => {
    const doc = (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>TBS Solutions</Text>
                <Text style={styles.header}>3001 Bern</Text>
                <Text style={styles.header}>Telefon: +41 123 456 789</Text>
                <Text style={styles.header}>Email: info@tbs-solutions.ch</Text>

                <Text style={styles.date}>
                    Bern, {new Date().toLocaleDateString()}
                </Text>

                <Text style={styles.section}>
                    An:
                    {'\n'}
                    {formData.vorname} {formData.nachname}
                    {'\n'}
                    {formData.adresse}
                    {'\n'}
                    {formData.postleitzahl} {formData.ort}
                </Text>

                <Text style={styles.section}>
                    Betreff: Bestätigung Ihrer Mitarbeiternummer und Zugangsdaten
                </Text>

                <Text style={styles.section}>
                    Sehr geehrte/r {formData.geschlecht === 'männlich' ? 'Herr' : formData.geschlecht === 'weiblich' ? 'Frau' : ''} {formData.nachname},
                </Text>

                <Text style={styles.section}>
                    Wir freuen uns, Ihnen mitzuteilen, dass Ihre Mitarbeiternummer und das zugehörige Benutzerkonto erfolgreich eingerichtet wurden.
                    Nachfolgend finden Sie Ihre Zugangsdaten:
                </Text>

                <Text style={styles.content}>
                    - Mitarbeiternummer: {formData.mitarbeiternummer}
                </Text>
                <Text style={styles.content}>
                    - Benutzername: {formData.benutzername}
                </Text>
                <Text style={styles.content}>
                    - Passwort: {formData.benutzername} (gleich dem Benutzernamen)
                </Text>

                <Text style={styles.section}>
                    Bei Fragen stehen wir Ihnen gerne zur Verfügung.
                </Text>

                <Text style={styles.signature}>
                    Mit freundlichen Grüßen,
                    {'\n'}TBS Solutions
                </Text>
            </Page>
        </Document>
    );

    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Bestaetigungsschreiben_${formData.vorname}_${formData.nachname}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
};

const MitarbeiterAnzeigen = () => {
    const { id } = useParams();
    const [selectedMitarbeiter, setSelectedMitarbeiter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
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
                const mitarbeiter = response.data.data;
                if (mitarbeiter) {
                    setSelectedMitarbeiter(mitarbeiter);
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

    const handleResetPassword = () => {
        window.location.href = `/mitarbeiter/${id}/reset-password`; // Weiterleitung zur Reset-Password-Seite
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
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

    if (loading) {
        return <div className="loading">Lade Mitarbeiter...</div>;
    }

    return (
        <div className="mitarbeiter-anzeigen-container">
            <h2>Mitarbeiterdetails anzeigen</h2>
            {selectedMitarbeiter ? (
                <div>
                    {editMode ? (
                        <div>
                            <label>Mitarbeiternummer</label>
                            <input type="text" name="mitarbeiternummer" value={formData.mitarbeiternummer} onChange={handleChange} />
                            <label>Vorname</label>
                            <input type="text" name="vorname" value={formData.vorname} onChange={handleChange} />
                            <label>Nachname</label>
                            <input type="text" name="nachname" value={formData.nachname} onChange={handleChange} />
                            <label>Adresse</label>
                            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
                            <label>PLZ</label>
                            <input type="text" name="postleitzahl" value={formData.postleitzahl} onChange={handleChange} />
                            <label>Ort</label>
                            <input type="text" name="ort" value={formData.ort} onChange={handleChange} />
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            <label>Mobil</label>
                            <input type="text" name="mobil" value={formData.mobil} onChange={handleChange} />
                            <label>Geschlecht</label>
                            <input type="text" name="geschlecht" value={formData.geschlecht} onChange={handleChange} />
                            <label>Benutzername</label>
                            <input type="text" name="benutzername" value={formData.benutzername} onChange={handleChange} />
                            <label>IBAN</label>
                            <input type="text" name="iban" value={formData.iban} onChange={handleChange} />
                            <button onClick={handleSave}>Speichern</button>
                        </div>
                    ) : (
                        <div>
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
                            <button onClick={handleEditToggle}>Bearbeiten</button>
                            <button onClick={handleDownloadPDF.bind(null, selectedMitarbeiter)}>PDF herunterladen <FaDownload /></button>
                            <button onClick={handleResetPassword}>Passwort zurücksetzen</button>
                        </div>
                    )}
                    <Link to="/mitarbeiter">Zurück zur Mitarbeiterübersicht</Link>
                </div>
            ) : (
                <p>Mitarbeiter nicht gefunden</p>
            )}
        </div>
    );
};

export default MitarbeiterAnzeigen;
