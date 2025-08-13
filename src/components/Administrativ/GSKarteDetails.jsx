// GSKarteDetails.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "./GSKarteDetails.scss";

const GSKarteDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [kartennummer, setKartennummer] = useState(location.state?.gutschein?.kartennummer || "");
  const [error, setError] = useState("");
  const [gutschein, setGutschein] = useState(location.state?.gutschein || null);
  const [deviceID] = useState(() => Math.floor(Math.random() * 1e19));
  const [person] = useState(""); // bleibt leer

  // Auto-Abfrage bei Kartennummer
  useEffect(() => {
    if (kartennummer.length >= 16) {
      fetchGutschein();
    }
  }, [kartennummer]);

  const fetchGutschein = async () => {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Kein Token vorhanden. Bitte neu anmelden.");
      return;
    }

    try {
      const response = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/kartennummer/${kartennummer}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGutschein(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Gutschein nicht gefunden oder ungültig.");
      setKartennummer("");
      setGutschein(null);
    }
  };

  // Paste-Event abfangen
  useEffect(() => {
    const handlePaste = (e) => {
      const pastedData = e.clipboardData.getData("text").trim();
      setKartennummer(pastedData);
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="gskarte-details">
      <header className="gskarte-header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="device-info">
          <p>DeviceID: {deviceID}</p>
          <p>Devicetyp: giftcard</p>
          <p>MemberId: 0</p>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}
      {!gutschein && !error && <p>Bitte Karte scannen...</p>}

      {/* Nebeneinander-Anzeige */}
      <div className="details-container">
        <div className="personendaten">
          <h2>Personendaten</h2>
          <p>Name: {person || ""}</p>
          <p>Strasse: {person || ""}</p>
          <p>PLZ/Ort: {person || ""}</p>
          <p>E-Mail: {person || ""}</p>
          <p>Geburtstag: {person || ""}</p>
        </div>

        {gutschein && (
          <div className="gutschein-info">
            <h2>Karte Info & Status</h2>
            <p>Kartentyp: {gutschein.kartentyp}</p>
            <p>Kartennummer: {gutschein.kartennummer}</p>
            <p>Saldo: CHF {gutschein.guthaben}</p>
            <p>Status: {gutschein.status}</p>
            <p>Gültig bis: {gutschein.gueltigBis}</p>
          </div>
        )}
      </div>

      <div className="button-bar">
        <Link to="/" className="btn home-btn">🏠 Home</Link>
        <Link to="/kasse" className="btn btn-danger">
          <FaSignOutAlt className="icon" /> Exit
        </Link>
      </div>
    </div>
  );
};

export default GSKarteDetails;
