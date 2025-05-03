import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "./RechnungDetails.scss";

const RechnungDetails = () => {
  const { id } = useParams();
  const [rechnung, setRechnung] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRechnung = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/${id}`);
        const gefundeneRechnung = response.data.rechnung;

        if (gefundeneRechnung) {
          setRechnung(gefundeneRechnung);
        } else {
          setError("Rechnung nicht gefunden.");
        }
      } catch (err) {
        setError("Fehler beim Abrufen der Rechnungen.");
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
        setRechnung((prevRechnung) => ({ ...prevRechnung, status: newStatus }));
      }
    } catch (error) {
      alert(`Fehler beim Aktualisieren des Status: ${error.response ? error.response.data : error.message}`);
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
        alert(`Fehler beim Löschen der Rechnung: ${error.response ? error.response.data : error.message}`);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Titel der Rechnung
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Rechnung", 14, 20);
    
    // Firmeninformationen
    doc.setFontSize(12);
    doc.text("Firma: Deine Firma GmbH", 14, 40);
    doc.text("Adresse: Musterstraße 1, 12345 Bern", 14, 45);
    doc.text("Telefon: +41 123 456789", 14, 50);
    doc.text("E-Mail: info@deinefirma.ch", 14, 55);
    
    // Rechnungsinformationen
    doc.setFontSize(14);
    doc.text(`Rechnungsnummer: ${rechnung.rechnungsnummer}`, 14, 70);
    doc.text(`Rechnungsdatum: ${new Date(rechnung.rechnungsdatum).toLocaleDateString()}`, 14, 75);
    doc.text(`Fälligkeitsdatum: ${new Date(rechnung.faelligkeitsdatum).toLocaleDateString()}`, 14, 80);
  
    // Tabelle für Dienstleistungen
    let yPosition = 100;
    const tableColumn = ["POS", "Dienstleistung", "Anzahl", "Preis (CHF)", "Total (CHF)"];
    const tableRows = rechnung.dienstleistungen.map((service, index) => [
      index + 1, // POS
      service.title,
      service.anzahl,
      (service.preis ? service.preis.toFixed(2) : "0.00"), // Fehlerbehandlung für Preis
      (service.preis && service.anzahl ? (service.preis * service.anzahl).toFixed(2) : "0.00") // Total (Preis * Anzahl)
    ]);
  
    // Füge die Tabelle hinzu
    doc.autoTable({
      startY: yPosition,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      margin: { top: 10 },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10; // Position für nachfolgende Inhalte aktualisieren
  
    // Benutzerdefinierte Dienstleistungen als Tabelle
    if (rechnung.benutzerdefinierteDienstleistungen.length > 0) {
      doc.text("Benutzerdefinierte Dienstleistungen:", 14, yPosition);
      yPosition += 10;
  
      // Tabelle für benutzerdefinierte Dienstleistungen
      const customTableColumn = ["POS", "Dienstleistung", "Anzahl", "Preis (CHF)", "Total (CHF)"];
      const customTableRows = rechnung.benutzerdefinierteDienstleistungen.map((custom, index) => [
        rechnung.dienstleistungen.length + index + 1, // POS fortlaufend
        custom.title,
        custom.anzahl,
        (custom.preis ? custom.preis.toFixed(2) : "0.00"), // Fehlerbehandlung für Preis
        (custom.preis && custom.anzahl ? (custom.preis * custom.anzahl).toFixed(2) : "0.00"), // Total (Preis * Anzahl)
      ]);
  
      doc.autoTable({
        startY: yPosition,
        head: [customTableColumn],
        body: customTableRows,
        theme: "grid",
        margin: { top: 10 },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
      });
  
      yPosition = doc.lastAutoTable.finalY + 10;
    }
    
    // Berechnung der Gesamtbeträge und MwSt.
    const mwstRate = 8.1; // MwSt.-Satz 8.1%
    let gesamtBetrag = 0;
  
    // Berechne den Gesamtbetrag (Summe der Preise)
    rechnung.dienstleistungen.forEach((service) => {
      if (service.preis && service.anzahl) {
        gesamtBetrag += service.preis * service.anzahl;
      }
    });
  
    rechnung.benutzerdefinierteDienstleistungen.forEach((custom) => {
      if (custom.preis && custom.anzahl) {
        gesamtBetrag += custom.preis * custom.anzahl;
      }
    });
  
    // MwSt. berechnen
    const mwstBetrag = (gesamtBetrag * mwstRate) / 100;
    const gesamtBetragMitMwst = gesamtBetrag + mwstBetrag;
  
    // MwSt.-Hinweis und Gesamtbetrag
    doc.setFont("helvetica", "bold");
    doc.text(`Zwischensumme (ohne MwSt.): ${gesamtBetrag.toFixed(2)} CHF`, 14, yPosition + 10);
    doc.text(`MwSt. (${mwstRate}%): ${mwstBetrag.toFixed(2)} CHF`, 14, yPosition + 20);
    doc.text(`Gesamtbetrag (inkl. MwSt.): ${gesamtBetragMitMwst.toFixed(2)} CHF`, 14, yPosition + 30);
    
    // Rechnung als PDF speichern
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
            {rechnung.status === "2. Mahnstufe" && (
              <button className="status-button" onClick={() => updateStatus("3. Mahnstufe")}>3. Mahnstufe</button>
            )}
            {rechnung.status === "3. Mahnstufe" && (
              <button className="status-button" onClick={() => updateStatus("Überfällig")}>Überfällig</button>
            )}
          </div>

          <h4>Dienstleistungen</h4>
          {rechnung.dienstleistungen && rechnung.dienstleistungen.length > 0 ? (
            <table className="rechnung-detail__table">
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Bezeichnung</th>
                  <th>Anzahl</th>
                  <th>Preis</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {rechnung.dienstleistungen.map((service, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{service.title}</td>
                    <td>{service.anzahl || 1}</td>
                    <td>{service.kosten} </td>
                    <td>{(service.kosten * (service.anzahl || 1)).toFixed(2)} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Keine Dienstleistungen gefunden.</p>
          )}

          <h4>Benutzerdefinierte Dienstleistungen</h4>
          {rechnung.benutzerdefinierteDienstleistungen && rechnung.benutzerdefinierteDienstleistungen.length > 0 ? (
            <table className="rechnung-detail__table">
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Bezeichnung</th>
                  <th>Anzahl</th>
                  <th>Preis</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {rechnung.benutzerdefinierteDienstleistungen.map((custom, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{custom.title}</td>
                    <td>{custom.anzahl}</td>
                    <td>{custom.kosten} </td>
                    <td>{(custom.kosten * custom.anzahl).toFixed(2)} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Keine benutzerdefinierten Dienstleistungen gefunden.</p>
          )}
        </>
      )}

      <div className="rechnung-detail__actions">
        <button className="delete-button" onClick={deleteRechnung}>Rechnung löschen</button>
        <button className="download-button" onClick={generatePDF}>Rechnung als PDF herunterladen</button>
      </div>
    </div>
  );
};

export default RechnungDetails;
