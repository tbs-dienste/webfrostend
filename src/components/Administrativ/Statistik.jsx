import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2"; 
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
  Legend
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
    kontakteProMonat,
    kontakteProJahr,
    kundenProLand,
    topDienstleistungen,
    offeneAufträge,
    abgeschlosseneAufträge,
    durchschnittBewertung,
  } = statistikData;

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
          data: kontakteProJahr.filter(item => item.art === "geschaeft").map((item) => item.anzahl),
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
          Tag
        </button>
        <button
          className={activeChart === "monat" ? "active" : ""}
          onClick={() => setActiveChart("monat")}
        >
          Monat
        </button>
        <button
          className={activeChart === "jahr" ? "active" : ""}
          onClick={() => setActiveChart("jahr")}
        >
          Jahr
        </button>
      </div>

      {/* Dynamische Grafik */}
      <div className="chart-container">
        <h3>{currentChart.title}</h3>
        <Line
          data={{
            labels: currentChart.labels,
            datasets: currentChart.datasets,
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Datum",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Anzahl",
                },
                min: 0,
              },
            },
          }}
        />
      </div>

      {/* Weitere Diagramme */}
      <div className="chart-container">
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
              tooltip: { enabled: true },
            },
          }}
        />
      </div>

      <div className="chart-container">
        <h3>Top Dienstleistungen</h3>
        <Line
          data={{
            labels: topDienstleistungen.map((item) => item.dienstleistung),
            datasets: [
              {
                label: "Anzahl",
                data: topDienstleistungen.map((item) => item.anzahl),
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Dienstleistung",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Anzahl",
                },
                min: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Statistik;
