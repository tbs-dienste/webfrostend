import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TotalWorktimePerMitarbeiterForCustomer.scss';

const TotalWorktimePerMitarbeiterForCustomer = () => {
    const { id } = useParams();
    const [worktimeData, setWorktimeData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const roundToNearest05 = (value) => Math.round(value * 20) / 20;

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                const worktimeResponse = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/total-mitarbeiter/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setWorktimeData(worktimeResponse.data.data);

                const customerResponse = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setCustomerData(customerResponse.data.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Fehler beim Abrufen der Daten');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="loading-message">Lade Daten...</div>;
    if (error) return <div className="error-message">Fehler: {error}</div>;

    // Calculate the 80%-20% split for both employee and TBS Solutions
    const totalEarnings = customerData ? customerData.totalKosten : 0;
    const employee80Percent = roundToNearest05(totalEarnings * 0.8);
    const tbs20Percent = roundToNearest05(totalEarnings * 0.2);

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
                                    <td colSpan="2"><strong>80% des Betrags an Mitarbeiter:</strong></td>
                                    <td>{employee80Percent.toFixed(2)} CHF</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><strong>20% des Betrags an TBS Solutions:</strong></td>
                                    <td>{tbs20Percent.toFixed(2)} CHF</td>
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
