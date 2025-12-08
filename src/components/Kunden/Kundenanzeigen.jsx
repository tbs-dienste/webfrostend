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

  // Hintergrund für PDF erzeugen
  const createBackgroundDataUrl = async (widthPx, heightPx) => new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(widthPx); canvas.height = Math.round(heightPx);
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#eaf4ff'); grad.addColorStop(1, '#f7fbff');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);

    const logoData = selectedKunde?.logo || selectedKunde?.logo_black || null;
    if (logoData) {
      const img = new Image();
      img.onload = () => { const maxW = canvas.width * 0.8; const maxH = canvas.height * 0.6; let w = img.width; let h = img.height; const ratio = Math.min(maxW / w, maxH / h, 1); w *= ratio; h *= ratio; const x = (canvas.width - w) / 2; const y = (canvas.height - h) / 2; ctx.globalAlpha = 0.12; ctx.drawImage(img, x, y, w, h); ctx.globalAlpha = 1; resolve(canvas.toDataURL('image/jpeg', 0.9)); };
      img.onerror = () => { ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.font = `${Math.round(canvas.width / 12)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('MUSTERFOTO / LOGO', canvas.width / 2, canvas.height / 2); resolve(canvas.toDataURL('image/jpeg', 0.9)); };
      img.src = logoData.startsWith('data:') ? logoData : `data:image/png;base64,${logoData}`;
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(canvas.width * (0.2 + i * 0.12), canvas.height * (0.2 + (i % 2) * 0.35), Math.min(canvas.width, canvas.height) * 0.18, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.font = `${Math.round(canvas.width / 14)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('MUSTERFOTO', canvas.width / 2, canvas.height / 2 - 10); ctx.font = `${Math.round(canvas.width / 30)}px sans-serif`; ctx.fillText('Ihr Logo / Bild hier', canvas.width / 2, canvas.height / 2 + 30); resolve(canvas.toDataURL('image/jpeg', 0.9)); 
    }
  });
// PDF-Export
const exportToPDF = async () => {
  if (!selectedKunde) return;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;

  // 1) Hintergrund
  try {
    const bg = await createBackgroundDataUrl(pageW, pageH);
    doc.addImage(bg, 'JPEG', 0, 0, pageW, pageH);
  } catch (e) { console.warn(e); }

  doc.setFillColor(255, 255, 255);
  doc.rect(margin, margin + 40, pageW - 2 * margin, pageH - 2 * margin - 80, 'F');

  let y = margin + 70;

  // 2) Header + QR
  doc.setFontSize(20); doc.setFont(undefined, 'bold'); doc.setTextColor(34, 34, 34);
  doc.text('Kundenakte', margin + 10, y);

  try {
    const qrUrl = `${window.location.origin}/sign/${selectedKunde.kundennummer}`;
    const qrDataURL = await QRCode.toDataURL(qrUrl, { margin: 1, width: 300 });
    const qrSize = 90;
    doc.addImage(qrDataURL, 'PNG', pageW - margin - qrSize, margin + 20, qrSize, qrSize);
    doc.setFontSize(8); doc.setFont(undefined, 'normal');
    doc.text('QR: Unterschrift', pageW - margin - qrSize, margin + 20 + qrSize + 12);
  } catch (e) { console.warn(e); }

  y += 30;

  // 3) Kundendaten
  doc.setFontSize(12); doc.setFont(undefined, 'bold'); doc.text('Kundendaten', margin + 10, y);
  y += 18; doc.setFont(undefined, 'normal');

  const infoPairs = [
    ['Kundennummer', selectedKunde.kundennummer],
    ['Firma', selectedKunde.firma],
    ['Vorname', selectedKunde.vorname],
    ['Nachname', selectedKunde.nachname],
    ['E-Mail', selectedKunde.email],
    ['Mobil', selectedKunde.mobil],
    ['Adresse', `${selectedKunde.strasseHausnummer || ''}, ${selectedKunde.postleitzahl || ''} ${selectedKunde.ort || ''}`],
    ['Status', selectedKunde.status]
  ];

  for (const [label, value] of infoPairs) {
    doc.setFont(undefined, 'bold'); doc.text(`${label}:`, margin + 10, y);
    doc.setFont(undefined, 'normal');
    const wrapped = doc.splitTextToSize(String(value || '-'), pageW - margin * 3 - 120);
    doc.text(wrapped, margin + 140, y);
    y += wrapped.length * 12 + 6;

    if (y > pageH - margin - 140) {
      doc.addPage();
      try {
        const bg2 = await createBackgroundDataUrl(pageW, pageH);
        doc.addImage(bg2, 'JPEG', 0, 0, pageW, pageH);
      } catch (e) { console.warn(e); }
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, margin + 30, pageW - 2 * margin, pageH - 2 * margin - 60, 'F');
      y = margin + 70;
    }
  }

  // 4) Bewertung: Nur anzeigen, wenn vorhanden
  const rating = selectedKunde.bewertung ?? selectedKunde.rating;
  const comment = selectedKunde.bewertung_text || selectedKunde.bewertung_comment;

  if (rating !== undefined && rating !== null) {
    y += 6; 
    doc.setFont(undefined, 'bold'); 
    doc.text('Bewertung', margin + 10, y);
    doc.setFontSize(14);

    // Gelbe Sterne-Icons
    const starSize = 12;
    const starX = margin + 120;
    for (let i = 0; i < 5; i++) {
      if (i < Number(rating)) {
        doc.setTextColor(255, 193, 7); // Gelb
        doc.text('★', starX + i * (starSize + 2), y);
      } else {
        doc.setTextColor(200); // Hellgrau
        doc.text('★', starX + i * (starSize + 2), y);
      }
    }
    doc.setTextColor(34, 34, 34);
    y += 20;

    // Kommentar, falls vorhanden
    if (comment) {
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(comment, pageW - 2 * margin - 20);
      doc.text(lines, margin + 10, y);
      y += lines.length * 12 + 8;
    }
  }

  // 5) Dienstleistungen
