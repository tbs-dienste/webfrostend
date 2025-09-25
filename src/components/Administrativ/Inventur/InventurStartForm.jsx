import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InventurStartForm.scss";

const InventurStartForm = () => {
  const navigate = useNavigate();
  const [inventurnummer, setInventurnummer] = useState("");
  const [lagerplatz, setLagerplatz] = useState("");

  const handleWeiter = () => {
    if (!inventurnummer || !lagerplatz) {
      alert("Bitte Inventurnummer und Lagerplatz ausfüllen!");
      return;
    }
    // Weiterleitung zur InventurScan-Seite mit Parametern
    navigate(`/inventur/${inventurnummer}/${lagerplatz}`);
  };

  return (
    <div className="inventur-start-container">
      <h2>Inventur Start</h2>
      <form className="inventur-start-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Inventurnummer</label>
          <input
            type="text"
            value={inventurnummer}
            onChange={(e) => setInventurnummer(e.target.value)}
            placeholder="z. B. 2025.01!09"
          />
        </div>
        <div className="form-group">
          <label>Lagerplatz</label>
          <input
            type="text"
            value={lagerplatz}
            onChange={(e) => setLagerplatz(e.target.value)}
            placeholder="z. B. A1-03"
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-weiter" onClick={handleWeiter}>
            Weiter zur Inventur-Scan-Seite
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventurStartForm;
