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
        const response = await axios.get(`https://backend-1-cix8.onrender.com/api/v1/kunden/${id}`);
        console.log('API-Daten:', response.data);
        setSelectedKunde(response.data.data[0]); // Hier greifen wir auf das erste Element im Array zu
      } catch (error) {
        console.error('Error fetching kunde:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchKunde();
  }, [id]);

  return (
    <div className="kunden-anzeigen">
      {loading ? (
        <p>Lade Kunden...</p>
      ) : selectedKunde ? (
        <div className="info">
          <p><span>Kundennummer:</span> {selectedKunde.kundennummer}</p>
          <p><span>Vorname:</span> {selectedKunde.vorname}</p>
          <p><span>Nachname:</span> {selectedKunde.nachname}</p>
          <p><span>Adresse:</span> {selectedKunde.strasseHausnummer}</p>
          <p><span>Stadt:</span> {selectedKunde.stadt}</p>
          <p><span>Kanton:</span> {selectedKunde.kanton}</p>
          <p><span>Postleitzahl:</span> {selectedKunde.postleitzahl}</p>
          <p><span>Email:</span> {selectedKunde.email}</p>
          <p><span>Telefon:</span> {selectedKunde.telefon}</p>
          <p><span>Mobil:</span> {selectedKunde.mobil}</p>
          <p><span>Geschlecht:</span> {selectedKunde.geschlecht}</p>
          <p><span>AuftragsTyp:</span> {selectedKunde.auftragsTyp}</p>
          <p><span>AuftragsBeschreibung:</span> {selectedKunde.auftragsBeschreibung || "Kein Auftrag"}</p>
        </div>
      ) : (
        <div>Kein Kunde gefunden</div>
      )}
    </div>
  );
};

export default KundenAnzeigen;
