import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // Für das Exit-Icon
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
        <p><strong>Kartennummer:</strong> {gutschein.kartennummer}</p>
        <p><strong>Kartentyp:</strong> {gutschein.kartentyp}</p>
        <p><strong>Saldo:</strong> {parseFloat(gutschein.guthaben).toFixed(2)} €</p>
        <p><strong>Status:</strong> {gutschein.status}</p>
        <p><strong>Gültig bis:</strong> {new Date(gutschein.gueltigBis).toLocaleDateString()}</p>
      </div>

      {/* Link-Leiste */}
      <div className="button-bar">
        <Link to="/" className="btn">🏠 Home</Link>
        {[...Array(8)].map((_, index) => (
          <span key={index} className="btn disabled" style={{ padding: '0 60px' }}>X</span>
        ))}
        <Link to="/kasse" className="btn btn-danger">
          <FaSignOutAlt className="icon" /> Exit
        </Link>
      </div>
    </div>
  );
};

export default GSKarteDetails;
