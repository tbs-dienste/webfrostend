import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MitarbeiterAnzeigen.scss'; // Stil für diese Komponente
import { useParams } from 'react-router-dom'; // Importiere useParams
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const MitarbeiterAnzeigen = () => {
    const [mitarbeiter, setMitarbeiter] = useState(null);
    const [loading, setLoading] = useState(true); // Zustand für den Ladezustand
    const { id } = useParams(); // Nutze useParams, um auf die Route-Parameter zuzugreifen

    useEffect(() => {
        const fetchMitarbeiter = async () => {
            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${id}`);
                const data = response.data?.data; // Verwende optionalen Chaining für sicheren Zugriff
                if (data && data.length > 0) {
                    setMitarbeiter(data[0]); // Die Daten befinden sich im ersten Element des Arrays
                    setLoading(false); // Setze den Ladezustand auf false, wenn die Daten geladen sind
                } else {
                    setLoading(false);
                    console.error('Fehler: Keine Daten vorhanden.');
                }
            } catch (error) {
                console.error('Fehler beim Laden des Mitarbeiters:', error);
                setLoading(false); // Setze den Ladezustand auf false, auch im Fehlerfall
            }
        };
        fetchMitarbeiter();
    }, [id]); // Stelle sicher, dass useEffect auf Änderungen von 'id' reagiert

    const generatePDF = () => {
        if (mitarbeiter) {
            const doc = new jsPDF();

            // Format the letter
            doc.setFontSize(12);

            // Add address
            doc.text(`Firma XYZ`, 20, 20);
            doc.text(`Breitenrainstrasse 63`, 20, 26);
            doc.text(`3013 Bern`, 20, 32);
            doc.text(`Schweiz`, 20, 38);

            // Add date
            const today = new Date();
            const dateStr = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
            doc.text(dateStr, 160, 20);

            // Add recipient address
            doc.text(`${mitarbeiter.vorname} ${mitarbeiter.nachname}`, 20, 60);
            doc.text(`${mitarbeiter.adresse}`, 20, 66);
            doc.text(`${mitarbeiter.postleitzahl} ${mitarbeiter.ort}`, 20, 72);

            // Add greeting
            doc.text(`Sehr geehrte/r Frau/Herr ${mitarbeiter.nachname},`, 20, 100);

            // Add body
            doc.text(`Wir freuen uns, Ihnen mitteilen zu können, dass Sie als neuer Mitarbeiter bei uns anfangen werden.`, 20, 110);
            doc.text(`Hier sind Ihre Zugangsdaten für das interne System:`, 20, 116);
            doc.text(`Benutzername: ${mitarbeiter.benutzername}`, 20, 122);
            doc.text(`Passwort: ${mitarbeiter.passwort}`, 20, 128);

            // Add further text
            doc.text(`Bitte bewahren Sie diese Informationen sicher auf.`, 20, 138);
            doc.text(`Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.`, 20, 144);
            doc.text(`Wir freuen uns auf eine erfolgreiche Zusammenarbeit.`, 20, 150);

            // Add closing
            doc.text(`Mit freundlichen Grüßen,`, 20, 170);
            doc.text(`Firma XYZ`, 20, 176);

            doc.save(`Mitarbeiter_Brief_${mitarbeiter.id}.pdf`);
        }
    };

    return (
        <div className="mitarbeiter-details">
            {loading ? ( // Überprüfe den Ladezustand
                <p className="loading-message">Lade Mitarbeiterdetails...</p>
            ) : mitarbeiter ? ( // Überprüfe, ob Mitarbeiterdaten vorhanden sind
                <>
                    <h2 className="details-title">Mitarbeiterdetails</h2>
                    <div className="details-container">
                        <div className="detail">
                            <strong>Geschlecht:</strong> {mitarbeiter.geschlecht}
                        </div>
                        <div className="detail">
                            <strong>Vorname:</strong> {mitarbeiter.vorname}
                        </div>
                        <div className="detail">
                            <strong>Nachname:</strong> {mitarbeiter.nachname}
                        </div>
                        <div className="detail">
                            <strong>Adresse:</strong> {mitarbeiter.adresse}
                        </div>
                        <div className="detail">
                            <strong>Postleitzahl:</strong> {mitarbeiter.postleitzahl}
                        </div>
                        <div className="detail">
                            <strong>Ort:</strong> {mitarbeiter.ort}
                        </div>
                        <div className="detail">
                            <strong>Email:</strong> {mitarbeiter.email}
                        </div>
                        <div className="detail">
                            <strong>Mobil:</strong> {mitarbeiter.mobil}
                        </div>
                        <div className="detail">
                            <strong>Benutzername:</strong> {mitarbeiter.benutzername}
                        </div>
                        <div className="detail">
                            <strong>IBAN:</strong> {mitarbeiter.iban}
                        </div>
                        <div className="detail">
                            <strong>Sprachen:</strong> {mitarbeiter.sprache1}, {mitarbeiter.sprache2}
                        </div>
                    </div>
                    <button onClick={generatePDF} className="pdf-button">PDF generieren</button>
                </>
            ) : (
                <p className="error-message">Es konnten keine Mitarbeiterdetails gefunden werden.</p>
            )}
        </div>
    );
};

export default MitarbeiterAnzeigen;
