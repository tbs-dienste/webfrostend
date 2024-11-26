import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Statistik.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistik = () => {
  const [statistikData, setStatistikData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("Tag");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/statistik",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStatistikData(response.data.data);
      } catch (err) {
        setError("Fehler beim Abrufen der Statistikdaten.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Lade Statistiken...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const {
    kontakteProTag,
    kontakteProMonat,
    kontakteProJahr,
    kundenProLand,
    topDienstleistungen,
    offeneAufträge,
    abgeschlosseneAufträge,
    durchschnittBewertung,
    totalKunden,
    aktiveKunden,
    archivierteKunden,
  } = statistikData;

  const chartData = {
    Tag: {
      labels: kontakteProTag.map((item) =>
        new Date(item.datum).toLocaleDateString("de-DE")
      ),
      data: kontakteProTag.map((item) => item.anzahl),
      label: "Kontakte pro Tag",
    },
    Monat: {
      labels: kontakteProMonat.map((item) => item.monat),
      data: kontakteProMonat.map((item) => item.anzahl),
      label: "Kontakte pro Monat",
    },
    Jahr: {
      labels: kontakteProJahr.map((item) => item.jahr),
      data: kontakteProJahr.map((item) => item.anzahl),
      label: "Kontakte pro Jahr",
    },
  };

  const currentData = chartData[view];

  const generatePDF = async () => {
    const doc = new jsPDF();
  
    // Add Title
    doc.setFontSize(18);
    doc.text("Statistik Übersicht", 20, 20);
  
    // Add Summary Cards
    doc.setFontSize(12);
    doc.text(`Gesamtkunden: ${totalKunden}`, 20, 30);
    doc.text(`Aktive Kunden: ${aktiveKunden}`, 20, 40);
    doc.text(`Archivierte Kunden: ${archivierteKunden}`, 20, 50);
    doc.text(`Offene Aufträge: ${offeneAufträge}`, 20, 60);
    doc.text(`Abgeschlossene Aufträge: ${abgeschlosseneAufträge}`, 20, 70);
    doc.text(`Durchschnittsbewertung: ${durchschnittBewertung}`, 20, 80);
  
    // Create a page break if the content exceeds the current page
    let currentY = 90;
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
  
    // Capture chart as image using html2canvas
    const chartContainer1 = document.getElementById("chart-container-1");
    const chartContainer2 = document.getElementById("chart-container-2");
    const chartContainer3 = document.getElementById("chart-container-3");
  
    const canvas1 = await html2canvas(chartContainer1);
    const canvas2 = await html2canvas(chartContainer2);
    const canvas3 = await html2canvas(chartContainer3);
  
    const imgData1 = canvas1.toDataURL("image/png");
    const imgData2 = canvas2.toDataURL("image/png");
    const imgData3 = canvas3.toDataURL("image/png");
  
    // Add the first chart image to the PDF
    doc.addImage(imgData1, "PNG", 20, currentY, 180, 100);
    currentY += 120; // Move down the page for the next chart
  
    // Create a page break if there's not enough space for the next chart
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
  
    // Add the second chart image to the PDF
    doc.addImage(imgData2, "PNG", 20, currentY, 180, 100);
    currentY += 120; // Move down the page for the next chart
  
    // Create a page break if there's not enough space for the next chart
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
  
    // Add the third chart image to the PDF
    doc.addImage(imgData3, "PNG", 20, currentY, 180, 100);
  
    // Generate the filename with current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits
    const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure 2 digits
  
    // Construct the filename
    const filename = `${year}-${month}-${day}-Statistik.pdf`;
  
    // Save the PDF with the dynamically generated filename
    doc.save(filename);
  };
  
  
  
  return (
    <div className="statistik-container">
      <h2 className="statistik-title">Statistik Übersicht</h2>

      <div className="summary-cards">
        <div className="card">Gesamtkunden: {totalKunden}</div>
        <div className="card">Aktive Kunden: {aktiveKunden}</div>
        <div className="card">Archivierte Kunden: {archivierteKunden}</div>
        <div className="card">Offene Aufträge: {offeneAufträge}</div>
        <div className="card">Abgeschlossene Aufträge: {abgeschlosseneAufträge}</div>
        <div className="card">Durchschnittsbewertung: {durchschnittBewertung}</div>
      </div>

      <div className="filter-buttons">
        <button
          className={view === "Tag" ? "active" : ""}
          onClick={() => setView("Tag")}
        >
          Tag
        </button>
        <button
          className={view === "Monat" ? "active" : ""}
          onClick={() => setView("Monat")}
        >
          Monat
        </button>
        <button
          className={view === "Jahr" ? "active" : ""}
          onClick={() => setView("Jahr")}
        >
          Jahr
        </button>
      </div>

      <div id="chart-container-1" className="chart-container">
        <h3>{currentData.label}</h3>
        <Bar
          data={{
            labels: currentData.labels,
            datasets: [
              {
                label: currentData.label,
                data: currentData.data,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: { beginAtZero: true },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>

      <div id="chart-container-2" className="chart-container">
        <h3>Kunden pro Land</h3>
        <Pie
          data={{
            labels: kundenProLand.map((item) => item.land),
            datasets: [
              {
                data: kundenProLand.map((item) => item.anzahl),
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          }}
        />
      </div>

      <div id="chart-container-3" className="chart-container">
        <h3>Top Dienstleistungen</h3>
        <Bar
          data={{
            labels: topDienstleistungen.map((item) => item.dienstleistung),
            datasets: [
              {
                label: "Top Dienstleistungen",
                data: topDienstleistungen.map((item) => item.anzahl),
                backgroundColor: "rgba(153, 102, 255, 0.5)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: { beginAtZero: true },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>

      <button className="download-pdf-button" onClick={generatePDF}>
        PDF herunterladen
      </button>
    </div>
  );
};

export default Statistik;
