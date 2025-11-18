import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import QRCodeReact from 'react-qr-code'; // React QR Code Component
import QRCode from 'qrcode'; // Für PDF
import { FaSave, FaUndo, FaEdit, FaFilePdf, FaStar, FaRegStar, FaComments, FaUserCheck, FaClipboardCheck } from 'react-icons/fa';
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

  const onEdit = () => {
    setEditMode(true);
    setEditedData(selectedKunde);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, editedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedKunde(editedData);
      setOriginalData(editedData);
      setEditMode(false);
      alert('Kundendaten gespeichert.');
    } catch (err) {
      console.error(err);
      alert('Fehler beim Speichern.');
    }
  };

  const handleUndo = () => {
    setEditedData(originalData || {});
    setEditMode(false);
  };

  const copyLinkToClipboard = () => {
    if (!selectedKunde) return;
    const signLink = `${window.location.origin}/sign/${selectedKunde.kundennummer}`;
    navigator.clipboard.writeText(signLink);
    alert('Link zur Unterschrift kopiert.');
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedKunde(prev => ({ ...prev, status: newStatus }));
      alert('Status aktualisiert.');
    } catch (err) {
      console.error(err);
      alert('Fehler beim Aktualisieren des Status.');
    }
  };

  const exportToPDF = async () => {
    if (!selectedKunde) return;
  
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = 60;
  
    // --- HEADER ---
    doc.setFillColor(52, 152, 219); // Blaues Header-Background
    doc.rect(0, 0, doc.internal.pageSize.width, 80, 'F');
  
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('Kundenakte', margin, 50);
  
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Exportiert: ${new Date().toLocaleString()}`, doc.internal.pageSize.width - margin - 150, 50);
  
    y = 100; // Start nach Header
  
    // --- Kundendaten Tabelle ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Kundendaten', margin, y);
    y += 15;
  
    const infoPairs = [
      ['Kundennummer', selectedKunde.kundennummer],
      ['Firma', selectedKunde.firma],
      ['Vorname', selectedKunde.vorname],
      ['Nachname', selectedKunde.nachname],
      ['E-Mail', selectedKunde.email],
      ['Mobil', selectedKunde.mobil],
      ['Adresse', `${selectedKunde.strasseHausnummer || ''}, ${selectedKunde.postleitzahl || ''} ${selectedKunde.ort || ''}`],
      ['Status', selectedKunde.status],
    ];
  
    infoPairs.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, margin, y);
      doc.setFont(undefined, 'normal');
      doc.text(value || '-', margin + 120, y);
      y += 18;
      if (y > 700) { doc.addPage(); y = margin; }
    });
  
    // --- Dienstleistungen ---
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Dienstleistungen', margin, y);
    y += 15;
  
    if (selectedKunde.dienstleistungen?.length) {
      selectedKunde.dienstleistungen.forEach((d, idx) => {
        doc.setFont(undefined, 'bold');
        doc.text(`• ${d.title}`, margin, y);
        doc.setFont(undefined, 'normal');
        const descLines = doc.splitTextToSize(d.beschreibung || '-', doc.internal.pageSize.width - 2 * margin - 20);
        doc.text(descLines, margin + 10, y);
        y += descLines.length * 12 + 10;
        if (y > 700) { doc.addPage(); y = margin; }
      });
    } else {
      doc.setFont(undefined, 'normal');
      doc.text('Keine Dienstleistungen vorhanden.', margin, y);
      y += 20;
    }
  
    // --- QR-Code zur Unterschrift ---
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('QR-Code zur Unterschrift:', margin, y);
    y += 10;
  
    try {
      const qrDataURL = await QRCode.toDataURL(`${window.location.origin}/sign/${selectedKunde.kundennummer}`);
      if (y + 150 > 800) { doc.addPage(); y = margin; }
      doc.addImage(qrDataURL, 'PNG', margin, y, 140, 140);
      y += 150;
    } catch (err) {
      console.warn('QR-Code konnte nicht hinzugefügt werden', err);
    }
  
    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Seite ${i} von ${pageCount}`, doc.internal.pageSize.width - margin - 50, doc.internal.pageSize.height - 20);
    }
  
    doc.save(`Kunde_${selectedKunde.kundennummer || 'export'}.pdf`);
  };
  
  if (loading) return <p>Lade Kundendaten…</p>;
  if (!selectedKunde) return <p>Kunde nicht gefunden.</p>;

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
          {[
            {label: 'Kundennummer', name: 'kundennummer'},
            {label: 'Firma', name: 'firma'},
            {label: 'Vorname', name: 'vorname'},
            {label: 'Nachname', name: 'nachname'},
            {label: 'E-Mail', name: 'email'},
            {label: 'Mobil', name: 'mobil'},
            {label: 'Adresse', name: 'strasseHausnummer'},
            {label: 'PLZ', name: 'postleitzahl'},
            {label: 'Ort', name: 'ort'},
            {label: 'Status', name: 'status'}
          ].map(({label,name}) => (
            <div className="detail-item" key={name}>
              <label>{label}</label>
              {editMode ? (
                <input name={name} value={editedData[name] || ''} onChange={handleInput} />
              ) : (
                <div className="value">{selectedKunde[name] || '–'}</div>
              )}
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
            {['offen','inBearbeitung','abgeschlossen'].map(s => (
              <button key={s} className={selectedKunde.status === s ? 'active' : ''} onClick={() => updateStatus(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="qr-code-box">
          <div className="section-title">QR-Code zur Unterschrift</div>
          <QRCodeReact value={`${window.location.origin}/sign/${selectedKunde.kundennummer}`} size={150} />
          <p>Scan den QR-Code, um direkt die Unterschrift zu hinterlegen.</p>
          <button className="btn btn-edit" onClick={copyLinkToClipboard}><FaComments /> Link kopieren</button>
        </div>

        <div className="section-title" style={{ marginTop: '1.6rem' }}>Dienstleistungen</div>
        <div className="service-list">
          {selectedKunde.dienstleistungen?.length ? selectedKunde.dienstleistungen.map((d) => (
            <div key={d.id || d.title} className="service-card">
              <strong>{d.title}</strong>
              <div>{d.beschreibung || '–'}</div>
            </div>
          )) : <div className="service-card">Keine Dienstleistungen vorhanden.</div>}
        </div>

        <div className="signature-box">
          <div className="section-title">Unterschrift</div>
          {selectedKunde.unterschrift ? (
            <img src={`data:image/png;base64,${selectedKunde.unterschrift}`} alt="Unterschrift" />
          ) : <p className="muted">Keine Unterschrift hinterlegt.</p>}
        </div>

        <div className="footer-buttons">
          <Link to={`/arbeitszeiten/${id}`} className="btn btn-edit">Arbeitszeiten</Link>
          <button className="btn btn-pdf" onClick={exportToPDF}><FaFilePdf /> Akte PDF</button>
        </div>
      </div>
    </div>
  );
}
