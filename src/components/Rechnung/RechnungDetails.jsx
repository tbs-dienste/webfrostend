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
  const [kunde, setKunde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRechnung = async () => {
      try {
        const response = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`
        );
        const { rechnung, kunde, benutzerdefinierte_dienstleistungen, dienstleistungen } =
          response.data;

        if (rechnung) {
          setRechnung({ ...rechnung, benutzerdefinierte_dienstleistungen, dienstleistungen });
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
      const response = await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}/status`,
        { status: newStatus }
      );
      if (response.status === 200) {
        setRechnung((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(`Fehler beim Aktualisieren des Status: ${err.response?.data || err.message}`);
    }
  };

  const deleteRechnung = async () => {
    if (window.confirm("Möchten Sie diese Rechnung wirklich löschen?")) {
      try {
        const response = await axios.delete(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`
        );
        if (response.status === 200) window.location.href = "/rechnungen";
      } catch (err) {
        alert(`Fehler beim Löschen der Rechnung: ${err.response?.data || err.message}`);
      }
    }
  };

  const generatePDF = (rechnung = {}, kundeData, logoBlack) => {
    if (!rechnung || !kundeData) return;

    const doc = new jsPDF("p", "mm", "a4");
    const primaryColor = [0, 123, 255];
    const lightGray = [245, 245, 245];
    const darkGray = [60, 60, 60];

    // HEADER
    if (logoBlack) doc.addImage(logoBlack, "PNG", 14, 10, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text("TBs Solutions", 150, 15, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text("Musterstraße 12", 150, 20, { align: "right" });
    doc.text("8000 Zürich, Schweiz", 150, 25, { align: "right" });
    doc.text("info@tbs-solutions.ch", 150, 30, { align: "right" });
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(14, 45, 196, 45);

    // KUNDENINFO
    const kundenVorname = kundeData.vorname || "";
    const kundenNachname = kundeData.nachname || "";
    const adresse = kundeData.adresse || "";
    const plzOrt = `${kundeData.plz || ""} ${kundeData.ort || ""}`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.text(`${kundenVorname} ${kundenNachname}`, 14, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(adresse, 14, 60);
    doc.text(plzOrt, 14, 65);

    // RECHNUNGSDATEN
    const currentDate = new Date();
    const faelligkeitsdatum = new Date(currentDate);
    faelligkeitsdatum.setDate(currentDate.getDate() + 30);
    doc.text(`Rechnungsnummer: ${rechnung.rechnungsnummer || "N/A"}`, 150, 55, { align: "right" });
    doc.text(`Rechnungsdatum: ${currentDate.toLocaleDateString()}`, 150, 60, { align: "right" });
    doc.text(`Fälligkeitsdatum: ${faelligkeitsdatum.toLocaleDateString()}`, 150, 65, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text("RECHNUNG", 105, 80, { align: "center" });

    // DIENSTLEISTUNGEN
    const dienstleistungen = [
      ...(rechnung.dienstleistungen || []),
      ...(rechnung.benutzerdefinierte_dienstleistungen || []),
    ];

    const tableRows = dienstleistungen.map((s, i) => {
      const preis = parseFloat(s.kosten) || parseFloat(s.preisProEinheit) || 0;
      const anzahl = parseFloat(s.anzahl) || 1;
      const bezeichnung = s.dienstleistung || s.title || "";
      return [i + 1, bezeichnung, anzahl, preis.toFixed(2), (preis * anzahl).toFixed(2)];
    });

    const netTotal = dienstleistungen.reduce((sum, s) => {
      const preis = parseFloat(s.kosten) || parseFloat(s.preisProEinheit) || 0;
      const anzahl = parseFloat(s.anzahl) || 1;
      return sum + preis * anzahl;
    }, 0);

    const mwstRate = 8.1;
    const taxAmount = (netTotal * mwstRate) / 100;
    const total = netTotal + taxAmount;

    const summaryRows = [
      [
        { content: `MwSt (${mwstRate}%)`, colSpan: 4, styles: { halign: "right", fontStyle: "bold" } },
        { content: `${taxAmount.toFixed(2)} CHF`, styles: { halign: "right" } },
      ],
      [
        {
          content: "Gesamtbetrag (inkl. MwSt)",
          colSpan: 4,
          styles: { halign: "right", fontStyle: "bold", fontSize: 12 },
        },
        { content: `${total.toFixed(2)} CHF`, styles: { halign: "right", fontStyle: "bold", fontSize: 12 } },
      ],
    ];

    doc.autoTable({
      startY: 90,
      head: [["Pos.", "Bezeichnung", "Anzahl", "Einzelpreis (CHF)", "Total (CHF)"]],
      body: [...tableRows, ...summaryRows],
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: "bold", halign: "center" },
      bodyStyles: { fontSize: 10, valign: "middle", textColor: darkGray },
      alternateRowStyles: { fillColor: lightGray },
      columnStyles: {
        0: { halign: "center", cellWidth: 14 },
        1: { cellWidth: 80 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "right", cellWidth: 30 },
        4: { halign: "right", cellWidth: 30 },
      },
    });

    // FOOTER
    let y = doc.lastAutoTable.finalY + 20;
    if (y > doc.internal.pageSize.height - 50) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text("Bitte begleichen Sie den Gesamtbetrag bis zum Fälligkeitsdatum per QR-Rechnung.", 14, y);
    y += 6;
    doc.text("Scannen Sie den QR-Code in Ihrer Banking-App, um die Zahlung zu tätigen.", 14, y);
    y += 6;
    doc.text("Die Rechnung muss innerhalb von 30 Tagen bezahlt werden, sonst erfolgt eine Mahnung.", 14, y);
    y += 10;
    doc.text("Vielen Dank für Ihr Vertrauen!", 14, y);
    y += 15;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("TBs Solutions – www.tbs-solutions.ch", 14, y);

    doc.save(`${rechnung.rechnungsnummer || "Rechnung"}_Rechnung.pdf`);
  };

  if (loading) return <div className="rechnung-detail__loading">Lade...</div>;
  if (error) return <div className="rechnung-detail__error">{error}</div>;

  return (
    <div className="rechnung-detail">
      <h2 className="rechnung-detail__title">Rechnungsdetails</h2>

      {rechnung && kunde && (
        <>
          <div className="rechnung-detail__info">
            <span className="rechnung-detail__label">Rechnungsnummer:</span>
            <span className="rechnung-detail__value">{rechnung.rechnungsnummer}</span>
          </div>

          <p><strong>Status:</strong> {rechnung.status}</p>
          <p><strong>Gesamtkosten:</strong> {rechnung.totalKostenMitMwst} CHF</p>
          <p><strong>Gesamtarbeitszeit:</strong> {rechnung.gesamtArbeitszeit} Stunden</p>

          <div className="rechnung-detail__kunde">
            <h3>Kunde</h3>
            <p>{kunde.vorname} {kunde.nachname}</p>
            <p>{kunde.adresse}</p>
            <p>{kunde.plz} {kunde.ort}</p>
          </div>

          <div className="rechnung-detail__status-buttons">
            {rechnung.status === "Entwurf" && <button className="status-button" onClick={() => updateStatus("Offen")}>Offen</button>}
            {rechnung.status === "Offen" && <>
              <button className="status-button" onClick={() => updateStatus("Entwurf")}>Entwurf</button>
              <button className="status-button" onClick={() => updateStatus("Bezahlt")}>Bezahlt</button>
              <button className="status-button" onClick={() => updateStatus("1. Mahnstufe")}>1. Mahnstufe</button>
            </>}
            {rechnung.status === "1. Mahnstufe" && <button className="status-button" onClick={() => updateStatus("2. Mahnstufe")}>2. Mahnstufe</button>}
          </div>

          {rechnung.status !== "Bezahlt" && <button className="delete-button" onClick={deleteRechnung}>Rechnung löschen</button>}

          <button className="generate-pdf-button" onClick={() => generatePDF(rechnung, kunde, logoBlack)}>Rechnung als PDF generieren</button>

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
        </>
      )}
    </div>
  );
};

export default RechnungDetails;