import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RechnungDetails.scss";

const RechnungDetails = () => {
  const { id } = useParams();
  const [rechnung, setRechnung] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRechnung = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`);
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
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}/status`, { status: newStatus });
      if (response.status === 200) {
        setRechnung((prevRechnung) => ({ ...prevRechnung, status: newStatus }));
      }
    } catch (error) {
      alert(`Fehler beim Aktualisieren des Status: ${error.response ? error.response.data : error.message}`);
    }
  };

  const deleteRechnung = async () => {
    if (window.confirm("Möchten Sie diese Rechnung wirklich löschen?")) {
      try {
        const response = await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`);
        if (response.status === 200) {
          window.location.href = "/rechnungen";
        }
      } catch (error) {
        alert(`Fehler beim Löschen der Rechnung: ${error.response ? error.response.data : error.message}`);
      }
    }
  };

  if (loading) return <div className="rechnung-detail__loading">Lade...</div>;
  if (error) return <div className="rechnung-detail__error">{error}</div>;

  return (
    <div className="rechnung-detail">
      <h2 className="rechnung-detail__title">Rechnungsdetails</h2>
      {rechnung && (
        <>
          <div className="rechnung-detail__info">
            <span className="rechnung-detail__label">Rechnungsnummer:</span>
            <span className="rechnung-detail__value">{rechnung.rechnungsnummer}</span>
          </div>
          <p><strong>Status:</strong> {rechnung.status}</p>
          <p><strong>Gesamtkosten:</strong> {rechnung.totalKostenMitMwst} €</p>
          <p><strong>Gesamtarbeitszeit:</strong> {rechnung.gesamtArbeitszeit} Stunden</p>
          
          <div className="rechnung-detail__status-buttons">
            {rechnung.status === "Entwurf" && (
              <button className="status-button" onClick={() => updateStatus("Offen")}>Offen</button>
            )}
            {rechnung.status === "Offen" && (
              <>
                <button className="status-button" onClick={() => updateStatus("Entwurf")}>Entwurf</button>
                <button className="status-button" onClick={() => updateStatus("Bezahlt")}>Bezahlt</button>
                <button className="status-button" onClick={() => updateStatus("1. Mahnstufe")}>1. Mahnstufe</button>
              </>
            )}
            {rechnung.status === "1. Mahnstufe" && (
              <button className="status-button" onClick={() => updateStatus("2. Mahnstufe")}>2. Mahnstufe</button>
            )}
            {rechnung.status === "2. Mahnstufe" && (
              <button className="status-button" onClick={() => updateStatus("3. Mahnstufe")}>3. Mahnstufe</button>
            )}
            {rechnung.status === "3. Mahnstufe" && (
              <button className="status-button" onClick={() => updateStatus("Überfällig")}>Überfällig</button>
            )}
          </div>

          <h4>Dienstleistungen</h4>
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

      <div className="rechnung-detail__delete">
        <button className="delete-button" onClick={deleteRechnung}>Rechnung löschen</button>
      </div>
    </div>
  );
};

export default RechnungDetails;
