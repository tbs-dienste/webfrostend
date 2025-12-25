import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import QRCodeReact from 'react-qr-code';
import QRCode from 'qrcode';
import { FaSave, FaUndo, FaEdit, FaFilePdf, FaStar, FaRegStar, FaComments } from 'react-icons/fa';
import './KundenAnzeigen.scss';

const StarRow = ({ value = 0 }) => {
  const stars = [...Array(5)].map((_, i) => i < value ? <FaStar key={i} /> : <FaRegStar key={i} />);
  return <span className="star-row">{stars}</span>;
};

export default function KundenAnzeigen() {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  // Kundendaten laden
  useEffect(() => {
    let mounted = true;
    const fetchKunde = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const resp = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = resp?.data?.data;
        if (mounted) {
          setSelectedKunde(data || null);
          setOriginalData(data || null);
          setEditedData(data || {});
        }
      } catch (err) {
        console.error('Fehler beim Laden der Kundendaten:', err);
        alert('Fehler beim Laden der Kundendaten.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchKunde();
    return () => { mounted = false; };
  }, [id]);

  const onEdit = () => { setEditMode(true); setEditedData(selectedKunde); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleInput = (e) => { const { name, value } = e.target; setEditedData(prev => ({ ...prev, [name]: value })); };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, editedData, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedKunde(editedData); setOriginalData(editedData); setEditMode(false);
      alert('Kundendaten gespeichert.');
    } catch (err) { console.error(err); alert('Fehler beim Speichern.'); }
  };
  const handleUndo = () => { setEditedData(originalData || {}); setEditMode(false); };
  const copyLinkToClipboard = () => { if (!selectedKunde) return; navigator.clipboard.writeText(`${window.location.origin}/sign/${selectedKunde.kundennummer}`); alert('Link zur Unterschrift kopiert.'); };
  const updateStatus = async (newStatus) => { try { const token = localStorage.getItem('token'); await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } }); setSelectedKunde(prev => ({ ...prev, status: newStatus })); alert('Status aktualisiert.'); } catch (err) { console.error(err); alert('Fehler beim Aktualisieren des Status.'); } };

 // Helper: erzeugt ein ansprechendes Hintergrundbild (Musterfoto / Logo-Fallback)
const createBackgroundDataUrl = async (widthPx, heightPx) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(widthPx);
    canvas.height = Math.round(heightPx);
    const ctx = canvas.getContext('2d');

    // sanfter diagonaler Farbverlauf
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#f4f9ff');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // leichte geometrische Muster (dezent)
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const r = Math.min(canvas.width, canvas.height) * (0.08 + (i * 0.01));
      ctx.arc(canvas.width * (0.08 + i * 0.11), canvas.height * (0.2 + (i % 2) * 0.5), r, 0, Math.PI * 2);
      ctx.fill();
    }

    // falls Firma-Logo vorhanden -> watermark groß, sehr transparent
    const logoData = selectedKunde?.logo || selectedKunde?.logo_black || null;
    if (logoData) {
      const img = new Image();
      img.onload = () => {
        const maxW = canvas.width * 0.7;
        const maxH = canvas.height * 0.45;
        let w = img.width, h = img.height;
        const ratio = Math.min(maxW / w, maxH / h, 1);
        w *= ratio; h *= ratio;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;
        ctx.globalAlpha = 0.10; // dezenter watermark-effekt
        ctx.drawImage(img, x, y, w, h);
        ctx.globalAlpha = 1;
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => {
        // fallback text
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.font = `${Math.round(canvas.width / 18)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('MUSTERFOTO', canvas.width / 2, canvas.height / 2);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = logoData.startsWith('data:') ? logoData : `data:image/png;base64,${logoData}`;
    } else {
      // fallback: zentrierter Text + subtle shapes (already drawn)
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.font = `${Math.round(canvas.width / 20)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('MUSTERFOTO', canvas.width / 2, canvas.height / 2 - 6);
      ctx.font = `${Math.round(canvas.width / 36)}px sans-serif`;
      ctx.fillText('Ihr Logo / Bild hier', canvas.width / 2, canvas.height / 2 + 26);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    }
  });
};

