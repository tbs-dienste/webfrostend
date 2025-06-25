import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaUndo, FaEdit, FaCopy, FaFilePdf } from 'react-icons/fa';
import './KundenAnzeigen.scss';
import jsPDF from "jspdf";
import { FaStar, FaRegStar, FaComments, FaUserCheck, FaClipboardCheck } from "react-icons/fa";


const KundenAnzeigen = () => {
  const { id } = useParams();
  const [selectedKunde, setSelectedKunde] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKunde() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const kunde = response.data.data;
        if (kunde) {
          setSelectedKunde(kunde);
          setOriginalData(kunde);
          setEditedData(kunde);
        } else {
          console.error('Kunde nicht gefunden');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Kunden:', error);
        alert('Fehler beim Abrufen der Kundendaten. Bitte versuche es später noch einmal.');
      } finally {
        setLoading(false);
      }
    }

    fetchKunde();
  }, [id]);

  const handleEdit = () => {
    setEditMode(true);
    setEditedData(selectedKunde);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? <FaStar key={i} color="#f5c518" /> : <FaRegStar key={i} color="#ccc" />
    );
  };

  const exportToPDF = () => {
    if (!selectedKunde) return;
  
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Kundendaten - Akte", 14, 20);
  
    doc.setFontSize(12);
    doc.text(`Exportdatum: ${new Date().toLocaleDateString()}`, 14, 28);
  
    let y = 38;
  
    const addText = (label, value) => {
      doc.setFont(undefined, "bold");
      doc.text(`${label}:`, 14, y);
      doc.setFont(undefined, "normal");
      const splitText = doc.splitTextToSize(value || "-", 180);
      doc.text(splitText, 50, y);
      y += splitText.length * 7 + 4;
    };
  
    // Grunddaten Kunde
    addText("Kundennummer", selectedKunde.kundennummer);
    addText("Firma", selectedKunde.firma);
    addText("Vorname", selectedKunde.vorname);
    addText("Nachname", selectedKunde.nachname);
    addText("Email", selectedKunde.email);
    addText("Mobil", selectedKunde.mobil);
    addText("Adresse", selectedKunde.strasseHausnummer);
    addText("PLZ", selectedKunde.postleitzahl);
    addText("Ort", selectedKunde.ort);
    addText("Status", selectedKunde.status);
  
    // Dienstleistungen
    if (selectedKunde.dienstleistungen && selectedKunde.dienstleistungen.length > 0) {
      if (y + 20 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.setFont(undefined, "bold");
      doc.text("Dienstleistungen:", 14, y);
      y += 8;
      doc.setFont(undefined, "normal");
  
      selectedKunde.dienstleistungen.forEach((d) => {
        const title = `- ${d.title}: `;
        const beschreibung = d.beschreibung || "-";
        const fullText = title + beschreibung;
        const splitText = doc.splitTextToSize(fullText, 180);
        doc.text(splitText, 18, y);
        y += splitText.length * 7 + 4;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    }
  
    const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

    if (selectedKunde.status === "abgeschlossen" && selectedKunde.bewertungen?.length > 0) {
      if (y + 15 > 280) {
        doc.addPage();
        y = 20;
      }
    
      doc.setFont(undefined, "bold");
      doc.text("📝 Bewertungen:", 14, y);
      y += 8;
      doc.setFont(undefined, "normal");
    
      selectedKunde.bewertungen.forEach((bewertung, idx) => {
        const bewertungTexts = [
          `🛠️ Arbeitsqualität: ${bewertung.arbeitsqualität} (${renderStars(bewertung.arbeitsqualität_rating)})`,
          `⚡ Tempo: ${bewertung.tempo} (${renderStars(bewertung.tempo_rating)})`,
          `🎯 Gesamt: ${bewertung.gesamt} (${renderStars(bewertung.gesamt_rating)})`,
          `😊 Freundlichkeit: ${bewertung.freundlichkeit} (${renderStars(bewertung.freundlichkeit_rating)})`,
          `👍 Zufriedenheit: ${bewertung.zufriedenheit} (${renderStars(bewertung.zufriedenheit_rating)})`,
          `💬 Kommunikation: ${bewertung.kommunikation} (${renderStars(bewertung.kommunikation_rating)})`,
          `⏱️ Zuverlässigkeit: ${bewertung.zuverlaessigkeit} (${renderStars(bewertung.zuverlaessigkeit_rating)})`,
          `🧑‍💼 Professionalität: ${bewertung.professionalitaet} (${renderStars(bewertung.professionalitaet_rating)})`,
          `⭐ Gesamtrating: ${renderStars(bewertung.gesamtrating)}`,
          `🗒️ Kommentar: ${bewertung.gesamttext || "-"}`,
          `📅 Erstellt am: ${new Date(bewertung.created_at).toLocaleDateString()}`,
        ];
    
        bewertungTexts.forEach((text) => {
          const splitText = doc.splitTextToSize(text, 180);
          doc.text(splitText, 18, y);
          y += splitText.length * 7 + 2;
        });
    
        y += 6;
        if (y > 280 && idx < selectedKunde.bewertungen.length - 1) {
          doc.addPage();
          y = 20;
        }
      });
    }
    
  
    // Unterschrift (falls vorhanden)
    if (selectedKunde.unterschrift) {
      if (y + 50 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.setFont(undefined, "bold");
      doc.text("Unterschrift:", 14, y);
      y += 6;
      doc.addImage(
        `data:image/png;base64,${selectedKunde.unterschrift}`,
        "PNG",
        14,
        y,
        120,
        40
      );
    }
  
    doc.save(`Kunde_${selectedKunde.kundennummer || "export"}.pdf`);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, editedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Daten erfolgreich aktualisiert');
      setEditMode(false);
      setSelectedKunde(editedData);
      setOriginalData(editedData);
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
      alert('Fehler beim Speichern der Daten. Bitte versuche es später noch einmal.');
    }
  };

  const handleUndo = () => {
    if (originalData) {
      setEditedData(originalData);
      setEditMode(false);
    }
  };

  const copyLinkToClipboard = () => {
    const reviewLink = `${window.location.origin}/kundenbewertung/${selectedKunde.kundennummer}`;
    navigator.clipboard.writeText(reviewLink);
    alert('Link zum Bewerten wurde kopiert!');
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedKunde((prevKunde) => ({ ...prevKunde, status: newStatus }));
      alert(`Status erfolgreich auf ${newStatus} aktualisiert!`);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      alert('Fehler beim Aktualisieren des Status. Bitte versuche es später noch einmal.');
    }
  };

  if (loading) {
    return <div className="loading">Lade Kunde...</div>;
  }

  return (
    <div className="kunden-anzeigen-container">
      <h2>Kundendetails anzeigen</h2>
      {selectedKunde ? (
        <div>
          {editMode ? (
            <div>
              {[
                { label: 'Kundennummer', name: 'kundennummer' },
                { label: 'Firma', name: 'firma' },
                { label: 'Vorname', name: 'vorname' },
                { label: 'Nachname', name: 'nachname' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Mobil', name: 'mobil', type: 'tel' },
                { label: 'Adresse', name: 'strasseHausnummer' },
                { label: 'PLZ', name: 'postleitzahl' },
                { label: 'Ort', name: 'ort' }
              ].map(({ label, name, type = 'text' }) => (
                <div className="input-group" key={name}>
                  <label>{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={editedData[name] || ''}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="button-group">
                <button onClick={handleSave}><FaSave /> Speichern</button>
                <button onClick={handleUndo}><FaUndo /> Änderungen zurücksetzen</button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Kundennummer:</strong> {selectedKunde.kundennummer}</p>
              <p><strong>Firma:</strong> {selectedKunde.firma}</p>
              <p><strong>Vorname:</strong> {selectedKunde.vorname}</p>
              <p><strong>Nachname:</strong> {selectedKunde.nachname}</p>
              <p><strong>Email:</strong> {selectedKunde.email}</p>
              <p><strong>Mobil:</strong> {selectedKunde.mobil}</p>
              <p><strong>Adresse:</strong> {selectedKunde.strasseHausnummer}</p>
              <p><strong>PLZ:</strong> {selectedKunde.postleitzahl}</p>
              <p><strong>Ort:</strong> {selectedKunde.ort}</p>
              <p><strong>Status:</strong> {selectedKunde.status}</p>
              <button onClick={handleEdit}><FaEdit /> Bearbeiten</button>
              <button onClick={exportToPDF}>
  <FaFilePdf /> PDF Export (für Akte)
</button>

            </div>
          )}

          <div className="status-buttons">
            <h3>Status aktualisieren</h3>
            {['offen', 'inBearbeitung', 'abgeschlossen'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={selectedKunde.status === status ? 'active' : ''}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {selectedKunde.status === 'abgeschlossen' && (
  <>
    {selectedKunde.bewertungen && selectedKunde.bewertungen.length > 0 ? (
      <div className="bewertungen">
        <h3><FaClipboardCheck /> Bewertungen</h3>
        {selectedKunde.bewertungen.map((bewertung, index) => (
          <div key={index} className="bewertung">
            <p><strong><FaUserCheck /> Arbeitsqualität:</strong> {bewertung.arbeitsqualität} {renderStars(bewertung.arbeitsqualität_rating)}</p>
            <p><strong>⚡ Tempo:</strong> {bewertung.tempo} {renderStars(bewertung.tempo_rating)}</p>
            <p><strong>🎯 Gesamt:</strong> {bewertung.gesamt} {renderStars(bewertung.gesamt_rating)}</p>
            <p><strong>😊 Freundlichkeit:</strong> {bewertung.freundlichkeit} {renderStars(bewertung.freundlichkeit_rating)}</p>
            <p><strong>👍 Zufriedenheit:</strong> {bewertung.zufriedenheit} {renderStars(bewertung.zufriedenheit_rating)}</p>
            <p><strong>💬 Kommunikation:</strong> {bewertung.kommunikation} {renderStars(bewertung.kommunikation_rating)}</p>
            <p><strong>⏱️ Zuverlässigkeit:</strong> {bewertung.zuverlaessigkeit} {renderStars(bewertung.zuverlaessigkeit_rating)}</p>
            <p><strong>🧑‍💼 Professionalität:</strong> {bewertung.professionalitaet} {renderStars(bewertung.professionalitaet_rating)}</p>
            <p><strong>⭐ Gesamtrating:</strong> {renderStars(bewertung.gesamtrating)}</p>
            <p><strong><FaComments /> Kommentar:</strong> {bewertung.gesamttext || "–"}</p>
            <p><small>🗓️ Erstellt am: {new Date(bewertung.created_at).toLocaleDateString()}</small></p>
          </div>
        ))}
      </div>
    ) : (
      <button onClick={copyLinkToClipboard} className="copy-link-button">
        <FaComments /> Link zum Bewerten kopieren
      </button>
    )}
  </>
)}
          <div className="link-button-container">
            <Link to={`/arbeitszeiten/${id}`} className="link-button">
              Arbeitszeiten anzeigen
            </Link>
          </div>

          <div className="dienstleistungen-container">
            <h3>Verfügbare Dienstleistungen</h3>
            {selectedKunde.dienstleistungen && selectedKunde.dienstleistungen.length > 0 ? (
              <ul className="dienstleistungen-list">
                {selectedKunde.dienstleistungen.map((dienstleistung) => (
                  <li key={dienstleistung.id} className="dienstleistung-item">
                    <p>{dienstleistung.title}: {dienstleistung.beschreibung}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Keine Dienstleistungen verfügbar.</p>
            )}
          </div>

          <div className="dienstleistungen-container">
            <h3>Unterschrift</h3>
            {selectedKunde.unterschrift ? (
              <img
                src={`data:image/png;base64,${selectedKunde.unterschrift}`}
                alt="Unterschrift"
                className="unterschrift-bild"
              />
            ) : (
              <p>Keine Unterschrift vorhanden.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Kunde nicht gefunden.</p>
      )}
    </div>
  );
};

export default KundenAnzeigen;
