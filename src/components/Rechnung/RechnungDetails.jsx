import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import "./RechnungDetails.scss";
import logoBlack from "./black.png";

const RechnungDetails = () => {
  const { id } = useParams();
  const [rechnung, setRechnung] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kunde, setKunde] = useState(null);

  useEffect(() => {
    const fetchRechnung = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`);
        const { rechnung, kunde, benutzerdefinierte_dienstleistungen } = response.data;

        if (rechnung) {
          setRechnung({ ...rechnung, benutzerdefinierte_dienstleistungen: benutzerdefinierte_dienstleistungen || [] });
          setKunde(kunde);
        } else {
          setError("Rechnung nicht gefunden.");
        }
      } catch (err) {
        setError("Fehler beim Abrufen der Rechnung.");
      } finally {
        setLoading(false);
      }
    };

    fetchRechnung();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}/status`, { status: newStatus });
      if (response.status === 200) {
        setRechnung((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert(`Fehler beim Aktualisieren des Status: ${error.response?.data || error.message}`);
    }
  };

  const deleteRechnung = async () => {
    if (window.confirm("Möchten Sie diese Rechnung wirklich löschen?")) {
      try {
        const response = await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`);
        if (response.status === 200) {
          window.location.href = "/rechnungen";
        }
      } catch (error) {
        alert(`Fehler beim Löschen der Rechnung: ${error.response?.data || error.message}`);
      }
    }
  };

  const generatePDF = (rechnung) => {
    const doc = new jsPDF();
    const blue = [54, 162, 235];
    
    // Logo oben links hinzufügen und kleiner machen
    doc.addImage(logoBlack, 'PNG', 14, 10, 30, 30); // Logo kleiner machen (30x30px)
    
    // Kundenadresse weiter oben platzieren
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${kunde.vorname} ${kunde.nachname}`, 14, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(kunde.adresse || "Adresse folgt", 14, 65);
    doc.text(`${kunde.plz || "PLZ"} ${kunde.ort || "Ort"}`, 14, 70);
    
    // Titel weiter nach oben verschieben
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("RECHNUNG", 105, 90, { align: "center" });
    
    // Rechnungsinformationen weiter oben platzieren
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const currentDate = new Date();
    const faelligkeitsdatum = new Date(currentDate);
    faelligkeitsdatum.setDate(currentDate.getDate() + 30); // Fälligkeitsdatum ist 30 Tage nach dem aktuellen Datum
    
    doc.text(`Rechnungsnummer: ${rechnung.rechnungsnummer}`, 14, 105);
    doc.text(`Rechnungsdatum: ${currentDate.toLocaleDateString()}`, 14, 110); // Aktuelles Datum für Rechnungsdatum
    doc.text(`Fälligkeitsdatum: ${faelligkeitsdatum.toLocaleDateString()}`, 14, 115); // Fälligkeitsdatum: 30 Tage nach Rechnungsdatum
    
    // Dienstleistungen & Tabelle weiter oben
    const dienstleistungen = [
      ...(rechnung.dienstleistungen || []),
      ...(rechnung.benutzerdefinierte_dienstleistungen || [])
    ];
    
    const tableRows = dienstleistungen.map((service, index) => {
      const preis = parseFloat(service.kosten) || parseFloat(service.preisProEinheit) || 0;
      const anzahl = service.anzahl || 1;
      const bezeichnung = service.dienstleistung || service.title || '';
      return [
        index + 1,
        bezeichnung,
        anzahl,
        preis.toFixed(2),
        (preis * anzahl).toFixed(2),
      ];
    });
    
    const netTotal = dienstleistungen.reduce((sum, s) => {
      const preis = parseFloat(s.kosten) || parseFloat(s.preisProEinheit) || 0;
      const anzahl = s.anzahl || 1;
      return sum + (preis * anzahl);
    }, 0);
    
    const mwstRate = 8.1;
    const taxAmount = (netTotal * mwstRate) / 100;
    const total = netTotal + taxAmount;
    
    const summaryRows = [
      [{ content: `MwSt (${mwstRate}%)`, colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } }, { content: `${taxAmount.toFixed(2)} CHF`, styles: { halign: 'right' } }],
      [{ content: "Gesamtbetrag (inkl. MwSt)", colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 } }, { content: `${total.toFixed(2)} CHF`, styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 } }],
    ];
    
    // Tabelle weiter oben platzieren
    doc.autoTable({
      startY: 125,  // Startposition der Tabelle höher
      head: [["Pos.", "Bezeichnung", "Anzahl", "Einzelpreis (CHF)", "Total (CHF)"]],
      body: [...tableRows, ...summaryRows],
      theme: "striped",
      headStyles: {
        fillColor: blue,
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: {
        fontSize: 10,
        cellPadding: { top: 4, bottom: 4 },
        valign: 'middle',
      },
      bodyStyles: {
        textColor: 30,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 14 },
        1: { cellWidth: 76 },
        2: { halign: 'center', cellWidth: 20 },
        3: { halign: 'right', cellWidth: 30 },
        4: { halign: 'right', cellWidth: 30 },
      },
      // Seitenumbruch, wenn die Tabelle zu groß ist
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.height;
        if (data.cursor.y > pageHeight - 50) {
          doc.addPage(); // Neue Seite hinzufügen, wenn der Platz nicht ausreicht
        }
      },
    });
    
    // Fußbereich – Zahlungsinformation & QR-Hinweis weiter oben
    let y = doc.lastAutoTable.finalY + 20;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Bitte begleichen Sie den Gesamtbetrag bis zum Fälligkeitsdatum per QR-Rechnung.", 14, y);
    y += 8;
    doc.text("Scannen Sie den QR-Code in Ihrer Banking-App, um die Zahlung zu tätigen.", 14, y);
    y += 8;
    doc.text("Die Rechnung muss innerhalb von 30 Tagen bezahlt werden, sonst erfolgt eine kostenpflichtige Mahnung.", 14, y);
    
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text("Wir danken Ihnen für Ihr Vertrauen und freuen uns auf die weitere Zusammenarbeit.", 14, y);
    
    // Tbs Solutions ganz unten
    y += 20;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("TBs Solutions", 14, y);
    
    doc.save(`${rechnung.rechnungsnummer}_Rechnung.pdf`);
  };
  



  if (loading) return <div className="rechnung-detail__loading">Lade...</div>;
  if (error) return <div className="rechnung-detail__error">{error}</div>;

  return (
    <div className="rechnung-detail">
      <h2 className="rechnung-detail__title">Rechnungsdetails</h2>
      {rechnung && (
        <>
          <div className="rechnung-detail__info">
            <span className="rechnung-detail__label">Rechnungsnummer:</span>
            <span className="rechnung-detail__value">{rechnung.rechnungsnummer}</span>
          </div>
          <p><strong>Status:</strong> {rechnung.status}</p>
          <p><strong>Gesamtkosten:</strong> {rechnung.totalKostenMitMwst} </p>
          <p><strong>Gesamtarbeitszeit:</strong> {rechnung.gesamtArbeitszeit} Stunden</p>

          <div className="rechnung-detail__status-buttons">
            {rechnung.status === "Entwurf" && (
              <button className="status-button" onClick={() => updateStatus("Offen")}>Offen</button>
            )}
            {rechnung.status === "Offen" && (
              <>
                <button className="status-button" onClick={() => updateStatus("Entwurf")}>Entwurf</button>
                <button className="status-button" onClick={() => updateStatus("Bezahlt")}>Bezahlt</button>
                <button className="status-button" onClick={() => updateStatus("1. Mahnstufe")}>1. Mahnstufe</button>
              </>
            )}
            {rechnung.status === "1. Mahnstufe" && (
              <button className="status-button" onClick={() => updateStatus("2. Mahnstufe")}>2. Mahnstufe</button>
            )}
          </div>

          <button className="delete-button" onClick={deleteRechnung}>Rechnung löschen</button>
          <button className="generate-pdf-button" onClick={() => generatePDF(rechnung)}>Rechnung als PDF generieren</button>
        </>
      )}

      {rechnung && (
        <div className="rechnung-detail__tabelle">
          <h3>Dienstleistungen</h3>
          <table className="dienstleistung-tabelle">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Dienstleistung</th>
                <th>Anzahl</th>
                <th>Einzelpreis (CHF)</th>
                <th>Total (CHF)</th>
              </tr>
            </thead>
            <tbody>
              {[...(rechnung.dienstleistungen || []), ...(rechnung.benutzerdefinierte_dienstleistungen || [])].map((service, index) => {
                const preis = parseFloat(service.kosten) || parseFloat(service.preisProEinheit) || 0;
                const anzahl = service.anzahl || 1;
                const total = (preis * anzahl).toFixed(2);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{service.title}</td>
                    <td>{anzahl}</td>
                    <td>{preis.toFixed(2)}</td>
                    <td>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
};

export default RechnungDetails;
