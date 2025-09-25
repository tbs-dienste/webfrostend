import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaBarcode } from "react-icons/fa";
import "./InventurScan.scss";

const InventurScan = () => {
  const { inventurnummer, lagerregalplatznr } = useParams();
  const [artikel, setArtikel] = useState("");
  const [menge, setMenge] = useState(1);
  const [scans, setScans] = useState([]);
  const [showScans, setShowScans] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef(null);

  // Scans der letzten Stunde laden
  const loadScans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/inventur/${inventurnummer}/scans/${lagerregalplatznr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScans(res.data.data || []); // ⚡ leer, wenn nichts vorhanden
    } catch (err) {
      console.error(err);
      setScans([]); // einfach nichts anzeigen
    }
  };

  useEffect(() => {
    loadScans();
  }, [inventurnummer, lagerregalplatznr]);

  // Fokus auf das Eingabefeld
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [artikel, showScans]);

  // Enter löst Scan aus
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && artikel) {
      e.preventDefault();
      await handleScan();
    }
  };

  const handleScan = async () => {
    if (!artikel) return;
    setIsScanning(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/inventur/${inventurnummer}/scan/${lagerregalplatznr}`,
        { barcode: artikel, menge },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArtikel("");
      setMenge(1);
      loadScans();
    } catch (err) {
      console.error(err);
      alert("Fehler beim Scannen");
    } finally {
      setIsScanning(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="inventur-scan-container">
      <h2>Inventur Scannen</h2>
      <p>
        Inventurnummer: <strong>{inventurnummer}</strong> | Lagerplatz:{" "}
        <strong>{lagerregalplatznr}</strong>
      </p>

      <button
        className={`toggle-scan-view ${showScans ? "active" : ""}`}
        onClick={() => setShowScans(!showScans)}
      >
        {showScans ? "Scanformular anzeigen" : "Gescannte Artikel anzeigen"}
      </button>

      {!showScans && (
        <form className="scan-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Barcode / Artikelnummer</label>
            <input
              type="text"
              placeholder="Artikelnummer scannen"
              value={artikel}
              onChange={(e) => setArtikel(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              disabled={isScanning}
            />
          </div>
          <div className="form-group">
            <label>Menge</label>
            <input
              type="number"
              min="1"
              value={menge}
              onChange={(e) => setMenge(Number(e.target.value))}
              disabled={isScanning}
            />
          </div>
        </form>
      )}

      {showScans && scans.length > 0 && (
        <div className="scan-list">
          <h3>Gescannte Artikel (letzte Stunde)</h3>
          <table>
            <thead>
              <tr>
                <th>Artikelnummer</th>
                <th>Name</th>
                <th>Barcode</th>
                <th>Menge</th>
                <th>Gescannt um</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((s, idx) => (
                <tr key={idx}>
                  <td>{s.artikelnummer}</td>
                  <td>{s.name}</td>
                  <td>
                    <FaBarcode /> {s.barcode}
                  </td>
                  <td>{s.menge}</td>
                  <td>{new Date(s.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventurScan;
