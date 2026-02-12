import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AufgabenList.scss";

export default function AufgabenList() {
  const { kundenId } = useParams();

  const [aufgaben, setAufgaben] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // MODALS STATE
  const [aufgabeModalOpen, setAufgabeModalOpen] = useState(false);
  const [unteraufgabeModalOpen, setUnteraufgabeModalOpen] = useState(false);
  const [selectedAufgabeId, setSelectedAufgabeId] = useState(null);

  // ==========================
  // Neue Aufgabe
  const [neueAufgabeTitel, setNeueAufgabeTitel] = useState("");
  const [neuesFaelligAm, setNeuesFaelligAm] = useState("");

  // Neue Unteraufgabe
  const [unterTitel, setUnterTitel] = useState("");
  const [unterBeschreibung, setUnterBeschreibung] = useState("");
  const [unterFaelligAm, setUnterFaelligAm] = useState("");

  // ==========================
  const fetchAufgaben = async () => {
    try {
      const res = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/kunden/${kundenId}/aufgaben`
      );
      setAufgaben(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kundenId) fetchAufgaben();
  }, [kundenId]);

  // ==========================
  // Aufgabe erstellen
  const handleNeueAufgabe = async () => {
    if (!neueAufgabeTitel) return alert("Bitte Titel eingeben!");
    try {
      await axios.post(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/kunden/${kundenId}/aufgaben`,
        { titel: neueAufgabeTitel, faellig_am: neuesFaelligAm }
      );
      setNeueAufgabeTitel("");
      setNeuesFaelligAm("");
      setAufgabeModalOpen(false);
      fetchAufgaben();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Unteraufgabe erstellen
  const handleNeueUnteraufgabe = async () => {
    if (!unterTitel || !unterBeschreibung)
      return alert("Titel und Beschreibung erforderlich!");
    try {
      await axios.post(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/${selectedAufgabeId}/unteraufgaben`,
        { titel: unterTitel, beschreibung: unterBeschreibung, faellig_am: unterFaelligAm }
      );
      setUnterTitel("");
      setUnterBeschreibung("");
      setUnterFaelligAm("");
      setUnteraufgabeModalOpen(false);
      fetchAufgaben(); // sofort nachladen
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  const toggleUnteraufgabe = async (unteraufgabenId, erledigt) => {
    try {
      await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/unteraufgaben/${unteraufgabenId}/toggle`,
        { erledigt: !erledigt }
      );
      fetchAufgaben();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Lade Aufgaben...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Aufgaben Übersicht</h1>

      <button className="open-modal-btn" onClick={() => setAufgabeModalOpen(true)}>
        Neue Aufgabe erstellen
      </button>

      {/* POP-UP AUFGABE */}
      {aufgabeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Neue Aufgabe</h2>
            <input
              type="text"
              placeholder="Titel der Aufgabe"
              value={neueAufgabeTitel}
              onChange={(e) => setNeueAufgabeTitel(e.target.value)}
            />
            <input
              type="date"
              value={neuesFaelligAm}
              onChange={(e) => setNeuesFaelligAm(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-submit" onClick={handleNeueAufgabe}>Erstellen</button>
              <button className="btn-cancel" onClick={() => setAufgabeModalOpen(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP UNTERAUFGABE */}
      {unteraufgabeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Neue Unteraufgabe</h2>
            <input
              type="text"
              placeholder="Titel der Unteraufgabe"
              value={unterTitel}
              onChange={(e) => setUnterTitel(e.target.value)}
            />
            <textarea
              placeholder="Beschreibung"
              value={unterBeschreibung}
              onChange={(e) => setUnterBeschreibung(e.target.value)}
            />
            <input
              type="date"
              value={unterFaelligAm}
              onChange={(e) => setUnterFaelligAm(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-submit" onClick={handleNeueUnteraufgabe}>Erstellen</button>
              <button className="btn-cancel" onClick={() => setUnteraufgabeModalOpen(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* AUFGABEN LISTE */}
      <div className="aufgaben-list">
        {aufgaben.map((aufgabe) => (
          <div key={aufgabe.id} className="aufgabe-card">
            <div className="aufgabe-header">
              <div className="aufgabe-header-info">
                <h2 className="aufgabe-title">{aufgabe.titel}</h2>
                <p className="aufgabe-date">
                  Fällig: {aufgabe.faellig_am
                    ? new Date(aufgabe.faellig_am).toLocaleDateString()
                    : "Kein Datum"}
                </p>
              </div>
              <span className={`status-badge status-${aufgabe.status}`}>
                {aufgabe.status}
              </span>
            </div>

            {/* Fortschrittsbalken */}
            <div className="progress-container">
              <div className="progress-background">
                <div
                  className="progress-fill"
                  style={{ width: `${aufgabe.fortschritt}%` }}
                />
              </div>
              <span className="progress-text">{aufgabe.fortschritt}% erledigt</span>
            </div>

            {/* Unteraufgaben */}
            <div className="unteraufgaben-list">
              {aufgabe.unteraufgaben && aufgabe.unteraufgaben.length > 0 ? (
                aufgabe.unteraufgaben.map((u) => (
                  <div
                    key={u.id}
                    className={`unteraufgabe-item ${
                      u.status === "ueberfaellig" ? "unteraufgabe-overdue" : ""
                    }`}
                  >
                    <div className="unteraufgabe-info">
                      <p className={`unteraufgabe-title ${u.erledigt ? "unteraufgabe-done" : ""}`}>
                        {u.titel}
                      </p>
                      <p className={`unteraufgabe-title ${u.erledigt ? "unteraufgabe-done" : ""}`}>
                        {u.beschreibung}
                      </p>
                      {u.faellig_am && (
                        <span className="unteraufgabe-date">
                          {new Date(u.faellig_am).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={u.erledigt}
                      onChange={() => toggleUnteraufgabe(u.id, u.erledigt)}
                      className="checkbox"
                    />
                  </div>
                ))
              ) : (
                <p style={{ fontStyle: "italic", color: "#555", marginBottom: "10px" }}>
                  Keine Unteraufgaben
                </p>
              )}

              {/* BUTTON FÜR UNTERAUFGABE – immer sichtbar */}
              <button
                className="add-unteraufgabe-btn"
                onClick={() => {
                  setSelectedAufgabeId(aufgabe.id);
                  setUnteraufgabeModalOpen(true);
                }}
              >
                + Unteraufgabe hinzufügen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