// PROFESSIONAL exportToPDF (KUNDEN-DOSSIER)
const exportToPDF = async () => {
  if (!selectedKunde) return;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48; // großzügigere Ränder für Profidesign

  // ====== Hintergrund (ganze Seite) ======
  try {
    const bg = await createBackgroundDataUrl(pageW, pageH);
    doc.addImage(bg, 'JPEG', 0, 0, pageW, pageH);
  } catch (e) {
    console.warn('Background creation failed', e);
  }

  // Weißer Inhaltspanel (leicht gerundete Optik simulated by rect)
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, margin + 36, pageW - 2 * margin, pageH - 2 * margin - 40, 'F');

  // ====== HEADER: Logo links, Titel Mitte/links, QR rechts ======
  let y = margin + 60;

  // Logo oben links (falls vorhanden)
  if (selectedKunde?.logo) {
    try {
      const logoSrc = selectedKunde.logo.startsWith('data:') ? selectedKunde.logo : `data:image/png;base64,${selectedKunde.logo}`;
      // kleine Version links oben
      doc.addImage(logoSrc, 'PNG', margin + 8, margin + 12, 72, 36); // 2:1 ratio area
    } catch (e) {
      // ignore logo errors
    }
  }

  // Title: KUNDEN-DOSSIER (professionell)
  doc.setTextColor(20, 32, 80); // dunkles Corporate-Blau
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('KUNDEN-DOSSIER', margin + 96, margin + 40);

  // Subline / Kurzinfo rechts unter dem QR
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(110);
  const subText = selectedKunde?.firma ? `${selectedKunde.firma}` : `${selectedKunde?.vorname || ''} ${selectedKunde?.nachname || ''}`;
  doc.text(subText, margin + 96, margin + 58);

  // QR-Code oben rechts
  try {
    const qrUrl = `${window.location.origin}/sign/${selectedKunde.kundennummer}`;
    const qrDataURL = await QRCode.toDataURL(qrUrl, { margin: 0, width: 400 });
    const qrSize = 86;
    doc.addImage(qrDataURL, 'PNG', pageW - margin - qrSize, margin + 14, qrSize, qrSize);
    doc.setFontSize(8);
    doc.setTextColor(110);
    doc.text('Scan zum Signieren', pageW - margin - qrSize, margin + 14 + qrSize + 12);
  } catch (e) {
    console.warn('QR error', e);
  }

  // feine Trennlinie unter Header
  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.line(margin + 6, margin + 100, pageW - margin - 6, margin + 100);

  y = margin + 110;

  // ====== INFO CARD (links) + Meta Card / Status (rechts) ======
  const cardLeftX = margin + 12;
  const cardRightX = pageW / 2 + 6;
  const cardWidthLeft = pageW / 2 - margin - 18;
  const cardWidthRight = pageW / 2 - margin - 18;

  // left card header
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(36, 41, 66);
  doc.text('Kundendaten', cardLeftX, y);

  // right card header (Status / Bewertung quick)
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Status & Bewertung', cardRightX, y);

  y += 14;

  // body: left column fields (use for...of to allow awaits on page break)
  const infoPairs = [
    ['Kundennummer', selectedKunde.kundennummer],
    ['Firma', selectedKunde.firma],
    ['Vorname', selectedKunde.vorname],
    ['Nachname', selectedKunde.nachname],
    ['E-Mail', selectedKunde.email],
    ['Mobil', selectedKunde.mobil],
    ['Adresse', `${selectedKunde.strasseHausnummer || ''}${selectedKunde.postleitzahl ? ', ' : ''}${selectedKunde.postleitzahl || ''} ${selectedKunde.ort || ''}`],
  ];

  // draw left info box background
  doc.setFillColor(250, 252, 255);
  doc.rect(cardLeftX - 6, y - 12, cardWidthLeft + 12, 110, 'F');

  // draw right info box background
  doc.setFillColor(250, 250, 250);
  doc.rect(cardRightX - 6, y - 12, cardWidthRight + 12, 110, 'F');

  // left fields
  let leftY = y + 6;
  doc.setFontSize(10);
  doc.setTextColor(70);
  for (const [label, value] of infoPairs) {
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, cardLeftX, leftY);
    doc.setFont(undefined, 'normal');
    const wrapped = doc.splitTextToSize(String(value || '-'), cardWidthLeft - 110);
    doc.text(wrapped, cardLeftX + 110, leftY);
    leftY += wrapped.length * 12 + 8;
  }

  // right: Status badge + Bewertung (stars)
  let rightY = y + 6;
  // Status badge rectangle
  const status = selectedKunde.status || '–';
  // small colored badge
  const statusColor = status === 'abgeschlossen' ? [56, 142, 60] : status === 'inBearbeitung' ? [255, 193, 7] : [120, 144, 156];
  doc.setFillColor(...statusColor);
  doc.rect(cardRightX, rightY - 8, 96, 18, 'F');
  doc.setTextColor(255);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text(status.charAt(0).toUpperCase() + status.slice(1), cardRightX + 8, rightY + 6);

  // Bewertung (gelbe Sterne) under badge
  rightY += 30;
  const rating = selectedKunde.bewertung ?? selectedKunde.rating ?? null;
  if (rating !== null && rating !== undefined) {
    doc.setFontSize(12);
    const starBaseX = cardRightX;
    for (let i = 0; i < 5; i++) {
      if (i < Number(rating)) {
        doc.setTextColor(255, 193, 7); // gold
      } else {
        doc.setTextColor(200); // light gray
      }
      doc.text('★', starBaseX + i * 14, rightY);
    }
    doc.setTextColor(80);
    doc.setFontSize(9);
    doc.text(`${rating}/5`, cardRightX + 88, rightY + 2);
    rightY += 18;
  } else {
    // no rating -> show nothing (user requested)
  }

  // small divider
  y = Math.max(leftY, rightY) + 12;
  doc.setDrawColor(220);
  doc.setLineWidth(0.4);
  doc.line(margin + 8, y, pageW - margin - 8, y);

  // ====== SERVICES (volle Breite, card style) ======
  y += 18;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(13);
  doc.setTextColor(36, 41, 66);
  doc.text('Dienstleistungen', margin + 12, y);
  y += 12;

  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);

  if (selectedKunde.dienstleistungen?.length) {
    for (const d of selectedKunde.dienstleistungen) {
      // service card box
      const cardHStart = y;
      doc.setFillColor(255, 255, 255);
      doc.rect(margin + 8, y - 6, pageW - 2 * margin - 16, 8, 'F'); // just background to ensure contrast

      doc.setFont(undefined, 'bold');
      doc.setTextColor(22, 33, 62);
      doc.text(d.title || '–', margin + 16, y + 6);

      // description
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(d.beschreibung || '-', pageW - 2 * margin - 32);
      doc.text(descLines, margin + 16, y + 22);
      y += descLines.length * 12 + 28;

      // small separator between services
      doc.setDrawColor(240);
      doc.setLineWidth(0.6);
      doc.line(margin + 12, y - 6, pageW - margin - 12, y - 6);

      // page break handling
      if (y > pageH - margin - 120) {
        doc.addPage();
        try {
          const bgN = await createBackgroundDataUrl(pageW, pageH);
          doc.addImage(bgN, 'JPEG', 0, 0, pageW, pageH);
        } catch (e) { /* ignore */ }
        // redraw white content panel on new page
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, margin + 36, pageW - 2 * margin, pageH - 2 * margin - 40, 'F');
        y = margin + 70;
      }
    }
  } else {
    // nothing to show (user wanted no rating block when missing and no services if empty)
    doc.setFontSize(11);
    doc.setTextColor(110);
    doc.text('Keine Dienstleistungen vorhanden.', margin + 12, y);
    y += 20;
  }

  // ====== Unterschrift (unten links) ======
  y += 10;
  if (selectedKunde.unterschrift) {
    const sigBoxY = Math.min(pageH - margin - 100, y);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(36, 41, 66);
    doc.text('Unterschrift', margin + 12, sigBoxY);
    try {
      doc.addImage(`data:image/png;base64,${selectedKunde.unterschrift}`, 'PNG', margin + 12, sigBoxY + 6, 180, 60);
    } catch (e) { /* ignore */ }
  }

  // ====== Footer: Datum + Seite ======
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120);
    // left: date
    doc.text(`Exportiert: ${new Date().toLocaleString()}`, margin + 10, pageH - margin + 8);
    // right: page
    doc.text(`Seite ${i} von ${pageCount}`, pageW - margin - 80, pageH - margin + 8);
  }

  // finalize
  doc.save(`KundenDossier_${selectedKunde.kundennummer || 'export'}.pdf`);
};




  if(loading) return <p>Lade Kundendaten…</p>;
  if(!selectedKunde) return <p>Kunde nicht gefunden.</p>;

  return (
    <div className="kunden-anzeigen-container">
      <div className="customer-card">
        <div className="header-row">
          <h2>{selectedKunde.firma || `${selectedKunde.vorname} ${selectedKunde.nachname}`}</h2>
          <div className="header-buttons">
            <button className="btn btn-pdf" onClick={exportToPDF}><FaFilePdf /> PDF</button>
            {!editMode && <button className="btn btn-edit" onClick={onEdit}><FaEdit /> Bearbeiten</button>}
          </div>
        </div>

        <div className="section-title">Kundendaten</div>
        <div className="details-grid">
          {['kundennummer','firma','vorname','nachname','email','mobil','strasseHausnummer','postleitzahl','ort','status'].map(name=>(
            <div className="detail-item" key={name}>
              <label>{name.charAt(0).toUpperCase()+name.slice(1)}</label>
              {editMode?<input name={name} value={editedData[name]||''} onChange={handleInput}/>:
                <div className="value">{selectedKunde[name]||'–'}</div>}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="button-row">
            <button className="btn btn-save" onClick={handleSave}><FaSave /> Speichern</button>
            <button className="btn btn-undo" onClick={handleUndo}><FaUndo /> Abbrechen</button>
          </div>
        )}

        <div className="status-box">
          <h3>Status aktualisieren</h3>
          <div className="status-buttons">
            {['offen','inBearbeitung','abgeschlossen'].map(s=>(
              <button key={s} className={selectedKunde.status===s?'active':''} onClick={()=>updateStatus(s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
        </div>

        <div className="qr-code-box">
          <div className="section-title">QR-Code zur Unterschrift</div>
          <QRCodeReact value={`${window.location.origin}/sign/${selectedKunde.kundennummer}`} size={150} />
          <p>Scan den QR-Code, um direkt die Unterschrift zu hinterlegen.</p>
          <button className="btn btn-edit" onClick={copyLinkToClipboard}><FaComments /> Link kopieren</button>
        </div>

        <div className="section-title" style={{marginTop:'1.6rem'}}>Dienstleistungen</div>
        <div className="service-list">
          {selectedKunde.dienstleistungen?.length ? selectedKunde.dienstleistungen.map(d=>(
            <div key={d.id||d.title} className="service-card"><strong>{d.title}</strong><div>{d.beschreibung||'–'}</div></div>
          )):<div className="service-card">Keine Dienstleistungen vorhanden.</div>}
        </div>

        <div className="signature-box">
          <div className="section-title">Unterschrift</div>
          {selectedKunde.unterschrift ? <img src={`data:image/png;base64,${selectedKunde.unterschrift}`} alt="Unterschrift" />:<p className="muted">Keine Unterschrift hinterlegt.</p>}
        </div>

        <div className="footer-buttons">
          <Link to={`/arbeitszeiten/${id}`} className="btn btn-edit">Arbeitszeiten</Link>
          <button className="btn btn-pdf" onClick={exportToPDF}><FaFilePdf /> Akte PDF</button>
        </div>
      </div>
    </div>
  );
}
