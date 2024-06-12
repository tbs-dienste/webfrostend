import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MitarbeiterAnzeigen.scss'; // Stil für diese Komponente
import { useParams } from 'react-router-dom'; // Importiere useParams
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../../logo.png';

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

            // Add logo image
            const img = new Image();
            img.src = logo;
            doc.addImage(img, 'PNG', 10, 10, 50, 20);

            // Add company address
            doc.setFontSize(12);
            doc.text(`TBs Solutions`, 170, 20, { align: 'right' });
            doc.text(`3013 Bern`, 170, 26, { align: 'right' });
            doc.text(`Schweiz`, 170, 32, { align: 'right' });

            // Add date
            const today = new Date();
            const dateStr = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
            doc.text(dateStr, 150, 50, { align: 'right' });

            // Add recipient address
            doc.text(`${mitarbeiter.vorname} ${mitarbeiter.nachname}`, 20, 70);
            doc.text(`${mitarbeiter.adresse}`, 20, 76);
            doc.text(`${mitarbeiter.postleitzahl} ${mitarbeiter.ort}`, 20, 82);

            // Add subject
            doc.setFontSize(14);
            doc.text(`Betreff: Ihre Anstellung bei TBs Solutions`, 20, 100);

            // Add greeting
            doc.setFontSize(12);
            doc.text(`Sehr geehrte/r Frau/Herr ${mitarbeiter.nachname},`, 20, 120);

            // Add body
            const textBody = `Wir freuen uns, Ihnen mitteilen zu können, dass Sie als neuer Mitarbeiter bei uns anfangen werden. Hier sind Ihre Zugangsdaten für das interne System:\n\nBenutzername: ${mitarbeiter.benutzername}\nPasswort: ${mitarbeiter.passwort}\n\nBitte bewahren Sie diese Informationen sicher auf. Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Wir freuen uns auf eine erfolgreiche Zusammenarbeit.`;
            doc.text(textBody, 20, 130, { maxWidth: 170 });

            // Add closing
            doc.text(`Mit freundlichen Grüßen,`, 20, 190);
            doc.text(`Timo Blumer`, 20, 212);
            doc.text(`TBs Solutions`, 20, 218);

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
                            <strong>Passwort:</strong> {mitarbeiter.passwort}
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
