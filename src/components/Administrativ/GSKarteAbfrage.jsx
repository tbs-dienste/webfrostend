import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GSKarteAbfrage.scss";

const GSKarteAbfrage = () => {
  const [kartennummer, setKartennummer] = useState("");
  const [statusText, setStatusText] = useState("Warten auf Kartendaten…");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (kartennummer.length >= 16) {
        try {
          setStatusText("Daten werden abgerufen…");
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine/kartennummer/${kartennummer}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          navigate("/gskarte-details", { state: { gutschein: response.data } });
        } catch {
          setStatusText("Gutschein nicht gefunden, bitte erneut scannen.");
          setKartennummer("");
        }
      } else {
        setStatusText("Warten auf Kartendaten…");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [kartennummer, navigate]);

  useEffect(() => {
    const handlePaste = (e) => {
      const pastedData = e.clipboardData.getData("text");
      setKartennummer(pastedData.trim());
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="gskarte-abfrage">
      <h1>💳 Kontostand abfragen</h1>
      <p>Bitte scannen Sie eine Karte</p>
      <p>Veuillez scanner une carte</p>
      <p>Si prega di scansionare una carta</p>

    </div>
  );
};

export default GSKarteAbfrage;
