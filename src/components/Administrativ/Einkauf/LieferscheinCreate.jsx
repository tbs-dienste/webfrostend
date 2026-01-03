import { useEffect, useState } from "react";
import axios from "axios";
import "./LieferscheinCreate.scss";

export default function LieferscheinCreate() {
  const [lieferanten, setLieferanten] = useState([]);
  const [lieferantId, setLieferantId] = useState("");
  const [positionen, setPositionen] = useState([{ bezeichnung: "", menge: 1 }]);
  const [loading, setLoading] = useState(false);

  // Bearer Token aus localStorage
  const token = localStorage.getItem("token");

  // Axios Instance mit Token
  const api = axios.create({
    baseURL: "https://tbsdigitalsolutionsbackend.onrender.com/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /* ===============================
     Lieferanten laden
  =============================== */
  useEffect(() => {
    const fetchLieferanten = async () => {
      try {
        const res = await api.get("/lieferanten");
        setLieferanten(res.data?.data || []); // defensiv
      } catch (err) {
        console.error(err);
        alert("❌ Lieferanten konnten nicht geladen werden (Token prüfen)");
        setLieferanten([]);
      }
    };

    fetchLieferanten();
  }, [token]); // neu laden, wenn Token sich ändert

  /* ===============================
     Positionen
  =============================== */
  const addPosition = () => setPositionen([...positionen, { bezeichnung: "", menge: 1 }]);
  const updatePosition = (index, field, value) => {
    const copy = [...positionen];
    copy[index][field] = value;
    setPositionen(copy);
  };
  const removePosition = (index) => setPositionen(positionen.filter((_, i) => i !== index));

  /* ===============================
     Submit
  =============================== */
  const submit = async (e) => {
    e.preventDefault();

    if (!lieferantId) {
      alert("Bitte einen Lieferanten auswählen");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/lieferschein", {
        lieferant_id: Number(lieferantId),
        positionen,
      });

      alert(`✅ Lieferschein erstellt (ID: ${res.data.lieferschein_id})`);

      // Reset Form
      setLieferantId("");
      setPositionen([{ bezeichnung: "", menge: 1 }]);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error ||
        "❌ Fehler beim Erstellen des Lieferscheins (Token?)"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     JSX
  =============================== */
  return (
    <div className="dn-create">
      <div className="dn-create__header">
        <h2 className="dn-create__title">Lieferschein erstellen</h2>
      </div>

      <form className="dn-card" onSubmit={submit}>
        {/* ===== Lieferant ===== */}
        <div className="dn-section">
          <div className="dn-section__title">Lieferant</div>

          <div className="dn-field">
            <label className="dn-label">Lieferant auswählen</label>
            <select
              className="dn-select"
              value={lieferantId}
              onChange={(e) => setLieferantId(e.target.value)}
              required
            >
              <option value="">-- bitte auswählen --</option>
              {lieferanten?.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.firmenname}
                </option>
              )) || null}
            </select>
          </div>
        </div>

        {/* ===== Positionen ===== */}
        <div className="dn-section">
          <div className="dn-section__title">Positionen</div>
          <div className="dn-positions">
            {positionen.map((pos, index) => (
              <div className="dn-position" key={index}>
                <input
                  className="dn-input"
                  placeholder="Bezeichnung"
                  value={pos.bezeichnung}
                  onChange={(e) => updatePosition(index, "bezeichnung", e.target.value)}
                  required
                />

                <input
                  className="dn-input"
                  type="number"
                  min="1"
                  value={pos.menge}
                  onChange={(e) => updatePosition(index, "menge", Number(e.target.value))}
                  required
                />

                <button
                  type="button"
                  className="dn-position__remove"
                  onClick={() => removePosition(index)}
                  title="Position entfernen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="dn-actions">
          <button type="button" className="dn-btn dn-btn--secondary" onClick={addPosition}>
            + Position hinzufügen
          </button>

          <button type="submit" className="dn-btn dn-btn--primary" disabled={loading}>
            {loading ? "Speichern..." : "Lieferschein erstellen"}
          </button>
        </div>
      </form>
    </div>
  );
}
