import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EinkaufstagDetailPage.scss";

const API_URL = "https://tbsdigitalsolutionsbackend.onrender.com/api/einkauftage";

function EinkaufstagDetailPage() {
  const { datum_code } = useParams();
  const [einkaufstag, setEinkaufstag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newArtikel, setNewArtikel] = useState([{ artikel: "", menge: 1, preis_pro_stk: 0 }]);
  
  const token = localStorage.getItem("token");

  // 🔄 Einkaufstag laden
  const fetchEinkaufstag = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/${datum_code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
// Vorher: setEinkaufstag(res.data.data || { artikel: [] });
setEinkaufstag(res.data.data
  ? {
      ...res.data.data,
      gesamt_total: Number(res.data.data.gesamt_total),
      artikel: res.data.data.artikel.map(a => ({
        ...a,
        menge: Number(a.menge),
        preis_pro_stk: Number(a.preis_pro_stk),
        total: Number(a.total)
      }))
    }
  : { artikel: [] }
);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Einkaufstag konnte nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datum_code) fetchEinkaufstag();
  }, [datum_code]);

  // ✅ Artikel als erledigt markieren
  const handleMarkDone = async (artikelId) => {
    try {
      await axios.patch(`${API_URL}/${einkaufstag.datum_code}/artikel/${artikelId}/done`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEinkaufstag();
    } catch (err) {
      console.error(err);
      setError("Artikel konnte nicht als erledigt markiert werden");
    }
  };

  // 🗑️ Artikel löschen
  const handleDelete = async (artikelId) => {
    try {
      await axios.delete(`${API_URL}/${einkaufstag.datum_code}/artikel/${artikelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEinkaufstag();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Artikel konnte nicht gelöscht werden");
    }
  };

  // ➕ Neue Artikel hinzufügen
  const handleAddArtikel = async () => {
    try {
      const filtered = newArtikel.filter(a => a.artikel && a.menge > 0 && a.preis_pro_stk >= 0);
      if (!filtered.length) return alert("Bitte gültige Artikel eingeben");

      await axios.post(`${API_URL}/${einkaufstag.datum_code}/artikel`, { artikel: filtered }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewArtikel([{ artikel: "", menge: 1, preis_pro_stk: 0 }]);
      setShowModal(false);
      fetchEinkaufstag();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Artikel konnten nicht hinzugefügt werden");
    }
  };

  // Eingabefelder für neue Artikel
  const handleChangeArtikel = (index, field, value) => {
    const updated = [...newArtikel];
    updated[index][field] = field === "artikel" ? value : Number(value);
    setNewArtikel(updated);
  };

  const handleAddRow = () => setNewArtikel([...newArtikel, { artikel: "", menge: 1, preis_pro_stk: 0 }]);
  const handleRemoveRow = (index) => setNewArtikel(newArtikel.filter((_, i) => i !== index));

  if (loading) return <p>Lade Einkaufstag…</p>;
  if (error) return <p className="alert-error">{error}</p>;
  if (!einkaufstag) return <p>Einkaufstag nicht gefunden</p>;

  return (
    <div className="einkaufstag-detail-page">
      <h1>Einkaufstag: {einkaufstag.datum_code}</h1>
      <p>Gesamt: {Number(einkaufstag.gesamt_total).toFixed(2)} CHF</p>

      {/* Tabelle der bestehenden Artikel */}
      <table className="artikel-tabelle">
        <thead>
          <tr>
            <th>Artikel</th>
            <th>Menge</th>
            <th>Preis/Stk</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {einkaufstag.artikel.length > 0 ? (
            einkaufstag.artikel.map((artikel) => (
              <tr key={artikel.id}>
                <td>{artikel.artikel}</td>
                <td>{artikel.menge}</td>
                <td>{artikel.preis_pro_stk.toFixed(2)} CHF</td>
                <td>{artikel.total.toFixed(2)} CHF</td>
                <td>{artikel.erledigt ? "Erledigt ✅" : "Offen"}</td>
                <td>
                  {!artikel.erledigt && (
                    <>
                      <button onClick={() => handleMarkDone(artikel.id)}>✔️ Erledigt</button>
                      <button onClick={() => handleDelete(artikel.id)}>🗑️ Löschen</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", fontStyle: "italic" }}>
                Keine Artikel vorhanden 🛒
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Button zum Öffnen des Modal */}
      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        🛒 Neue Artikel hinzufügen
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Neue Artikel hinzufügen</h2>
            {newArtikel.map((a, index) => (
              <div key={index} className="modal-row">
                <input
                  type="text"
                  placeholder="Artikel"
                  value={a.artikel}
                  onChange={(e) => handleChangeArtikel(index, "artikel", e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Menge"
                  value={a.menge}
                  onChange={(e) => handleChangeArtikel(index, "menge", e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Preis/Stk"
                  value={a.preis_pro_stk}
                  onChange={(e) => handleChangeArtikel(index, "preis_pro_stk", e.target.value)}
                />
                {newArtikel.length > 1 && (
                  <button className="remove-btn" onClick={() => handleRemoveRow(index)}>❌</button>
                )}
              </div>
            ))}
            <div className="modal-actions">
              <button onClick={handleAddRow}>➕ Weitere Zeile</button>
              <button onClick={handleAddArtikel}>✅ Artikel hinzufügen</button>
              <button className="close-btn" onClick={() => setShowModal(false)}>❌ Schließen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EinkaufstagDetailPage;
