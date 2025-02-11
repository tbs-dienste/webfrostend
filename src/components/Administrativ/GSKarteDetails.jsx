import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GSKarteDetails.scss"; // SCSS für Styling

const GSKarteDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gutschein = location.state?.gutschein;

  if (!gutschein) {
    return (
      <div className="gskarte-details">
        <h1>Fehler</h1>
        <p>Keine Gutschein-Daten gefunden.</p>
        <button onClick={() => navigate("/")}>🔙 Zurück</button>
      </div>
    );
  }

  return (
    <div className="gskarte-details">
      <h1>💳 Gutschein-Details</h1>

      <div className="details-container">
        <p><strong>Kartennummer:</strong> {gutschein.gutscheincode}</p>
        <p><strong>Kartentyp:</strong> Geschenkkarte</p>
        <p><strong>Saldo:</strong> {gutschein.guthaben.toFixed(2)} €</p>
        <p><strong>Status:</strong> {gutschein.status}</p>
        <p><strong>Gültig bis:</strong> {new Date(gutschein.gueltigBis).toLocaleDateString()}</p>
      </div>

      <button onClick={() => navigate("/")}>🔙 Zurück</button>
    </div>
  );
};

export default GSKarteDetails;
