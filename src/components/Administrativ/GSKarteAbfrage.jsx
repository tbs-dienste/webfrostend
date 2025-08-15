import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
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

      <h1>Kontostand abfragen</h1>
      <p>Bitte scannen Sie eine Karte</p>
      <h1>Vérifiez le solde du compte</h1>
      <p>Se il vous plaît balayant une carte</p>
      <h1>Controllare saldo del conto</h1>
      <p>Si prega di scansione di una carta</p>


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

export default GSKarteAbfrage;
