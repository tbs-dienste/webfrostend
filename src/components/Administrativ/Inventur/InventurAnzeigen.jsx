import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./InventurAnzeigen.scss";

const InventurAnzeigen = () => {
  const [inventuren, setInventuren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventuren = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/inventur",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInventuren(res.data.inventuren || []);
      } catch (err) {
        console.error(err);
        alert("Fehler beim Laden der Inventuren");
      } finally {
        setLoading(false);
      }
    };

    fetchInventuren();
  }, []);

  if (loading) return <div className="inventur-loading">Lade Inventuren…</div>;

  return (
    <div className="inventur-page">
      <h2 className="inventur-title">Inventuren</h2>

      {inventuren.length === 0 ? (
        <div className="inventur-empty">Keine Inventuren vorhanden</div>
      ) : (
        <div className="inventur-table-wrapper">
          <table className="inventur-table">
            <thead>
              <tr>
                <th>Inventurnummer</th>
                <th>Lagerort</th>
                <th>Erstellt am</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {inventuren.map((inv) => (
                <tr key={inv.id}>
                  <td className="mono">{inv.nummer}</td>
                  <td>{inv.lagerort || "-"}</td>
                  <td>{new Date(inv.erstellt_am).toLocaleString()}</td>
                  <td>
                    <span
                      className={`status ${
                        inv.beendet ? "done" : "open"
                      }`}
                    >
                      {inv.beendet ? "Abgeschlossen" : "Offen"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn primary"
                      onClick={() =>
                        navigate(`/inventur/${inv.nummer}/start`)
                      }
                    >
                      Scannen
                    </button>

                    <button
                      className="btn secondary"
                      onClick={() =>
                        navigate(`/inventur/${inv.nummer}/differenzen`)
                      }
                    >
                      Differenzen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventurAnzeigen;
