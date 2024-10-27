import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RechnungDetails.scss";

const RechnungDetails = () => {
  const { id } = useParams(); // ID aus den URL-Parametern abrufen
  const [rechnung, setRechnung] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRechnung = async () => {
      try {
        // API-Aufruf zur Abfrage der Rechnung anhand der ID
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`);
        
        // Annahme: Die Antwort enthält das Rechnungsobjekt direkt
        const gefundeneRechnung = response.data.rechnung; 

        if (gefundeneRechnung) {
          setRechnung(gefundeneRechnung);
        } else {
          setError("Rechnung nicht gefunden.");
        }
      } catch (err) {
        setError("Fehler beim Abrufen der Rechnungen.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRechnung();
  }, [id]); // ID als Abhängigkeit für den useEffect-Hook

  if (loading) return <div className="rechnung-detail__loading">Lade...</div>;
  if (error) return <div className="rechnung-detail__error">{error}</div>;

  return (
    <div className="rechnung-detail">
      <h2 className="rechnung-detail__title">Rechnungsdetails</h2>
      {rechnung && (
        <>
          <div className="rechnung-detail__customer">
            <span className="rechnung-detail__label">Rechnungsnummer:</span>
            <span className="rechnung-detail__name">{rechnung.rechnungsnummer}</span>
          </div>
          <p><strong>Status:</strong> {rechnung.status}</p>
          <p><strong>Gesamtkosten:</strong> {rechnung.totalKostenMitMwst} €</p>
          <p><strong>Gesamtarbeitszeit:</strong> {rechnung.gesamtArbeitszeit} Stunden</p>
          <h4>Dienstleistungen</h4>
          {/* Überprüfung, ob Dienstleistungen vorhanden sind */}
          {rechnung.dienstleistungen && rechnung.dienstleistungen.length > 0 ? (
            <ul className="rechnung-detail__services">
              {rechnung.dienstleistungen.map((service) => (
                <li key={service.id}>
                  {service.title} - {service.kosten} €
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine Dienstleistungen gefunden.</p>
          )}
          <h4>Benutzerdefinierte Dienstleistungen</h4>
          {/* Überprüfung, ob benutzerdefinierte Dienstleistungen vorhanden sind */}
          {rechnung.benutzerdefinierteDienstleistungen && rechnung.benutzerdefinierteDienstleistungen.length > 0 ? (
            <ul className="rechnung-detail__custom-services">
              {rechnung.benutzerdefinierteDienstleistungen.map((custom, index) => (
                <li key={index}>
                  {custom.title} (Anzahl: {custom.anzahl}) - {custom.kosten} €
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine benutzerdefinierten Dienstleistungen gefunden.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RechnungDetails;
