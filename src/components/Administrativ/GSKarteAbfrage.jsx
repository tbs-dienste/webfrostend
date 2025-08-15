import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GSKarteAbfrage.scss";

const GSKarteAbfrage = () => {
  const [inputBuffer, setInputBuffer] = useState("");
  const [statusText, setStatusText] = useState("Warten auf Kartendaten…");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Enter") {
        if (inputBuffer.length >= 8) {
          checkCard(inputBuffer);
        }
        setInputBuffer("");
      } else if (/^[0-9a-zA-Z]$/.test(e.key)) {
        setInputBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [inputBuffer]);

  const checkCard = async (kartennummer) => {
    try {
      setStatusText("Daten werden abgerufen…");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten/karten-oder-gutschein/${kartennummer}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/gskarte-details", { state: { karte: response.data } });
    } catch {
      setStatusText("Karte nicht gefunden, bitte erneut scannen.");
    }
  };

  return (
    <div className="gskarte-abfrage">
      <h1>💳 Kontostand abfragen</h1>
      <p>{statusText}</p>
      <p>Bitte scannen Sie eine Karte</p>
      <p>Veuillez scanner une carte</p>
      <p>Si prega di scansionare una carta</p>
    </div>
  );
};

export default GSKarteAbfrage;
