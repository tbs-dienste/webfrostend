import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JsBarcode from "jsbarcode";
import "./LieferscheinDetail.scss";

export default function LieferscheinDetail() {
  const { lieferschein_nr } = useParams();
  const [lieferschein, setLieferschein] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const barcodeRef = useRef(null);
  const auftragRef = useRef(null);
  const lieferantRef = useRef(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "https://tbsdigitalsolutionsbackend.onrender.com/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchLieferschein = async () => {
      try {
        const res = await api.get(`/lieferschein/nummer/${lieferschein_nr}`);
        setLieferschein(res.data?.data || null);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Fehler beim Laden des Lieferscheins");
        navigate("/lieferscheine");
      } finally {
        setLoading(false);
      }
    };

    fetchLieferschein();
  }, [lieferschein_nr, token, navigate]);

  useEffect(() => {
    if (!lieferschein) return;

    if (barcodeRef.current)
      JsBarcode(barcodeRef.current, lieferschein.lieferschein_nr, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false,
      });

    if (auftragRef.current)
      JsBarcode(auftragRef.current, lieferschein.auftragsnummer.toString(), {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false,
      });

    if (lieferantRef.current)
      JsBarcode(lieferantRef.current, lieferschein.lieferant_id.toString(), {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false,
      });
  }, [lieferschein]);

  const downloadPDF = () => {
    if (!lieferschein) return;
  
    const doc = new jsPDF({ orientation: "landscape" });
  
    // ===== Erste Seite: Header =====
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lieferschein", 10, 15);
  
    // Absender links oben
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let absenderY = 25;
    doc.text("Absender:", 10, absenderY);
    absenderY += 7;
    doc.text(`${lieferschein.ansprechpartner_vorname} ${lieferschein.ansprechpartner_nachname}`, 10, absenderY);
    absenderY += 7;
    doc.text(`${lieferschein.lieferant_name}`, 10, absenderY);
    absenderY += 7;
    doc.text(`${lieferschein.adresse}`, 10, absenderY);
    absenderY += 7;
    doc.text(`${lieferschein.plz} ${lieferschein.ort}`, 10, absenderY);
  
    // Empfänger rechts oben
    const empfaengerX = 160;
    let empfaengerY = 25;
    doc.setFont("helvetica", "bold");
    doc.text("Empfänger:", empfaengerX, empfaengerY);
    doc.setFont("helvetica", "normal");
    empfaengerY += 7;
    doc.text("TBS Solutions", empfaengerX, empfaengerY);
    empfaengerY += 7;
    doc.text("Akazienweg 2b", empfaengerX, empfaengerY);
    empfaengerY += 7;
    doc.text("Timo Blumer", empfaengerX, empfaengerY);
    empfaengerY += 10;
    doc.text(`Datum: ${new Date(lieferschein.datum).toLocaleDateString()}`, empfaengerX, empfaengerY);
  
    // Logo oben rechts
    if (lieferschein.logo_base64) {
      doc.addImage(
        `data:image/png;base64,${lieferschein.logo_base64}`,
        "PNG",
        240,
        10,
        50,
        25
      );
    }
  
    // ===== Barcodes schön untereinander =====
    const canvasToDataURL = (canvasRef) =>
      canvasRef.current ? canvasRef.current.toDataURL("image/png") : null;
  
    const barcodes = [
      { ref: barcodeRef, label: "Lieferscheinnr" },
      { ref: auftragRef, label: "Auftragsnr" },
    ];
  
    let barcodeY = 70;
    const barcodeX = 10;
    const barcodeWidth = 300;
    const barcodeHeight = 35;
  
    barcodes.forEach((bc) => {
      const img = canvasToDataURL(bc.ref);
      if (img) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(bc.label, barcodeX, barcodeY - 5);
        doc.addImage(img, "PNG", barcodeX, barcodeY, barcodeWidth, barcodeHeight);
        barcodeY += barcodeHeight + 20; // Abstand zwischen Barcodes
      }
    });
  
    // Linien zur Trennung
    doc.setLineWidth(0.5);
    doc.line(10, 65, 580, 65); // obere Linie
    doc.line(10, barcodeY - 10, 580, barcodeY - 10); // unter Barcodes
  
    // ===== Zweite Seite: Positionen (Hochformat) =====
    doc.addPage("p");
    const tableColumn = ["Pos", "Bezeichnung", "Menge"];
    const tableRows = lieferschein.positionen.map((pos) => [
      pos.pos,
      pos.bezeichnung,
      pos.menge,
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [220, 220, 220] },
      theme: "grid",
    });
  
    doc.save(`Lieferschein_${lieferschein.lieferschein_nr}.pdf`);
  };
  
  
  if (loading) return <p>Lieferschein wird geladen...</p>;
  if (!lieferschein) return <p>Lieferschein nicht gefunden.</p>;

  return (
    <div className="ls-detail">
      <h2>Lieferschein Nr. {lieferschein.lieferschein_nr}</h2>

      <div className="ls-card">
        {/* Logo */}
        {lieferschein.logo_base64 && (
          <img
            className="ls-logo"
            src={`data:image/png;base64,${lieferschein.logo_base64}`}
            alt="Lieferant Logo"
          />
        )}

        {/* Absender + Empfänger */}
        <div className="ls-addresses">
          <div className="ls-absender">
            <h4>Absender</h4>
            <p>
              {lieferschein.ansprechpartner_vorname}{" "}
              {lieferschein.ansprechpartner_nachname}
            </p>
            <p>{lieferschein.firmenname}</p>
            <p>{lieferschein.adresse}</p>
            <p>
              {lieferschein.plz} {lieferschein.ort}
            </p>
          </div>

          <div className="ls-empfaenger">
            <h4>Empfänger</h4>
            <p>TBS Solutions</p>
            <p>Akazienweg 2b</p>
            <p>Timo Blumer</p>
          </div>
        </div>

        {/* Barcodes */}
        <div className="ls-barcode-section">
          <div>
            <span>Lieferscheinnr</span>
            <canvas ref={barcodeRef}></canvas>
          </div>
          <div>
            <span>Auftragsnr</span>
            <canvas ref={auftragRef}></canvas>
          </div>
          <div>
            <span>Lieferant ID</span>
            <canvas ref={lieferantRef}></canvas>
          </div>
        </div>

        {/* Positionen */}
        <div className="ls-positionen">
          <table>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Bezeichnung</th>
                <th>Menge</th>
              </tr>
            </thead>
            <tbody>
              {lieferschein.positionen.map((pos, i) => (
                <tr key={i}>
                  <td>{pos.pos}</td>
                  <td>{pos.bezeichnung}</td>
                  <td>{pos.menge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="ls-actions">
          <button
            className="ls-btn ls-btn--secondary"
            onClick={() => navigate("/lieferscheine")}
          >
            Zurück
          </button>
          <button className="ls-btn ls-btn--primary" onClick={downloadPDF}>
            PDF herunterladen
          </button>
        </div>
      </div>
    </div>
  );
}
