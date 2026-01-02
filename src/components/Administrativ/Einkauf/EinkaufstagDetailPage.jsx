import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EinkaufstagDetailPage.scss";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JsBarcode from "jsbarcode";

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
 

  const handleGeneratePDF = () => {
    if (!einkaufstag) return;
  
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // --- HEADER ---
    doc.setFillColor("#2c3e50");
    doc.rect(0, 0, pageWidth, 60, "F"); // dunkler Balken
    doc.setFontSize(22);
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.text("Einkaufsliste / Lieferschein", pageWidth / 2, 40, { align: "center" });
  
    // Datum-Code und Erstellungsdatum
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#34495e");
    doc.text(`Datum-Code: ${einkaufstag.datum_code}`, 40, 80);
    doc.text(`Erstellt am: ${new Date(einkaufstag.created_at).toLocaleString()}`, 40, 95);
  
    // --- HORIZONTALER BARCODE OHNE ZAHLEN ---
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, einkaufstag.datum_code, {
      format: "CODE128",
      displayValue: false,
      height: 60,
      width: 3,
      margin: 0,
    });
    const barcodeImg = canvas.toDataURL("image/png");
    doc.addImage(barcodeImg, "PNG", 40, 110, pageWidth - 80, 50);
  
    // --- MODERNE TABELLE OHNE STATUS ---
    const tableColumn = ["✔️", "Artikel", "Menge", "Preis/Stk (CHF)", "Total (CHF)"];
    const tableRows = einkaufstag.artikel.map((artikel) => [
      "", // Platz für manuelles Abhaken
      artikel.artikel,
      artikel.menge,
      artikel.preis_pro_stk.toFixed(2),
      artikel.total.toFixed(2),
    ]);
  
    doc.autoTable({
      startY: 180,
      head: [tableColumn],
      body: tableRows,
      headStyles: {
        fillColor: "#34495e",
        textColor: "#ffffff",
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fillColor: "#ffffff",
        textColor: "#2c3e50",
        valign: "middle",
        lineColor: "#dfe2e5",
        lineWidth: 0.5,
      },
      alternateRowStyles: { fillColor: "#f6f8fa" },
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 220 },
        2: { cellWidth: 60, halign: "center" },
        3: { cellWidth: 80, halign: "right" },
        4: { cellWidth: 80, halign: "right" },
      },
      theme: "grid",
      margin: { left: 40, right: 40 },
    });
  
    // --- GESAMTSUMME ---
    const finalY = doc.lastAutoTable.finalY || 180;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#2c3e50");
    doc.text(`Gesamt: ${einkaufstag.gesamt_total.toFixed(2)} CHF`, 40, finalY + 25);
  
    // --- FOOTER ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor("#7f8c8d");
    doc.text("Generated with TBS Digital Solutions", pageWidth / 2, doc.internal.pageSize.getHeight() - 30, {
      align: "center",
    });
  
    // --- PDF speichern ---
    doc.save(`Einkaufsliste${einkaufstag.datum_code}.pdf`);
  };
  
  
  
  
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
      <button className="pdf-btn" onClick={handleGeneratePDF}>
  📄 PDF / Lieferschein herunterladen
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
