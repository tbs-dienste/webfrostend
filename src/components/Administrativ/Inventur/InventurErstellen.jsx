import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./InventurErstellen.scss";

const InventurErstellen = () => {
  const [lagerort, setLagerort] = useState("");
  const [regalplaetze, setRegalplaetze] = useState([""]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/inventur/create",
        { lagerort_name: lagerort, lagerregalplaetze: regalplaetze },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const inventurNummer = res.data.nummer;
      const ersterPlatz = regalplaetze[0];
      navigate(`/inventur/${inventurNummer}/scan/${ersterPlatz}`);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Erstellen der Inventur");
    }
  };

  const handleRegalChange = (i, value) => {
    const updated = [...regalplaetze];
    updated[i] = value;
    setRegalplaetze(updated);
  };

  return (
    <div className="inventur-container">
      <div className="inventur-card">
        <h2>Neue Inventur erstellen</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lagerort Name</label>
            <input
              type="text"
              placeholder="Lagerort Name"
              value={lagerort}
              onChange={(e) => setLagerort(e.target.value)}
              required
            />
          </div>

          {regalplaetze.map((pl, i) => (
            <div className="form-group" key={i}>
              <label>Regalplatz {i + 1}</label>
              <input
                type="text"
                placeholder={`Regalplatz ${i + 1}`}
                value={pl}
                onChange={(e) => handleRegalChange(i, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setRegalplaetze([...regalplaetze, ""])}
            >
              + Regalplatz
            </button>
            <button type="submit" className="btn btn-primary">
              Inventur starten
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventurErstellen;
