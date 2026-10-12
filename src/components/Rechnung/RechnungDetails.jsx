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

  const generatePDF = () => {
    if (!rechnung) return;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // ============================================================
    // FARBEN – AUSSCHLIESSLICH SCHWARZ / WEISS / GRAU
    // ============================================================

    const BLACK = [0, 0, 0];
    const DARK = [35, 35, 35];
    const GREY = [105, 105, 105];
    const LIGHT_GREY = [180, 180, 180];
    const VERY_LIGHT_GREY = [242, 242, 242];
    const WHITE = [255, 255, 255];

    // ============================================================
    // SCHRIFT
    // ============================================================

    // Wichtig:
    // Corbel muss vorher in jsPDF eingebunden worden sein.
    // Falls deine Corbel-Fonts registriert sind, werden sie verwendet.
    const FONT = "Corbel";
    const FONT_BOLD = "Corbel";

    // ============================================================
    // SEITENMASSE
    // ============================================================

    const pageWidth = 210;
    const pageHeight = 297;

    const marginLeft = 18;
    const marginRight = 18;
    const contentWidth = pageWidth - marginLeft - marginRight;

    // ============================================================
    // HILFSFUNKTIONEN
    // ============================================================

    const setFont = (style = "normal", size = 10, color = DARK) => {
        doc.setFont(FONT, style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
    };

    const formatCHF = (value) => {
        const number = Number(value) || 0;

        return number.toLocaleString("de-CH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return date;
        }

        return parsed.toLocaleDateString("de-CH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const drawSmallLabel = (text, x, y) => {
        setFont("bold", 7.5, GREY);

        doc.text(
            String(text).toUpperCase(),
            x,
            y
        );
    };

    const drawThinLine = (y) => {
        doc.setDrawColor(...LIGHT_GREY);
        doc.setLineWidth(0.2);

        doc.line(
            marginLeft,
            y,
            pageWidth - marginRight,
            y
        );
    };

    // ============================================================
    // DATEN
    // ============================================================

    const dienstleistungen = [
        ...(rechnung.dienstleistungen || []),
        ...(rechnung.benutzerdefinierte_dienstleistungen || [])
    ];

    const positionen = dienstleistungen.map((service, index) => {
        const einzelpreis =
            parseFloat(service.kosten) ||
            parseFloat(service.preisProEinheit) ||
            0;

        const menge =
            parseFloat(service.anzahl) ||
            1;

        const total = einzelpreis * menge;

        return {
            position: index + 1,
            bezeichnung:
                service.bezeichnung ||
                service.name ||
                service.titel ||
                service.beschreibung ||
                "Dienstleistung",
            menge,
            einzelpreis,
            total
        };
    });

    const nettoTotal = positionen.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const mwstSatz = 8.1;

    const mwst =
        nettoTotal * (mwstSatz / 100);

    const gesamtTotal =
        nettoTotal + mwst;

    // ============================================================
    // KOPF
    // ============================================================

    let y = 18;

    // Logo alleine – KEIN TBS SOLUTIONS TEXT DANEBEN
    if (logoBlack) {
        try {
            doc.addImage(
                logoBlack,
                "PNG",
                marginLeft,
                y,
                31,
                31
            );
        } catch (error) {
            console.warn(
                "Logo konnte nicht geladen werden:",
                error
            );
        }
    }

    // Rechte Seite: Dokumenttyp
    setFont("bold", 8, GREY);

    doc.text(
        "RECHNUNG",
        pageWidth - marginRight,
        y + 4,
        {
            align: "right"
        }
    );

    setFont("normal", 9, DARK);

    doc.text(
        rechnung.rechnungsnummer
            ? String(rechnung.rechnungsnummer)
            : `RE-${rechnung.id}`,
        pageWidth - marginRight,
        y + 10,
        {
            align: "right"
        }
    );

    // Datum
    setFont("normal", 8, GREY);

    doc.text(
        `Ausgestellt am ${formatDate(rechnung.rechnungsdatum || rechnung.createdAt)}`,
        pageWidth - marginRight,
        y + 16,
        {
            align: "right"
        }
    );

    // Fälligkeitsdatum
    if (rechnung.faelligkeitsdatum) {
        doc.text(
            `Fällig am ${formatDate(rechnung.faelligkeitsdatum)}`,
            pageWidth - marginRight,
            y + 22,
            {
                align: "right"
            }
        );
    }

    // ============================================================
    // RECHNUNGSTITEL
    // ============================================================

    y = 67;

    setFont("normal", 31, BLACK);

    doc.text(
        "Rechnung",
        marginLeft,
        y
    );

    // Kleine Nummer unter dem Titel
    setFont("normal", 9, GREY);

    doc.text(
        rechnung.rechnungsnummer
            ? `Rechnungsnummer ${rechnung.rechnungsnummer}`
            : `Rechnung ${rechnung.id}`,
        marginLeft,
        y + 9
    );

    // ============================================================
    // BETRAG RECHTS
    // ============================================================

    setFont("bold", 7.5, GREY);

    doc.text(
        "ZU ZAHLENDER BETRAG",
        pageWidth - marginRight,
        y - 9,
        {
            align: "right"
        }
    );

    setFont("bold", 20, BLACK);

    doc.text(
        `CHF ${formatCHF(gesamtTotal)}`,
        pageWidth - marginRight,
        y + 2,
        {
            align: "right"
        }
    );

    // ============================================================
    // KUNDEN / AUSSTELLER
    // ============================================================

    y = 96;

    drawThinLine(y);

    y += 12;

    const columnGap = 18;

    const columnWidth =
        (contentWidth - columnGap) / 2;

    // LINKER BLOCK – AUSSTELLER
    drawSmallLabel(
        "Ausgestellt von",
        marginLeft,
        y
    );

    setFont("bold", 11, BLACK);

    doc.text(
        "TBS Solutions",
        marginLeft,
        y + 8
    );

    setFont("normal", 9, DARK);

    doc.text(
        [
            "Digitale Struktur für Ihren Alltag",
            "Digitale Lösungen • Web • IT • Services",
            "Schweiz"
        ],
        marginLeft,
        y + 15,
        {
            lineHeightFactor: 1.5
        }
    );

    // RECHTER BLOCK – KUNDE
    const customerX =
        marginLeft +
        columnWidth +
        columnGap;

    drawSmallLabel(
        "Rechnung an",
        customerX,
        y
    );

    const kundenName =
        kunde?.firma ||
        kunde?.firmenname ||
        `${kunde?.vorname || ""} ${kunde?.nachname || ""}`.trim() ||
        rechnung.kundeName ||
        "Kunde";

    setFont("bold", 11, BLACK);

    doc.text(
        kundenName,
        customerX,
        y + 8
    );

    const customerLines = [];

    if (kunde?.vorname || kunde?.nachname) {
        const fullName =
            `${kunde?.vorname || ""} ${kunde?.nachname || ""}`.trim();

        if (
            fullName &&
            fullName !== kundenName
        ) {
            customerLines.push(fullName);
        }
    }

    if (kunde?.adresse) {
        customerLines.push(kunde.adresse);
    }

    if (kunde?.strasse) {
        customerLines.push(kunde.strasse);
    }

    if (kunde?.plz || kunde?.ort) {
        customerLines.push(
            `${kunde?.plz || ""} ${kunde?.ort || ""}`.trim()
        );
    }

    if (kunde?.land) {
        customerLines.push(kunde.land);
    }

    if (kunde?.email) {
        customerLines.push(kunde.email);
    }

    if (customerLines.length === 0) {
        customerLines.push("Kundenadresse");
    }

    setFont("normal", 9, DARK);

    doc.text(
        customerLines,
        customerX,
        y + 15,
        {
            lineHeightFactor: 1.5
        }
    );

    // ============================================================
    // RECHNUNGSDETAILS
    // ============================================================

    y = 147;

    drawThinLine(y);

    y += 11;

    const detailColumns = [
        {
            label: "RECHNUNGSNUMMER",
            value:
                rechnung.rechnungsnummer ||
                `RE-${rechnung.id}`
        },
        {
            label: "RECHNUNGSDATUM",
            value: formatDate(
                rechnung.rechnungsdatum ||
                rechnung.createdAt
            )
        },
        {
            label: "FÄLLIGKEIT",
            value:
                rechnung.faelligkeitsdatum
                    ? formatDate(
                          rechnung.faelligkeitsdatum
                      )
                    : "30 Tage"
        },
        {
            label: "ZAHLUNGSART",
            value:
                rechnung.zahlungsart ||
                rechnung.zahlungsmethode ||
                "Rechnung"
        }
    ];

    const detailWidth =
        contentWidth / detailColumns.length;

    detailColumns.forEach((item, index) => {
        const x =
            marginLeft +
            index * detailWidth;

        drawSmallLabel(
            item.label,
            x,
            y
        );

        setFont("normal", 9.5, BLACK);

        doc.text(
            String(item.value),
            x,
            y + 8
        );
    });

    // ============================================================
    // LEISTUNGEN
    // ============================================================

    y = 174;

    drawSmallLabel(
        "Leistungen",
        marginLeft,
        y
    );

    y += 7;

    const tableRows = positionen.map((item) => [
        String(item.position).padStart(2, "0"),
        item.bezeichnung,
        formatCHF(item.menge),
        `CHF ${formatCHF(item.einzelpreis)}`,
        `CHF ${formatCHF(item.total)}`
    ]);

    doc.autoTable({
        startY: y,
        margin: {
            left: marginLeft,
            right: marginRight
        },
        tableWidth: contentWidth,

        head: [
            [
                "POS.",
                "BESCHREIBUNG",
                "MENGE",
                "EINZELPREIS",
                "BETRAG"
            ]
        ],

        body: tableRows,

        theme: "plain",

        styles: {
            font: FONT,
            fontStyle: "normal",
            fontSize: 9,
            textColor: DARK,
            cellPadding: {
                top: 5,
                bottom: 5,
                left: 0,
                right: 2
            },
            lineColor: LIGHT_GREY,
            lineWidth: 0,
            overflow: "linebreak",
            valign: "middle"
        },

        headStyles: {
            font: FONT,
            fontStyle: "bold",
            fontSize: 7.5,
            textColor: GREY,
            fillColor: WHITE,
            lineColor: LIGHT_GREY,
            lineWidth: 0,
            cellPadding: {
                top: 3,
                bottom: 5,
                left: 0,
                right: 2
            }
        },

        bodyStyles: {
            fillColor: WHITE
        },

        alternateRowStyles: {
            fillColor: WHITE
        },

        columnStyles: {
            0: {
                cellWidth: 15,
                halign: "left"
            },
            1: {
                cellWidth: "auto",
                halign: "left"
            },
            2: {
                cellWidth: 22,
                halign: "right"
            },
            3: {
                cellWidth: 32,
                halign: "right"
            },
            4: {
                cellWidth: 35,
                halign: "right"
            }
        },

        didDrawCell: (data) => {
            // Nur eine dezente graue Linie UNTER jeder Tabellenzeile.
            // Keine schwarze Linie.
            if (
                data.section === "body" &&
                data.column.index === 0
            ) {
                const lineY =
                    data.cell.y +
                    data.cell.height;

                doc.setDrawColor(
                    ...VERY_LIGHT_GREY
                );

                doc.setLineWidth(0.2);

                doc.line(
                    marginLeft,
                    lineY,
                    pageWidth - marginRight,
                    lineY
                );
            }
        }
    });

    // ============================================================
    // TOTALEN
    // ============================================================

    let totalY =
        doc.lastAutoTable.finalY + 12;

    const totalLabelX =
        pageWidth - marginRight - 68;

    const totalValueX =
        pageWidth - marginRight;

    drawSmallLabel(
        "Zwischensumme",
        totalLabelX,
        totalY
    );

    setFont("normal", 10, DARK);

    doc.text(
        `CHF ${formatCHF(nettoTotal)}`,
        totalValueX,
        totalY,
        {
            align: "right"
        }
    );

    totalY += 8;

    drawSmallLabel(
        `MWST ${mwstSatz.toFixed(1)} %`,
        totalLabelX,
        totalY
    );

    setFont("normal", 10, DARK);

    doc.text(
        `CHF ${formatCHF(mwst)}`,
        totalValueX,
        totalY,
        {
            align: "right"
        }
    );

    totalY += 7;

    // Dezente graue Linie – KEINE schwarze Linie
    doc.setDrawColor(...LIGHT_GREY);
    doc.setLineWidth(0.25);

    doc.line(
        totalLabelX,
        totalY,
        totalValueX,
        totalY
    );

    totalY += 11;

    drawSmallLabel(
        "Gesamtbetrag",
        totalLabelX,
        totalY
    );

    setFont("bold", 16, BLACK);

    doc.text(
        `CHF ${formatCHF(gesamtTotal)}`,
        totalValueX,
        totalY,
        {
            align: "right"
        }
    );

    // ============================================================
    // ZAHLUNGSINFORMATIONEN
    // ============================================================

    totalY += 22;

    drawSmallLabel(
        "Zahlungsinformationen",
        marginLeft,
        totalY
    );

    totalY += 8;

    setFont("normal", 9, DARK);

    const paymentText =
        rechnung.zahlungsinformationen ||
        rechnung.zahlungshinweis ||
        "Bitte begleichen Sie den Rechnungsbetrag innerhalb der angegebenen Zahlungsfrist.";

    const paymentLines =
        doc.splitTextToSize(
            paymentText,
            contentWidth * 0.65
        );

    doc.text(
        paymentLines,
        marginLeft,
        totalY,
        {
            lineHeightFactor: 1.5
        }
    );

    // ============================================================
    // FOOTER
    // ============================================================

    const footerY =
        pageHeight - 18;

    drawThinLine(
        footerY - 7
    );

    setFont("normal", 7.5, GREY);

    doc.text(
        "Vielen Dank für Ihr Vertrauen.",
        marginLeft,
        footerY
    );

    doc.text(
        "TBS Solutions",
        pageWidth / 2,
        footerY,
        {
            align: "center"
        }
    );

    doc.text(
        "www.tbs-solutions.net",
        pageWidth - marginRight,
        footerY,
        {
            align: "right"
        }
    );

    // ============================================================
    // SEITENNUMMER
    // ============================================================

    setFont("normal", 7, GREY);

    doc.text(
        "Seite 1",
        pageWidth - marginRight,
        pageHeight - 9,
        {
            align: "right"
        }
    );

    // ============================================================
    // PDF SPEICHERN
    // ============================================================

    const filename =
        rechnung.rechnungsnummer
            ? `${rechnung.rechnungsnummer}_Rechnung.pdf`
            : `Rechnung_${rechnung.id}.pdf`;

    doc.save(filename);
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