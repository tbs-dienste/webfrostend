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
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Deine Firma GmbH", 14, 20);
    doc.text("Musterstraße 1", 14, 25);
    doc.text("12345 Bern", 14, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${kunde.vorname} ${kunde.nachname}`, 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text(kunde.adresse || "Adresse folgt", 14, 55);
    doc.text(`${kunde.hausnummer} ${kunde.plz || "PLZ"} ${kunde.ort || "Ort"}`, 14, 60);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Rechnung", 105, 85, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Rechnungsnummer: ${rechnung.rechnungsnummer}`, 14, 100);
    doc.text(`Rechnungsdatum: ${new Date(rechnung.rechnungsdatum).toLocaleDateString()}`, 14, 106);
    doc.text(`Fälligkeitsdatum: ${new Date(rechnung.faelligkeitsdatum).toLocaleDateString()}`, 14, 112);

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

    doc.autoTable({
      startY: 125,
      head: [["Pos.", "Dienstleistung", "Anzahl", "Einzelpreis (CHF)", "Total (CHF)"]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 },
        2: { halign: 'center', cellWidth: 18 },
        3: { halign: 'right', cellWidth: 30 },
        4: { halign: 'right', cellWidth: 30 },
      },
    });

    let yPosition = doc.lastAutoTable.finalY + 10;

    const mwstRate = 8.1;
    const netTotal = dienstleistungen.reduce((sum, s) => {
      const preis = parseFloat(s.kosten) || parseFloat(s.preisProEinheit) || 0;
      const anzahl = s.anzahl || 1;
      return sum + (preis * anzahl);
    }, 0);
    const taxAmount = (netTotal * mwstRate) / 100;
    const total = netTotal + taxAmount;

    doc.setFont("helvetica", "bold");
    doc.text(`Zwischensumme (exkl. MwSt):`, 130, yPosition);
    doc.text(`${netTotal.toFixed(2)} CHF`, 190, yPosition, { align: "right" });

    yPosition += 6;
    doc.text(`MwSt (${mwstRate}%):`, 130, yPosition);
    doc.text(`${taxAmount.toFixed(2)} CHF`, 190, yPosition, { align: "right" });

    yPosition += 6;
    doc.setFontSize(13);
    doc.text(`Gesamtbetrag (inkl. MwSt):`, 130, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${total.toFixed(2)} CHF`, 190, yPosition, { align: "right" });

    yPosition += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Bitte überweisen Sie den Gesamtbetrag bis zum Fälligkeitsdatum auf unser untenstehendes Konto.", 14, yPosition);
    yPosition += 10;
    doc.text("Bankverbindung: IBAN CH12 3456 7890 1234 5678 9 · BIC: ABCDCH22XXX", 14, yPosition);
    doc.text("Vielen Dank für Ihr Vertrauen!", 14, yPosition + 10);

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
    </div>
  );
};

export default RechnungDetails;
