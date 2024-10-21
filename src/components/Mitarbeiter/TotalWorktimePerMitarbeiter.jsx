import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Importiere Axios
import './TotalWorktimePerMitarbeiterForCustomer.scss';

const TotalWorktimePerMitarbeiterForCustomer = () => {
    const { id } = useParams(); // Zugriff auf die Kunden-ID aus der URL
    const [worktimeData, setWorktimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorktimeData = async () => {
            const token = localStorage.getItem('token'); // Token aus localStorage abrufen

            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/total-mitarbeiter/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Token im Authorization-Header hinzufügen
                        'Content-Type': 'application/json' // Optional, je nach API-Anforderung
                    }
                });
                setWorktimeData(response.data.data); // Setze die Daten
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Fehler beim Abrufen der Daten'); // Fehlerbehandlung
            } finally {
                setLoading(false); // Ladezustand beenden
            }
        };

        fetchWorktimeData();
    }, [id]);

    if (loading) {
        return <div className="loading-message">Lade Daten...</div>;
    }

    if (error) {
        return <div className="error-message">Fehler: {error}</div>;
    }

    return (
        <div className="total-worktime-container">
            <h2>Gesamtarbeitszeit für Kunden-ID: {id}</h2>
            {worktimeData.length > 0 ? (
                worktimeData.map((mitarbeiter) => (
                    <div key={`${mitarbeiter.vorname}-${mitarbeiter.nachname}`} className="mitarbeiter-container">
                        <h3>
                            {mitarbeiter.vorname} {mitarbeiter.nachname}
                        </h3>
                        <table className="worktime-table">
                            <thead>
                                <tr>
                                    <th>Dienstleistung</th>
                                    <th>Gesamtarbeitszeit (Stunden)</th>
                                    <th>Kosten</th>
                                    <th>Dienstleistungspreis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mitarbeiter.dienstleistungen.map((dienstleistung, index) => (
                                    <tr key={index}>
                                        <td>{dienstleistung.dienstleistung}</td>
                                        <td>{dienstleistung.gesamtArbeitszeit.toFixed(2)}</td>
                                        <td>{dienstleistung.kosten.toFixed(2)} CHF</td>
                                        <td>{dienstleistung.dienstleistungsPreis} CHF</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="2"><strong>Gesamtpreis:</strong></td>
                                    <td>{mitarbeiter.gesamtPreis.toFixed(2)} CHF</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><strong>Ausgezahlter Betrag:</strong></td>
                                    <td>{mitarbeiter.ausgezahlterBetrag.toFixed(2)} CHF</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><strong>TBS Betrag:</strong></td>
                                    <td>{mitarbeiter.tbsBetrag.toFixed(2)} CHF</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div>Keine Daten verfügbar.</div>
            )}
        </div>
    );
};

export default TotalWorktimePerMitarbeiterForCustomer;
