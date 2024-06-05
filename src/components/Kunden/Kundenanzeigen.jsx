import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './KundenAnzeigen.scss';

const KundenAnzeigen = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKunde() {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`);
        console.log('API-Daten:', response.data);
        setSelectedKunde(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching kunde:', error);
        setLoading(false);
      }
    }

    fetchKunde();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="kunde-anzeigen-container">
      {selectedKunde ? (
        <div className="kunde-anzeigen">
          <h2>Kundendetails</h2>
          <p><strong>Vorname:</strong> {selectedKunde.vorname}</p>
          <p><strong>Nachname:</strong> {selectedKunde.nachname}</p>
          <p><strong>Strasse und Hausnummer:</strong> {selectedKunde.strasseHausnummer}</p>
          <p><strong>Postleitzahl:</strong> {selectedKunde.postleitzahl}</p>
          <p><strong>Ort:</strong> {selectedKunde.ort}</p>
          <p><strong>Email:</strong> {selectedKunde.email}</p>
          <p><strong>Telefon:</strong> {selectedKunde.telefon}</p>
          <p><strong>Mobil:</strong> {selectedKunde.mobil}</p>
          <p><strong>Geschlecht:</strong> {selectedKunde.geschlecht}</p>
          <p><strong>Auftragstyp:</strong> {selectedKunde.auftragsTyp}</p>
          <p><strong>Auftragsbeschreibung:</strong> {selectedKunde.auftragsBeschreibung}</p>
          <p><strong>Preis:</strong> {selectedKunde.preis}</p>
          <p><strong>IP-Adresse:</strong> {selectedKunde.ip_adresse}</p>
        </div>
      ) : (
        <p>Kein Kunde gefunden.</p>
      )}
    </div>
  );
};

export default KundenAnzeigen;
