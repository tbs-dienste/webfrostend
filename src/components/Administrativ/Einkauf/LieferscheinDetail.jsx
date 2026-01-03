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
  
    const safe = (v) => String(v ?? "");
  
    /* =================================================
       SEITE 1 – QUERFORMAT (KOPFSEITE)
    ================================================= */
  
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
  
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
  
    /* ---------- TITEL ---------- */
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("LIEFERSCHEIN", 15, 20);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Lieferscheinnr.: ${safe(lieferschein.lieferschein_nr)}`,
      15,
      30
    );
    doc.text(
      `Auftragsnr.: ${safe(lieferschein.auftragsnummer)}`,
      15,
      38
    );
    doc.text(
      `Datum: ${safe(new Date(lieferschein.datum).toLocaleDateString())}`,
      15,
      46
    );
  
    /* ---------- LOGO ---------- */
    if (lieferschein.logo_base64) {
      doc.addImage(
        `data:image/png;base64,${lieferschein.logo_base64}`,
        "PNG",
        235,
        15,
        45,
        25
      );
    }
  
    /* ---------- TRENNLINIE ---------- */
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(15, 52, 285, 52);
  
    /* ---------- ABSENDER ---------- */
    let y = 62;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Absender", 15, y);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    y += 8;
    doc.text(
      `${safe(lieferschein.firmenname)}`,
      15,
      y
    );
    y += 6;
    doc.text(
      `${safe(lieferschein.adresse)}`,
      15,
      y
    );
    y += 6;
    doc.text(
      `${safe(lieferschein.plz)} ${safe(lieferschein.ort)}`,
      15,
      y
    );
  
    /* ---------- WER HAT GELIEFERT ---------- */
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Geliefert durch", 15, y);
  
    doc.setFont("helvetica", "normal");
    y += 8;
    doc.text(
      `${safe(lieferschein.ansprechpartner_vorname)} ${safe(
        lieferschein.ansprechpartner_nachname
      )}`,
      15,
      y
    );
  
    /* ---------- EMPFÄNGER ---------- */
    let ry = 62;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Empfänger", 110, ry);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    ry += 8;
    doc.text("TBS Solutions", 110, ry);
    ry += 6;
    doc.text("Akazienweg 2b", 110, ry);
    ry += 6;
    doc.text("Timo Blumer", 110, ry);
  
    /* ---------- BARCODES ---------- */
    const canvasToDataURL = (ref) =>
      ref?.current ? ref.current.toDataURL("image/png") : null;
  
    const barcodes = [
      { ref: barcodeRef, label: "Lieferscheinnummer" },
      { ref: auftragRef, label: "Auftragsnummer" },
    ];
  
    let barcodeY = 62;
    const barcodeX = 200;
  
    barcodes.forEach((bc) => {
      const img = canvasToDataURL(bc.ref);
      if (!img) return;
  
      doc.setFontSize(11);
      doc.setTextColor(120);
      doc.text(bc.label, barcodeX, barcodeY - 3);
  
      doc.addImage(img, "PNG", barcodeX, barcodeY, 70, 25);
      barcodeY += 35;
    });
  
    /* =================================================
       SEITE 2 – HOCHFORMAT (POSITIONEN)
    ================================================= */
  
    doc.addPage("a4", "landscape");
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(60);
    doc.text("Positionen", 10, 15);
  
    doc.setFont("helvetica", "normal");
  
    const tableRows = lieferschein.positionen.map((pos) => [
      safe(pos.pos),
      safe(pos.bezeichnung),
      safe(pos.menge),
    ]);
  
    doc.autoTable({
      head: [["Pos", "Bezeichnung", "Menge"]],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 11,
        textColor: 60,
        lineColor: 220,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: 60,
        fontStyle: "bold",
      },
      theme: "grid",
    });
  
    /* ---------- FOOTER (ALLE SEITEN) ---------- */
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        "Elektronisch erstellter Lieferschein – gültig ohne Unterschrift",
        10,
        pageHeight - 10
      );
    }
  
    doc.save(`Lieferschein_${safe(lieferschein.lieferschein_nr)}.pdf`);
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
