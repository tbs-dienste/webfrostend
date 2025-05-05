import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import "./RechnungDetails.scss";

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
    if (!kunde) {
      alert("Kundendaten nicht verfügbar.");
      return;
    }

    const doc = new jsPDF();
    const blue = [54, 162, 235];

    // Kopfbereich – Absender
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...blue);
    doc.text("Deine Firma GmbH", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
    doc.text("Musterstraße 1", 14, 26);
    doc.text("12345 Bern", 14, 31);

    // Kundenadresse
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${kunde.vorname} ${kunde.nachname}`, 14, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(kunde.adresse || "Adresse folgt", 14, 55);
    doc.text(`${kunde.plz || "PLZ"} ${kunde.ort || "Ort"}`, 14, 60);

    // Titel
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("RECHNUNG", 105, 80, { align: "center" });

    // Rechnungsinformationen
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Rechnungsnummer: ${rechnung.rechnungsnummer}`, 14, 95);
    doc.text(`Rechnungsdatum: ${new Date(rechnung.rechnungsdatum).toLocaleDateString()}`, 14, 100);
    doc.text(`Fälligkeitsdatum: ${new Date(rechnung.faelligkeitsdatum).toLocaleDateString()}`, 14, 105);

    // Dienstleistungen & Tabelle
    const dienstleistungen = [
      ...(rechnung.dienstleistungen || []),
      ...(rechnung.benutzerdefinierte_dienstleistungen || [])
    ];

    const tableRows = dienstleistungen.map((service, index) => {
      const preis = parseFloat(service.kosten) || parseFloat(service.preisProEinheit) || 0;
      const anzahl = service.anzahl || 1;
      return [
        index + 1,
        service.title,
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

    // Tabelle
    doc.autoTable({
      startY: 115,
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
    });

    // Fußbereich – Zahlungsinfo & Dank
    let y = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Bitte überweisen Sie den Gesamtbetrag bis zum Fälligkeitsdatum auf folgendes Konto:", 14, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("IBAN: CH12 3456 7890 1234 5678 9   ·   BIC: ABCDCH22XXX", 14, y);
    y += 15;
    doc.setFont("helvetica", "italic");
    doc.text("Vielen Dank für Ihr Vertrauen!", 14, y);

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
