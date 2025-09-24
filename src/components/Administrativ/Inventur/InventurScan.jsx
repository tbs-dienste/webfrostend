import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaBarcode } from "react-icons/fa";
import "./InventurScan.scss";

const InventurScan = () => {
  const { inventurId, lagerregalplatznr } = useParams();
  const [artikel, setArtikel] = useState("");
  const [menge, setMenge] = useState(1);
  const [scans, setScans] = useState([]);
  const [showScans, setShowScans] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef(null);

  // Alle Artikel der letzten Stunde laden
  const loadScans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/inventur/${inventurId}/${lagerregalplatznr}/last-hour`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScans(res.data.data); // <- data enthält die Rows
    } catch (err) {
      console.error(err);
      alert("Fehler beim Laden der gescannten Artikel");
    }
  };

  useEffect(() => {
    loadScans();
  }, []);

  // Automatisches Scannen bei Barcode (Enter)
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
        `https://tbsdigitalsolutionsbackend.onrender.com/api/inventur/scan/${inventurId}/${lagerregalplatznr}`,
        { artikelnummer: artikel, menge },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArtikel("");
      setMenge(1);
      loadScans(); // Liste aktualisieren
    } catch (err) {
      console.error(err);
      alert("Fehler beim Scannen");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="inventur-scan-container">
      <h2>Inventur Scannen</h2>
      <p>Lagerplatz: <strong>{lagerregalplatznr}</strong></p>

      {/* Toggle Button */}
      <button
        className={`toggle-scan-view ${showScans ? "active" : ""}`}
        onClick={() => setShowScans(!showScans)}
      >
        {showScans ? "Scanformular anzeigen" : "Gescannte Artikel anzeigen"}
      </button>

      {/* Scan-Formular */}
      {!showScans && (
        <form className="scan-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Artikelnummer</label>
            <input
              type="text"
              placeholder="Artikelnummer scannen"
              value={artikel}
              onChange={(e) => setArtikel(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              ref={inputRef}
            />
          </div>
          <div className="form-group">
            <label>Menge</label>
            <input
              type="number"
              min="1"
              value={menge}
              onChange={(e) => setMenge(Number(e.target.value))}
            />
          </div>
        </form>
      )}

      {/* Gescannte Artikel der letzten Stunde */}
      {showScans && (
        <div className="scan-list">
          <h3>Gescannte Artikel (letzte Stunde)</h3>
          {scans.length === 0 ? (
            <p>Keine Artikel gescannt.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Artikelnummer</th>
                  <th>Menge</th>
                  <th>Barcode</th>
                  <th>Gescannt um</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.artikelnummer}</td>
                    <td>{s.menge}</td>
                    <td><FaBarcode /></td>
                    <td>{new Date(s.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default InventurScan;
