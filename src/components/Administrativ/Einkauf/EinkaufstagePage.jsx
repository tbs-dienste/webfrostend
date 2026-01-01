import { useEffect, useState } from "react";
import axios from "axios";
import "./EinkaufstagePage.scss";

const API_URL = "https://tbsdigitalsolutionsbackend.onrender.com/api/einkauftage";

function EinkaufstagePage() {
  const [einkaufstage, setEinkaufstage] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [datum, setDatum] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔄 Einkaufstage laden
  const fetchEinkaufstage = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEinkaufstage(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Einkaufstage konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEinkaufstage();
  }, []);

// Einkaufstag erstellen (Frontend sendet das Datum)
const handleCreate = async () => {
    if (!datum) {
      setError("Bitte ein Datum auswählen");
      return;
    }
  
    try {
      await axios.post(
        API_URL,
        { datum }, // Datum vom Input
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setPopupOpen(false);
      setDatum("");
      setError("");
      fetchEinkaufstage(); // Liste neu laden
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Fehler beim Erstellen des Einkaufstags");
    }
  };
  
  return (
    <div className="shopping-page">
      <header className="shopping-header">
        <h1>Einkaufstage</h1>
        <button
          className="primary-action"
          onClick={() => setPopupOpen(true)}
        >
          + Neuer Einkaufstag
        </button>
      </header>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <p className="loading-text">Lade Einkaufstage…</p>
      ) : (
        <section className="shopping-grid">
          {einkaufstage.map((tag) => (
            <article className="shopping-card" key={tag.id}>
              <div className="card-row">
                <span className="label">Datum-Code</span>
                <span className="value">{tag.datum_code}</span>
              </div>

              <div className="card-row">
                <span className="label">Gesamt</span>
                <span className="value total">
                  {Number(tag.gesamt_total).toFixed(2)} CHF
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* 🪟 POPUP */}
      {popupOpen && (
        <div className="modal-backdrop">
          <div className="modal-window">
            <h2>Einkaufstag erstellen</h2>

            <label className="input-label">Datum auswählen</label>
            <input
              type="date"
              className="date-input"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
            />

            <div className="modal-actions">
              <button className="primary-action" onClick={handleCreate}>
                Erstellen
              </button>
              <button
                className="secondary-action"
                onClick={() => setPopupOpen(false)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EinkaufstagePage;
