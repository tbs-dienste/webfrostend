import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MitarbeiterAnzeigen.scss'; // Stil für diese Komponente
import { useParams } from 'react-router-dom'; // Importiere useParams

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
                </>
            ) : (
                <p className="error-message">Es konnten keine Mitarbeiterdetails gefunden werden.</p>
            )}
        </div>
    );
};

export default MitarbeiterAnzeigen;
