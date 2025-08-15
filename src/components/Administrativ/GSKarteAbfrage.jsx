import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GSKarteAbfrage.scss";

const GSKarteAbfrage = () => {
  const [kartennummer, setKartennummer] = useState("");
  const [statusText, setStatusText] = useState("Warten auf Kartendaten…");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const scanTimeout = useRef(null);

  // Immer Fokus auf das unsichtbare Inputfeld setzen
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
    return () => clearInterval(focusInterval);
  }, []);

  // API-Abfrage starten
  const fetchCardData = async (nummer) => {
    if (nummer.trim().length < 8) return; // Mindestlänge prüfen
    try {
      setStatusText("Daten werden abgerufen…");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten/karten-oder-gutschein/${nummer.trim()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/gskarte-details", { state: { karte: response.data } });
    } catch {
      setStatusText("Karte nicht gefunden, bitte erneut scannen.");
    }
    setKartennummer("");
  };

  // Wenn sich der Text ändert → Scan erkennen
  const handleChange = (e) => {
    const value = e.target.value;
    setKartennummer(value);

    // Vorherigen Timer löschen
    if (scanTimeout.current) clearTimeout(scanTimeout.current);

    // Neuen Timer starten – sobald 100ms keine Eingabe mehr → absenden
    scanTimeout.current = setTimeout(() => {
      fetchCardData(value);
    }, 100);
  };

  return (
    <div className="gskarte-abfrage">
      {/* Unsichtbares Inputfeld */}
      <input
        ref={inputRef}
        type="text"
        value={kartennummer}
        onChange={handleChange}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <h1>💳 Kontostand abfragen</h1>
      <p>{statusText}</p>
      <p>Bitte scannen Sie eine Karte</p>
      <p>Veuillez scanner une carte</p>
      <p>Si prega di scansionare una carta</p>
    </div>
  );
};

export default GSKarteAbfrage;
