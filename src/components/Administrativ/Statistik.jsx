import React, { useState, useEffect } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import "./Statistik.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const Statistik = () => {
  const [statistikData, setStatistikData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("tag");

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
    totalKunden,
    archivierteKunden,
    aktiveKunden,
    privatKunden,
    geschaeftKunden,
    kontakteProTag,
    kontakteProWoche,
    kontakteProJahrMonate,
    kontakteProMonat,
    kontakteProJahr,
    kundenProLand,
    topDienstleistungen,
    offeneAufträge,
    kundenProGeschlecht,
    abgeschlosseneAufträge,
    durchschnittBewertung,
    geschlechtVerteilung,
  } = statistikData;

  // Prepare data for Pie and Bar charts
  const pieChartDataLand = {
    labels: kundenProLand.map(item => item.land),
    datasets: [
      {
        data: kundenProLand.map(item => item.anzahl),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"],
        hoverOffset: 4,
      },
    ],
  };
// Beispiel für die Vorbereitung der Daten für ein Pie- und Bar-Diagramm basierend auf Geschlecht
const pieChartDataGeschlecht = {
    labels: kundenProGeschlecht.map(item => item.geschlecht), // Labels für jedes Geschlecht
    datasets: [
      {
        data: kundenProGeschlecht.map(item => item.anzahl), // Anzahl der Kunden pro Geschlecht
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"], // Farben für jedes Segment
        hoverOffset: 4, // Offset, wenn das Segment mit der Maus hoveriert wird
      },
    ],
  };

  

  const barChartDataTopDienstleistungen = {
    labels: topDienstleistungen.map(item => item.dienstleistung),
    datasets: [
      {
        label: "Top Dienstleistungen",
        data: topDienstleistungen.map(item => item.anzahl),
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  const chartData = {
    tag: {
      title: "Kontakte pro Tag",
      labels: kontakteProTag.map((item) =>
        new Date(item.datum).toLocaleDateString("de-DE")
      ),
      datasets: [
        {
          label: "Private Kunden",
          data: kontakteProTag.filter(item => item.art === "privat").map((item) => item.anzahl),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: kontakteProTag.filter(item => item.art === "geschäft").map((item) => item.anzahl),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
    woche: {
      title: "Kontakte pro Woche",
      labels: kontakteProWoche.map((item) => {
        const wochenTageDeutsch = {
          "Monday": "Montag",
          "Tuesday": "Dienstag",
          "Wednesday": "Mittwoch",
          "Thursday": "Donnerstag",
          "Friday": "Freitag",
          "Saturday": "Samstag",
          "Sunday": "Sonntag",
        };
        return wochenTageDeutsch[item.wochentag];  // Wochentage auf Deutsch
      }),
      datasets: [
        {
          label: "Private Kunden",
          data: kontakteProWoche.map((item) => item.privat),  // Privatwerte
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: kontakteProWoche.map((item) => item.geschaeft),  // Geschäftswerte
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 1,
          borderWidth: 2,
        },
      ],
    },
    
    
    monat: {
      title: "Kontakte pro Monat",
      labels: Array.from({ length: 31 }, (_, i) => {
        const date = new Date(2024, 10, i + 1); // Annahme: November 2024
        return date.getDate();
      }),
      datasets: [
        {
          label: "Private Kunden",
          data: Array.from({ length: 31 }, (_, i) => {
            const date = new Date(2024, 10, i + 1);
            const data = kontakteProMonat.find(item => new Date(item.datum).getDate() === date.getDate() && item.art === "privat");
            return data ? data.anzahl : 0;
          }),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: Array.from({ length: 31 }, (_, i) => {
            const date = new Date(2024, 10, i + 1);
            const data = kontakteProMonat.find(item => new Date(item.datum).getDate() === date.getDate() && item.art === "geschäft");
            return data ? data.anzahl : 0;
          }),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
    monate: {
      title: "Kontakte pro Monat im Jahr",
      labels: kontakteProJahrMonate.map((item) => item.monat), // Monate als Labels
      datasets: [
        {
          label: "Private Kunden",
          data: kontakteProJahrMonate.map((item) => item.privat), // Private Daten
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: kontakteProJahrMonate.map((item) => item.geschaeft), // Geschäftsdaten
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
    
    jahr: {
      title: "Kontakte pro Jahr",
      labels: kontakteProJahr.map((item) => item.jahr),
      datasets: [
        {
          label: "Private Kunden",
          data: kontakteProJahr.filter(item => item.art === "privat").map((item) => item.anzahl),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: kontakteProJahr.filter(item => item.art === "geschäft").map((item) => item.anzahl),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
  };

  const currentChart = chartData[activeChart];

  return (
    <div className="statistik-container">
      <h2 className="statistik-title">Statistik Übersicht</h2>

      {/* Übersicht der wichtigsten Statistiken */}
      <div className="statistik-summary">
        <div className="statistik-item">
          <h3>Gesamtzahl der Kunden</h3>
          <p>{totalKunden}</p>
        </div>
        <div className="statistik-item">
          <h3>Archivierte Kunden</h3>
          <p>{archivierteKunden}</p>
        </div>
        <div className="statistik-item">
          <h3>Aktive Kunden</h3>
          <p>{aktiveKunden}</p>
        </div>
        <div className="statistik-item">
          <h3>Private Kunden</h3>
          <p>{privatKunden}</p>
        </div>
        <div className="statistik-item">
          <h3>Geschäftliche Kunden</h3>
          <p>{geschaeftKunden}</p>
        </div>
      </div>

      {/* Auswahl Buttons für die Diagramme */}
      <div className="chart-buttons">
        <button
          className={activeChart === "tag" ? "active" : ""}
          onClick={() => setActiveChart("tag")}
        >
          Kontakte pro Tag
        </button>
        <button
          className={activeChart === "woche" ? "active" : ""}
          onClick={() => setActiveChart("woche")}
        >
          Kontakte pro Woche
        </button>
        <button
          className={activeChart === "monat" ? "active" : ""}
          onClick={() => setActiveChart("monat")}
        >
          Kontakte pro Monat
        </button>
        <button
          className={activeChart === "monate" ? "active" : ""}
          onClick={() => setActiveChart("monate")}
        >
          Kontakte pro Monat im Jahr
        </button>
        <button
          className={activeChart === "jahr" ? "active" : ""}
          onClick={() => setActiveChart("jahr")}
        >
          Kontakte pro Jahr
        </button>
      </div>

      {/* Chart Anzeige */}
      <div className="chart-container">
        <h3>{currentChart.title}</h3>
        <Line data={currentChart} />
      </div>

      {/* Pie Chart für Kunden nach Land */}
      <div className="chart-container">
        <h3>Verteilung der Kunden nach Land</h3>
        <Pie data={pieChartDataLand} />
      </div>

      {/* Pie Chart für Geschlecht */}
      <div className="chart-container">
        <h3>Verteilung nach Geschlecht</h3>
        <Pie data={pieChartDataGeschlecht} />
      </div>

      {/* Bar Chart für Top Dienstleistungen */}
      <div className="chart-container">
        <h3>Top Dienstleistungen</h3>
        <Bar data={barChartDataTopDienstleistungen} />
      </div>
    </div>
  );
};

export default Statistik;
