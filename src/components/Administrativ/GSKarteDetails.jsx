import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "./GSKarteDetails.scss";

const GSKarteDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [kartennummer, setKartennummer] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [error, setError] = useState("");
  const [gutschein, setGutschein] = useState(location.state?.gutschein || null);

  useEffect(() => {
    if (!isManualInput && kartennummer.length >= 16) {
      handleScanSubmit();
    }
  }, [kartennummer]);

  const handleToggleInput = () => {
    setIsManualInput((prev) => !prev);
    setKartennummer("");
  };

  const handleScanSubmit = async () => {
    setError("");

    if (!kartennummer) {
      setError("Bitte scannen oder geben Sie eine Kartennummer ein.");
      return;
    }

    if (kartennummer.length < 16) {
      setError("Die Kartennummer ist zu kurz. Bitte überprüfen Sie Ihre Eingabe.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Kein Token vorhanden. Bitte neu anmelden.");
      return;
    }

    try {
      const response = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/kartennummer/${kartennummer}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGutschein(response.data);
    } catch (error) {
      setError(error.response?.data?.error || "Gutschein nicht gefunden oder ungültig.");
    }
  };

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

      <div className="scan-input">
        <button onClick={handleToggleInput}>
          {isManualInput ? "🔄 Zurück zum Scannen" : "⌨️ Manuelle Eingabe"}
        </button>
        {isManualInput && (
          <input
            type="text"
            placeholder="Kartennummer eingeben..."
            value={kartennummer}
            onChange={(e) => setKartennummer(e.target.value)}
          />
        )}
      </div>
      {error && <p className="error">{error}</p>}

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