y += 6; 
doc.setFontSize(12); 
doc.setFont(undefined, 'bold'); 
doc.text('Dienstleistungen', margin + 10, y); 
y += 16; 
doc.setFont(undefined, 'normal');

if (selectedKunde.dienstleistungen?.length) {
  for (const d of selectedKunde.dienstleistungen) {
    // Dienstleistungs-Titel
    doc.setFont(undefined, 'bold'); 
    doc.text(`• ${d.title}`, margin + 14, y); 

    // Abstand nach dem Titel (Margin-Top)
    y += 20; // <-- Abstand zwischen Titel und Beschreibung

    // Beschreibung, eingerückt
    doc.setFont(undefined, 'normal');
    const lines = doc.splitTextToSize(d.beschreibung || '-', pageW - margin * 3 - 40); 
    doc.text(lines, margin + 26, y); 
    y += lines.length * 12 + 10; // Abstand nach Beschreibung

    // Seitenumbruch prüfen
    if (y > pageH - margin - 120) {
      doc.addPage();
      try {
        const bg3 = await createBackgroundDataUrl(pageW, pageH);
        doc.addImage(bg3, 'JPEG', 0, 0, pageW, pageH);
      } catch (e) { console.warn(e); }
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, margin + 30, pageW - 2 * margin, pageH - 2 * margin - 60, 'F');
      y = margin + 70;
    }
  }
} else {
  doc.text('Keine Dienstleistungen vorhanden.', margin + 14, y); 
  y += 20;
}


  // 6) Unterschrift
  if (selectedKunde.unterschrift) {
    const sigY = Math.min(pageH - margin - 120, y + 10);
    doc.setFont(undefined, 'bold'); doc.text('Unterschrift', margin + 10, sigY);
    doc.addImage(`data:image/png;base64,${selectedKunde.unterschrift}`, 'PNG', margin + 10, sigY + 6, 180, 60);
  }

  // 7) Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9); doc.setTextColor(120);
    doc.text(`Seite ${i} von ${pageCount}`, pageW - margin - 70, pageH - margin + 10);
    doc.text(`Exportiert: ${new Date().toLocaleString()}`, margin + 10, pageH - margin + 10);
  }

  doc.save(`Kunde_${selectedKunde.kundennummer || 'export'}.pdf`);
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
