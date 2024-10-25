import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Importiere Axios
import './TotalWorktimePerMitarbeiterForCustomer.scss';

const TotalWorktimePerMitarbeiterForCustomer = () => {
    const { id } = useParams(); // Zugriff auf die Mitarbeiter-ID aus der URL
    const [worktimeData, setWorktimeData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funktion zum Runden auf das nächste 0.05
    const roundToNearest05 = (value) => {
        return Math.round(value * 20) / 20; // Runden auf 0.05
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Token aus localStorage abrufen

            try {
                // Zuerst Arbeitszeitdaten abrufen
                const worktimeResponse = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/total-mitarbeiter/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Token im Authorization-Header hinzufügen
                        'Content-Type': 'application/json' // Optional, je nach API-Anforderung
                    }
                });
                setWorktimeData(worktimeResponse.data.data); // Setze die Arbeitszeitdaten

                // Nach erfolgreichem Abruf der Arbeitszeitdaten, Kundeninformationen abrufen
                const customerResponse = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, { // Verwende die gleiche ID für den Kunden
                    headers: {
                        'Authorization': `Bearer ${token}`, // Token im Authorization-Header hinzufügen
                        'Content-Type': 'application/json' // Optional, je nach API-Anforderung
                    }
                });
                setCustomerData(customerResponse.data.data); // Setze die Kundendaten
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Fehler beim Abrufen der Daten'); // Fehlerbehandlung
            } finally {
                setLoading(false); // Ladezustand beenden
            }
        };

        fetchData();
    }, [id]); // Nur die Mitarbeiter-ID als Abhängigkeit

    if (loading) {
        return <div className="loading-message">Lade Daten...</div>;
    }

    if (error) {
        return <div className="error-message">Fehler: {error}</div>;
    }

    return (
        <div className="total-worktime-container">
            <h2>Gesamtarbeitszeit für Mitarbeiter-ID: {id}</h2>

            <h3>Kundendetails</h3>
            {customerData ? (
                <>
                    <p><strong>Kunden-ID:</strong> {customerData.id}</p>
                    <h4>Dienstleistungen</h4>
                    {customerData.dienstleistungen.length > 0 ? (
                        <table className="worktime-table">
                            <thead>
                                <tr>
                                    <th>Dienstleistung</th>
                                    <th>Gesamtarbeitszeit (Stunden)</th>
                                    <th>Kosten</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerData.dienstleistungen.map((dienstleistung) => (
                                    <tr key={dienstleistung.id}>
                                        <td>{dienstleistung.title}</td>
                                        <td>{dienstleistung.gesamtArbeitszeit?.toFixed(2) || '0.00'}</td>
                                        <td>{roundToNearest05(dienstleistung.kosten).toFixed(2) || '0.00'} CHF</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="2"><strong>Gesamtpreis:</strong></td>
                                    <td>{roundToNearest05(customerData.totalKosten).toFixed(2) || '0.00'} CHF</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><strong>Ausgezahlter Betrag:</strong></td>
                                    <td>{roundToNearest05(customerData.totalKostenMitMwst).toFixed(2) || '0.00'} CHF</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <div>Keine Dienstleistungen verfügbar.</div>
                    )}
                </>
            ) : (
                <p>Kundendetails nicht verfügbar.</p>
            )}
        </div>
    );
};

export default TotalWorktimePerMitarbeiterForCustomer;
