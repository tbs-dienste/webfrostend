import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CustomerCards.scss';

const CustomerCards = () => {
  const [kundenkarten, setKundenkarten] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCustomerCards = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten', {
          headers: {
            Authorization: `Bearer ${token}`
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
      <h2 className="text-2xl font-bold mb-4">Kundenkarten Übersicht</h2>
      <div className="mb-4">
        <Link to="/add-points" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Punkte Nachtragen
        </Link>
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Kundenkartennummer</th>
            <th className="p-3 border">Vorname</th>
            <th className="p-3 border">Nachname</th>
            <th className="p-3 border">PLZ</th>
            <th className="p-3 border">Ort</th>
            <th className="p-3 border">Punkte</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {kundenkarten.map((karte) => (
            <tr key={karte.kundenkartennummer} className="hover:bg-gray-50">
              <td className="p-3 border">{karte.kundenkartennummer}</td>
              <td className="p-3 border">{karte.vorname}</td>
              <td className="p-3 border">{karte.nachname}</td>
              <td className="p-3 border">{karte.plz}</td>
              <td className="p-3 border">{karte.ort}</td>
              <td className="p-3 border">{karte.punkte}</td>
              <td className="p-3 border">{karte.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerCards;
