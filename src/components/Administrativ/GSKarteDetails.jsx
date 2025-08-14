// GSKarteDetails.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "./GSKarteDetails.scss";

const GSKarteDetails = () => {
  const location = useLocation();
  const [kartennummer, setKartennummer] = useState(location.state?.karte?.kartennummer || "");
  const [error, setError] = useState("");
  const [gutschein, setGutschein] = useState(null);
  const [person, setPerson] = useState(null);
  const [deviceID] = useState(() => Math.floor(Math.random() * 1e19));

  useEffect(() => {
    if (kartennummer.length >= 16) {
      fetchCardOrVoucher();
    }
  }, [kartennummer]);

  const fetchCardOrVoucher = async () => {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Kein Token vorhanden. Bitte neu anmelden.");
      return;
    }

    try {
      const response = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten/karten-oder-gutschein/${kartennummer}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.typ === "kundenkarte") {
        setPerson(response.data);
        setGutschein(null);
      } else if (response.data.typ === "gutschein") {
        setGutschein(response.data);
        setPerson(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Karte nicht gefunden oder ungültig.");
      setKartennummer("");
      setGutschein(null);
      setPerson(null);
    }
  };

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
      {!gutschein && !person && !error && <p>Bitte Karte scannen...</p>}

      <div className="details-container">
  {/* Personendaten immer anzeigen */}
  <div className="personendaten">
    <h2>Personendaten</h2>
    <p>Name: {person?.vorname || ""} {person?.nachname || ""}</p>
    <p>Strasse: {person?.adresse || ""}</p>
    <p>PLZ/Ort: {person?.plz || ""} {person?.ort || ""}</p>
    <p>E-Mail: {person?.email || ""}</p>
    <p>Geburtstag: {person?.geburtsdatum || ""}</p>
    <p>Punkte: {person?.punkte || ""}</p>
    <p>Umsatz: {person?.umsatz || ""}</p>
    <p>Status: {person?.status || ""}</p>
  </div>

  {/* Gutschein immer anzeigen */}
  <div className="gutschein-info">
    <h2>Karte Info & Status</h2>
    <p>Kartentyp: {gutschein?.kartentyp || ""}</p>
    <p>Kartennummer: {gutschein?.kartennummer || ""}</p>
    <p>Saldo: {gutschein?.guthaben != null ? `CHF ${gutschein.guthaben}` : ""}</p>
    <p>Status: {gutschein?.status || ""}</p>
    <p>
  Gültig bis: {gutschein?.gueltigBis 
    ? new Date(gutschein.gueltigBis).toLocaleDateString("de-DE") 
    : ""}
</p>
  </div>
</div>


      <div className="button-bar">
        <Link to="/" className="btn home-btn">🏠 Home</Link>

        <Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
X
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
X
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
X
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
X
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
X
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
X
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
X
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
Vollbild
</Link>
<Link 
  to="/" 
  className="btn disabled"  // Klasse "disabled" hinzufügen
  onClick={(e) => e.preventDefault()} // Klick verhindern
>
Übernehmen
</Link>
        <Link to="/kasse" className="btn btn-danger">
          <FaSignOutAlt className="icon" /> Exit
        </Link>
      </div>
    </div>
  );
};

export default GSKarteDetails;
