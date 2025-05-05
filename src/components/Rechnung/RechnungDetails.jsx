import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "./RechnungDetails.scss";
import 'jspdf-autotable';

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
  
    // Tabelle für alle Dienstleistungen (kombiniert)
    let yPosition = 100;
    const tableColumn = ["POS", "Dienstleistung", "Anzahl", "Preis (CHF)", "Total (CHF)"];
    const combinedServices = [...rechnung.dienstleistungen, ...rechnung.benutzerdefinierteDienstleistungen];
  
    const tableRows = combinedServices.map((service, index) => {
      const preis = parseFloat(service.kosten) || parseFloat(service.preis) || 0;
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
  
    yPosition = doc.lastAutoTable.finalY + 10;
  
    // Berechnung der Gesamtbeträge und MwSt.
    const mwstRate = 8.1;
    const gesamtBetrag = combinedServices.reduce((sum, service) => {
      const preis = parseFloat(service.kosten) || parseFloat(service.preis) || 0;
      const anzahl = service.anzahl || 1;
      return sum + (preis * anzahl);
    }, 0);
  
    const mwstBetrag = (gesamtBetrag * mwstRate) / 100;
    const gesamtBetragMitMwst = gesamtBetrag + mwstBetrag;
  
    // Gesamtbeträge anzeigen
    doc.setFont("helvetica", "bold");
    doc.text(`Zwischensumme (ohne MwSt.): ${gesamtBetrag.toFixed(2)} CHF`, 14, yPosition + 10);
    doc.text(`MwSt. (${mwstRate}%): ${mwstBetrag.toFixed(2)} CHF`, 14, yPosition + 20);
    doc.text(`Gesamtbetrag (inkl. MwSt.): ${gesamtBetragMitMwst.toFixed(2)} CHF`, 14, yPosition + 30);
  
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

          <h4>Alle Dienstleistungen</h4>
{(rechnung.dienstleistungen.length > 0 || rechnung.benutzerdefinierteDienstleistungen.length > 0) ? (
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
      {[...rechnung.dienstleistungen, ...rechnung.benutzerdefinierteDienstleistungen].map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.title}</td>
          <td>{item.anzahl || 1}</td>
          <td>{item.kosten || item.preis} </td>
          <td>{((item.kosten || item.preis) * (item.anzahl || 1)).toFixed(2)} </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>Keine Dienstleistungen gefunden.</p>
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
