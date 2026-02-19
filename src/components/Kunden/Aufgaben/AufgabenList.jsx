import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./AufgabenList.scss";
import logo from "./black.png"; // 🔹 Logo hier speichern

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

  const drawCheckbox = (doc, x, y, checked = false) => {
    const size = 4;
  
    // Quadrat zeichnen
    doc.rect(x, y - size / 2, size, size);
  
    // Haken zeichnen wenn erledigt
    if (checked) {
      doc.setLineWidth(0.8);
      doc.line(x + 0.8, y, x + 1.8, y + 1.5);
      doc.line(x + 1.8, y + 1.5, x + size - 0.5, y - 1.5);
    }
  };
  

  // ==========================
  // PDF GENERIEREN
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // 🔷 HEADER
    doc.addImage(logo, "PNG", 14, 10, 25, 25);
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AUFGABEN CHECKLISTE", 45, 20);
  
    doc.setDrawColor(200);
    doc.line(14, 30, 196, 30);
  
    let startY = 40;
  
    aufgaben.forEach((aufgabe, index) => {
      // 🔷 Titel
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${aufgabe.titel}`, 14, startY);
  
      startY += 6;
  
      // 🔷 Tabellen-Daten
      const rows = [
        ...(aufgabe.unteraufgaben || []).map((u) => [
          "", // Platzhalter für Checkbox
          u.titel,
          u.beschreibung || "",
          u.erledigt || false, // speichern für Checkbox
        ]),
        ...Array(3).fill(["", "__________________", "", false]),
      ];
  
      autoTable(doc, {
        startY,
        head: [["", "Unteraufgabe", "Beschreibung"]],
        body: rows.map(r => r.slice(0, 3)), // nur sichtbare Spalten
        theme: "grid",
        styles: { fontSize: 10 },
        columnStyles: { 0: { cellWidth: 10 } },
  
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.section === "body") {
            const rowIndex = data.row.index;
            const checked = rows[rowIndex][3]; // erledigt Status
  
            drawCheckbox(
              doc,
              data.cell.x + 3,
              data.cell.y + data.cell.height / 2,
              checked
            );
          }
        },
      });
  
      startY = doc.lastAutoTable.finalY + 10;
  
      if (startY > 260) {
        doc.addPage();
        startY = 20;
      }
    });
  
    // 🔷 FOOTER
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(9);
    doc.setTextColor(120);
  
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Seite ${i} von ${pageCount}`, 105, 290, { align: "center" });
    }
  
    doc.save("Aufgaben_Checkliste.pdf");
  };
  
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
      fetchAufgaben();
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

      {/* 🔹 PDF BUTTON */}
      <button className="pdf-btn" onClick={generatePDF}>
        PDF Checkliste exportieren
      </button>

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

            {/* Fortschritt */}
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
              {[...(aufgabe.unteraufgaben || []), ...Array(3).fill({ leer: true })].map((u, index) => (
                <div key={index} className="unteraufgabe-item">
                  <div className="unteraufgabe-info">
                    <p className="unteraufgabe-title">
                      {u.leer ? "Neue Unteraufgabe..." : u.titel}
                    </p>
                    {!u.leer && (
                      <p className="unteraufgabe-desc">{u.beschreibung}</p>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    disabled={u.leer}
                    checked={!u.leer && u.erledigt}
                    onChange={() => !u.leer && toggleUnteraufgabe(u.id, u.erledigt)}
                    className="checkbox"
                  />
                </div>
              ))}

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
