import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import QRCodeReact from 'react-qr-code';
import QRCode from 'qrcode';
import { FaSave, FaUndo, FaEdit, FaFilePdf, FaStar, FaRegStar, FaComments } from 'react-icons/fa';
import './KundenAnzeigen.scss';
import Logo from "./black.png";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9f9f9'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1c3faa',
    paddingBottom: 10,
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c3faa',
    textTransform: 'uppercase'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#555'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1c3faa',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd'
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e6f0ff',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1c3faa'
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#1c3faa'
  },
  bold: { fontWeight: 'bold' },
  footer: {
    position: 'absolute',
    bottom: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    width: '100%'
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3
  },
  serviceName: {
    fontWeight: 'bold',
    color: '#1c3faa'
  },
  employeeName: {
    fontWeight: 'bold',
    color: '#333'
  },
  time: {
    color: '#555'
  },
  totalHours: {
    fontWeight: 'bold',
    color: '#1c3faa'
  }
});

const KundenReportPDFInline = ({ kunde, gesamtArbeitszeit, mitarbeiterArbeitszeiten, dienstleistungMitarbeiter }) => (
  <Document>
    {/* Seite 1: Gesamtarbeitszeit */}
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Arbeitszeitübersicht</Text>
      <Text style={pdfStyles.sectionTitle}>Gesamtarbeitszeit pro Dienstleistung</Text>
      {gesamtArbeitszeit.map(d => (
        <View key={d.dienstleistung_id} style={pdfStyles.row}>
          <Text>{d.dienstleistung}</Text>
          <Text style={pdfStyles.bold}>{d.gesamtArbeitszeit} h</Text>
        </View>
      ))}
      <Text style={pdfStyles.footer}>Kunde: {kunde.vorname} {kunde.nachname}</Text>
    </Page>

    {/* Seiten pro Mitarbeiter */}
    {mitarbeiterArbeitszeiten.map(m => (
      <Page key={m.mitarbeiter_id} size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Arbeitszeiten – {m.vorname} {m.nachname}</Text>
        {m.arbeitszeiten.map((a,i) => (
          <View key={i} style={pdfStyles.row}>
            <Text>{a.dienstleistung}</Text>
            <Text>{a.start_time} – {a.end_time}</Text>
            <Text style={pdfStyles.bold}>{a.arbeitszeit} h</Text>
          </View>
        ))}
        <Text style={pdfStyles.footer}>Mitarbeiter-ID: {m.mitarbeiter_id}</Text>
      </Page>
    ))}

    {/* Zusammenfassung pro Dienstleistung */}
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Arbeitszeit je Dienstleistung</Text>
      {dienstleistungMitarbeiter.map(dl => (
        <View key={dl.dienstleistung_id} style={{ marginBottom: 20 }}>
          <Text style={pdfStyles.sectionTitle}>{dl.dienstleistung}</Text>
          {dl.mitarbeiter.map(m => (
            <View key={m.mitarbeiter_id} style={pdfStyles.row}>
              <Text>{m.vorname} {m.nachname}</Text>
              <Text style={pdfStyles.bold}>
                {m.arbeitszeiten.reduce((sum, a) => sum + Number(a.arbeitszeit), 0)} h
              </Text>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);



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
    // PDF-Daten
    const [gesamtArbeitszeit, setGesamtArbeitszeit] = useState([]);
    const [mitarbeiterArbeitszeiten, setMitarbeiterArbeitszeiten] = useState([]);
    const [dienstleistungMitarbeiter, setDienstleistungMitarbeiter] = useState([]);

  // Kundendaten laden
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
  
    const fetchAll = async () => {
      try {
        setLoading(true);
  
        // 1️⃣ Kundendaten
        const kundeResp = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!mounted) return;
        setSelectedKunde(kundeResp.data.data);
  
        // 2️⃣ Gesamtarbeitszeit pro Dienstleistung
        const gesamtResp = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/dienstleistungen/gesamtarbeitszeit`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGesamtArbeitszeit(gesamtResp.data.dienstleistungen || []);
  
        // 3️⃣ Arbeitszeiten pro Mitarbeiter & Dienstleistung (summiert)
        const mitarbeiterSummiertResp = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/arbeitszeiten/dienstleistungen`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // 🔥 Mapping für PDF: summierte Arbeitszeiten
        const mitarbeiterMap = {};
        mitarbeiterSummiertResp.data.dienstleistungen.forEach(dl => {
          dl.mitarbeiter.forEach(m => {
            if (!mitarbeiterMap[m.mitarbeiter_id]) {
              mitarbeiterMap[m.mitarbeiter_id] = {
                mitarbeiter_id: m.mitarbeiter_id,
                vorname: m.vorname,
                nachname: m.nachname,
                arbeitszeiten: []
              };
            }
            mitarbeiterMap[m.mitarbeiter_id].arbeitszeiten.push({
              dienstleistung: dl.dienstleistung,
              start_time: "-",
              end_time: "-",
              arbeitszeit: m.gesamtArbeitszeit
            });
          });
        });
        setMitarbeiterArbeitszeiten(Object.values(mitarbeiterMap));
  
        // 4️⃣ Alle Stempelungen (Detail)
        const alleStempelResp = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/arbeitszeiten/dienstleistungen`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDienstleistungMitarbeiter(alleStempelResp.data.dienstleistungen || []);
  
      } catch (err) {
        console.error(err);
        alert("Fehler beim Laden der Daten.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
  
    fetchAll();
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
  const copyLinkToClipboard = () => { if (!selectedKunde) return; navigator.clipboard.writeText(`${window.location.origin}/${selectedKunde.kundenId}`); alert('Link zur Unterschrift kopiert.'); };
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

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 50;

  const HEADER_OFFSET = 60; // ← mehr Platz fürs Logo

  const name =
    (selectedKunde.vorname || selectedKunde.nachname)
      ? `${selectedKunde.vorname || ""} ${selectedKunde.nachname || ""}`.trim()
      : selectedKunde.firma || "-";

  let y = margin;

  const colors = {
    text: [30, 30, 30],
    lightText: [120, 120, 120],
    line: [220, 220, 220],
    accent: [25, 55, 120],
  };

  // ================= HEADER =================
  const drawHeader = async () => {
    // LOGO
    try {
      const res = await fetch(Logo);
      const blob = await res.blob();

      const logoData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      doc.addImage(logoData, "PNG", margin, 30, 80, 80);
    } catch {}

    // QR CODE
    try {
      const qrUrl = `${window.location.origin}/kunden/${selectedKunde.kundenId}`;
      const qrData = await QRCode.toDataURL(qrUrl, { margin: 0 });
      doc.addImage(qrData, "PNG", pageW - margin - 60, 30, 60, 60);
    } catch {}

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...colors.text);
    doc.text(name, margin, 110 + HEADER_OFFSET);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.lightText);
    doc.text(
      `Kundennummer: ${selectedKunde.kundennummer} • Generiert: ${new Date().toLocaleDateString()}`,
      margin,
      128 + HEADER_OFFSET
    );

    // LINE
    doc.setDrawColor(...colors.line);
    doc.line(margin, 150 + HEADER_OFFSET, pageW - margin, 150 + HEADER_OFFSET);

    // 👉 Startpunkt für gesamten Inhalt
    y = 180 + HEADER_OFFSET;
  };

  const newPage = () => {
    doc.addPage();
    y = margin;
  };

  const section = (title) => {
    if (y > pageH - 120) newPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.accent);
    doc.text(title.toUpperCase(), margin, y);

    y += 15;

    doc.setDrawColor(...colors.line);
    doc.line(margin, y, pageW - margin, y);
    y += 20;
  };

  const field = (label, value, xOffset = 0) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...colors.lightText);
    doc.text(label.toUpperCase(), margin + xOffset, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...colors.text);
    doc.text(String(value || "-"), margin + xOffset, y + 14);
  };

  await drawHeader();

  // ================= PROFIL =================
  section("Profil");

  const colW = (pageW - margin * 2) / 2;

  field("E-Mail", selectedKunde.email);
  field("Telefon", selectedKunde.mobil, colW);
  y += 40;

  field("Ort", selectedKunde.ort);
  field("Status", selectedKunde.status, colW);
  y += 40;

  // ================= KUNDENDATEN =================
  section("Kundendaten");

  field("Firma", selectedKunde.firma);
  y += 35;

  field("Name", name);
  y += 35;

  field(
    "Adresse",
    `${selectedKunde.strasseHausnummer || ""}, ${selectedKunde.postleitzahl || ""} ${selectedKunde.ort || ""}`
  );
  y += 45;

  // ================= DIENSTLEISTUNGEN =================
  section("Dienstleistungen");

  if (selectedKunde.dienstleistungen?.length) {
    selectedKunde.dienstleistungen.forEach((dl) => {
      if (y > pageH - 100) newPage();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`• ${dl.title}`, margin, y);

      if (dl.beschreibung) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...colors.lightText);

        const text = doc.splitTextToSize(
          dl.beschreibung,
          pageW - margin * 2 - 10
        );
        doc.text(text, margin + 10, y + 14);
        y += text.length * 14;
      }

      y += 20;
    });
  } else {
    doc.text("Keine Dienstleistungen vorhanden.", margin, y);
    y += 20;
  }

  // ================= FOOTER =================
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(...colors.lightText);

    doc.text("Vertraulich – Nur für interne Verwendung", margin, pageH - 20);

    doc.text(`Seite ${i} von ${pageCount}`, pageW - margin, pageH - 20, {
      align: "right",
    });
  }

  doc.save(`KundenReport_${selectedKunde.kundennummer}.pdf`);
};






useEffect(() => {
  let mounted = true;
  const token = localStorage.getItem('token');

  const fetchAll = async () => {
    try {
      setLoading(true);

      // Kundendaten
      const kundeResp = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!mounted) return;
      setSelectedKunde(kundeResp.data.data);

      // Gesamtarbeitszeit pro Dienstleistung
      const gesamtResp = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/dienstleistungen/gesamtarbeitszeit`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGesamtArbeitszeit(gesamtResp.data.dienstleistungen || []);

      // Alle Stempelungen
      const dienstMResp = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/dienstleistungen/mitarbeiter/arbeitszeiten`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔥 Transformieren für PDF
      const mitarbeiterMap = {};

      dienstMResp.data.dienstleistungen.forEach(dl => {
        dl.mitarbeiter.forEach(m => {
          if (!mitarbeiterMap[m.mitarbeiter_id]) {
            mitarbeiterMap[m.mitarbeiter_id] = {
              mitarbeiter_id: m.mitarbeiter_id,
              vorname: m.vorname,
              nachname: m.nachname,
              arbeitszeiten: []
            };
          }

          m.arbeitszeiten.forEach(a => {
            mitarbeiterMap[m.mitarbeiter_id].arbeitszeiten.push({
              dienstleistung: dl.dienstleistung,
              start_time: a.start_time,
              end_time: a.end_time,
              arbeitszeit: a.arbeitszeit
            });
          });
        });
      });

      setMitarbeiterArbeitszeiten(Object.values(mitarbeiterMap));
      setDienstleistungMitarbeiter(dienstMResp.data.dienstleistungen || []);

    } catch (err) {
      console.error(err);
      alert("Fehler beim Laden der Daten");
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchAll();
  return () => { mounted = false; };
}, [id]);





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
      value={`${window.location.origin}/${selectedKunde.kundenId}`}
      size={150}
    />

    <p>Scan den QR-Code, um direkt zum Kunden zu kommen</p>

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

{selectedKunde?.status === "abgeschlossen" && (
  <PDFDownloadLink
    document={
      <KundenReportPDFInline
        kunde={selectedKunde}
        gesamtArbeitszeit={gesamtArbeitszeit}
        mitarbeiterArbeitszeiten={mitarbeiterArbeitszeiten}
        dienstleistungMitarbeiter={dienstleistungMitarbeiter}
      />
    }
    fileName={`KundenReport_${selectedKunde.kundennummer}.pdf`}
    className="btn btn-pdf"
  >
    {({ loading }) => loading ? "PDF wird erstellt…" : "PDF herunterladen"}
  </PDFDownloadLink>
)}




</div>

      </div>
    </div>
  );
}
