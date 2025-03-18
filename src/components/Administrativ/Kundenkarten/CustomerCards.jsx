import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import './CustomerCards.scss';

const CustomerCards = () => {
    const [kundenkarten, setKundenkarten] = useState([]);
    const token = localStorage.getItem('token'); // Bearer Token aus dem Local Storage holen

    // Kundenkarten abrufen
    useEffect(() => {
        const fetchCustomerCards = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten', {
                    headers: {
                        Authorization: `Bearer ${token}` // Bearer Token in den Header setzen
                    }
                });

                if (response.data.status === 'success') {
                    setKundenkarten(response.data.kundenkarten);
                   
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Kundenkarten:', error);
            }
        };

        fetchCustomerCards();
    }, [token]);

    


    return (
        <div className="customer-card-table">
            <h2>Kundenkarten</h2>
            <table>
                <thead>
                    <tr>
                        <th>Kundenkartennummer</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>PLZ</th>
                        <th>Ort</th>
                        <th>Punkte</th>
                        <th>Status</th>
                      
                    </tr>
                </thead>
                <tbody>
                    {kundenkarten.map((karte) => (
                        <tr key={karte.kundenkartennummer}>
                            <td>{karte.kundenkartennummer}</td>
                            <td>{karte.vorname}</td>
                            <td>{karte.nachname}</td>
                            <td>{karte.plz}</td>
                            <td>{karte.ort}</td>
                            <td>{karte.punkte}</td>
                            <td>{karte.status}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerCards;
