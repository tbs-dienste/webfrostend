import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "./GSKarteAbfrage.scss"; // SCSS für Styling
import logo from "../../logo.png";

const GSKarteAbfrage = () => {
  const [kartennummer, setKartennummer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!kartennummer) {
      setError("Bitte scannen oder geben Sie eine Kartennummer ein.");
      return;
    }
  
    if (kartennummer.length < 16) { // Beispiel für eine einfache Validierung der Kartennummer
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      navigate("/gskarte-details", { state: { gutschein: response.data } });
    } catch (error) {
      setError(error.response?.data?.error || "Gutschein nicht gefunden oder ungültig.");
    }
  };
  



  return (
    <div className="gskarte-abfrage">
      {/* Logo oben rechts */}
      <div className="logo-container">
        <img src={logo} alt="TBS Solutions Logo" className="logo" />
      </div>

      {/* Inhalte zentriert */}
      <div className="content">
        <h1 className="title">💳 Konto Stand abfragen</h1>
        <p className="subtitle">Bitte scannen oder eingeben:</p>

        {/* Eingabefeld für Kartennummer */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kartennummer scannen oder eingeben..."
            value={kartennummer}
            onChange={(e) => setKartennummer(e.target.value)}
          />
          <button type="submit">🔍 Abfragen</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>

      {/* Link-Leiste */}
      <div className="button-bar">
        <Link to="#" className="btn">🏠 Home</Link>
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

export default GSKarteAbfrage;
