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
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setIsAdmin(userType === "admin");
  }, []);
  

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


const exportToPDF = async () => {
  if (!selectedKunde) return;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  // ===== Hintergrund hellgrau =====
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageW, pageH, 'F');

  // ===== HEADER =====
  const headerH = 70;
  doc.setFillColor(20, 32, 80); // dunkles Blau
  doc.rect(margin, y, pageW - 2 * margin, headerH, 'F');

  // Logo links
  if (selectedKunde?.logo) {
    try {
      const logoSrc = selectedKunde.logo.startsWith('data:')
        ? selectedKunde.logo
        : `data:image/png;base64,${selectedKunde.logo}`;
      doc.addImage(logoSrc, 'PNG', margin + 10, y + 10, 70, 35);
    } catch (e) {}
  }

  // Titel zentriert
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('KUNDEN-DOSSIER', pageW / 2, y + 40, { align: 'center' });

  // Subtext unter Titel
  const subText = selectedKunde?.firma
    ? selectedKunde.firma
    : `${selectedKunde?.vorname || ''} ${selectedKunde?.nachname || ''}`;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(subText, pageW / 2, y + 55, { align: 'center' });

  // QR-Code rechts
  try {
    const qrUrl = `${window.location.origin}/sign/${selectedKunde.kundennummer}`;
    const qrDataURL = await QRCode.toDataURL(qrUrl, { margin: 0, width: 400 });
    const qrSize = 60;
    doc.addImage(qrDataURL, 'PNG', pageW - margin - qrSize, y + 5, qrSize, qrSize);
  } catch (e) {}

  y += headerH + 20;

  // ===== PANEL 1: Kundendaten (links) & Status (rechts) =====
  const panelWidth = (pageW - 3 * margin) / 2;
  const panelHeight = 130;

  // Kundendaten
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, panelWidth, panelHeight, 10, 10, 'F');
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(36, 41, 66);
  doc.text('Kundendaten', margin + 12, y + 20);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  let leftY = y + 35;
  const infoPairs = [
    ['Kundennummer', selectedKunde.kundennummer],
    ['Firma', selectedKunde.firma],
    ['Vorname', selectedKunde.vorname],
    ['Nachname', selectedKunde.nachname],
    ['E-Mail', selectedKunde.email],
    ['Mobil', selectedKunde.mobil],
    ['Adresse', `${selectedKunde.strasseHausnummer || ''}${selectedKunde.postleitzahl ? ', ' : ''}${selectedKunde.postleitzahl || ''} ${selectedKunde.ort || ''}`],
  ];
  for (const [label, value] of infoPairs) {
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, margin + 12, leftY);
    doc.setFont(undefined, 'normal');
    const wrapped = doc.splitTextToSize(String(value || '-'), panelWidth - 90);
    doc.text(wrapped, margin + 90, leftY);
    leftY += wrapped.length * 12 + 6;
  }

  // Status Panel
  const rightX = margin * 2 + panelWidth;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(rightX, y, panelWidth, panelHeight, 10, 10, 'F');

  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(36, 41, 66);
  doc.text('Status & Bewertung', rightX + 12, y + 20);

  // Status Badge
  const status = selectedKunde.status || '–';
  const statusColor =
    status === 'abgeschlossen'
      ? [56, 142, 60]
      : status === 'inBearbeitung'
      ? [255, 193, 7]
      : [120, 144, 156];
  doc.setFillColor(...statusColor);
  doc.roundedRect(rightX + 12, y + 28, 90, 20, 5, 5, 'F');
  doc.setTextColor(255);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text(status.charAt(0).toUpperCase() + status.slice(1), rightX + 16, y + 42);

  // Sterne Bewertung
  const rating = selectedKunde.bewertung ?? selectedKunde.rating ?? 0;
  const starY = y + 70;
  for (let i = 0; i < 5; i++) {
    const color = i < Number(rating) ? [255, 193, 7] : [200, 200, 200];
    doc.setTextColor(...color);
    doc.text('★', rightX + 12 + i * 16, starY);
  }
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`${rating}/5`, rightX + 90, starY + 2);

  y += panelHeight + 25;

  // ===== PANEL 2: Dienstleistungen (volle Breite) =====
  const serviceHeight = 50;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(13);
  doc.setTextColor(36, 41, 66);
  doc.text('Dienstleistungen', margin, y);
  y += 18;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);

  if (selectedKunde.dienstleistungen?.length) {
    for (const d of selectedKunde.dienstleistungen) {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y, pageW - 2 * margin, serviceHeight, 8, 8, 'F');

      doc.setFont(undefined, 'bold');
      doc.setTextColor(22, 33, 62);
      doc.text(d.title || '–', margin + 12, y + 18);

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(d.beschreibung || '-', pageW - 2 * margin - 24);
      doc.text(descLines, margin + 12, y + 34);
      y += descLines.length * 12 + 42;

      doc.setDrawColor(240);
      doc.setLineWidth(0.6);
      doc.line(margin + 12, y - 6, pageW - margin - 12, y - 6);

      if (y > pageH - margin - 100) {
        doc.addPage();
        y = margin;
      }
    }
  } else {
    doc.setFontSize(11);
    doc.setTextColor(110);
    doc.text('Keine Dienstleistungen vorhanden.', margin, y);
    y += 30;
  }

  // ===== Unterschrift & Footer =====
  if (selectedKunde.unterschrift) {
    const sigBoxY = Math.min(pageH - margin - 100, y);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(36, 41, 66);
    doc.text('Unterschrift', margin, sigBoxY);
    try {
      doc.addImage(`data:image/png;base64,${selectedKunde.unterschrift}`, 'PNG', margin, sigBoxY + 6, 180, 60);
    } catch (e) {}
  }

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Exportiert: ${new Date().toLocaleString()}`, margin, pageH - margin + 8);
    doc.text(`Seite ${i} von ${pageCount}`, pageW - margin - 80, pageH - margin + 8);
  }

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
{/* Bewertungs-Mail / Anzeige der Bewertung */}
{selectedKunde.status === 'abgeschlossen' && (
  <>
    {!selectedKunde.bewertung ? (
      <div className="bewertung-box">
        <div className="section-title">Kundenbewertung</div>
        <p>Kunde kann nach Abschluss eine Bewertung abgeben.</p>

        {isAdmin && (
          <button
            className="btn btn-pdf"
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const resp = await axios.post(
                  `https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/send-mail/${selectedKunde.id}`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                alert(resp.data.message || 'Bewertungsmail erfolgreich gesendet.');
              } catch (err) {
                console.error(err);
                alert('Fehler beim Senden der Bewertungsmail.');
              }
            }}
          >
            <FaStar /> Bewertungsmail senden
          </button>
        )}
      </div>
    ) : (
      <div className="bewertung-box bewertung-vorhanden">
        <div className="section-title">Kundenbewertung</div>

        {/* Gesamtrating */}
        <p><strong>Gesamtrating:</strong></p>
        <StarRow value={selectedKunde.bewertung.gesamtrating || 0} />

        {selectedKunde.bewertung.gesamttext && (
          <p style={{ marginTop: '8px' }}>
            <strong>Kommentar:</strong> {selectedKunde.bewertung.gesamttext}
          </p>
        )}

        <hr style={{ margin: '15px 0', borderColor: '#ddd' }} />

        {/* Unterbewertungen */}
        <div className="unterbewertungen">
          {[
            { label: 'Arbeitsqualität', key: 'arbeitsqualitaet', ratingKey: 'arbeitsqualitaet_rating' },
            { label: 'Tempo', key: 'tempo', ratingKey: 'tempo_rating' },
            { label: 'Freundlichkeit', key: 'freundlichkeit', ratingKey: 'freundlichkeit_rating' },
            { label: 'Zufriedenheit', key: 'zufriedenheit', ratingKey: 'zufriedenheit_rating' },
            { label: 'Kommunikation', key: 'kommunikation', ratingKey: 'kommunikation_rating' },
            { label: 'Zuverlässigkeit', key: 'zuverlaessigkeit', ratingKey: 'zuverlaessigkeit_rating' },
            { label: 'Professionalität', key: 'professionalitaet', ratingKey: 'professionalitaet_rating' },
          ].map(item => (
            <div key={item.key} style={{ marginBottom: '12px' }}>
              <p style={{ margin: 0, fontWeight: 500 }}>{item.label}:</p>
              <StarRow value={selectedKunde.bewertung[item.ratingKey] || 0} />
              {selectedKunde.bewertung[item.key] && (
                <p style={{ margin: '2px 0 0 0', color: '#555' }}>{selectedKunde.bewertung[item.key]}</p>
              )}
            </div>
          ))}
        </div>

        <hr style={{ margin: '15px 0', borderColor: '#ddd' }} />

        <p>
          <em>Abgegeben am: {new Date(selectedKunde.bewertung.createdAt).toLocaleDateString()}</em>
        </p>
      </div>
    )}
  </>
)}


{!selectedKunde.unterschrift && (
  <div className="qr-code-box">
    <div className="section-title">QR-Code zur Unterschrift</div>

    <QRCodeReact
      value={`${window.location.origin}/sign/${selectedKunde.kundennummer}`}
      size={150}
    />

    <p>Scan den QR-Code, um direkt die Unterschrift zu hinterlegen.</p>

    <button className="btn btn-edit" onClick={copyLinkToClipboard}>
      <FaComments /> Link kopieren
    </button>
  </div>
)}

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
  {isAdmin && (
    <Link to={`/arbeitszeiten/${id}`} className="btn btn-edit">
      Arbeitszeiten
    </Link>
  )}
</div>

      </div>
    </div>
  );
}
