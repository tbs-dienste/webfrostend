import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2"; // 'Bar' zu 'Line' geändert
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
  const [activeChart, setActiveChart] = useState("tag"); // "tag", "monat", "jahr"

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
  } = statistikData;

  // Dynamische Daten für die Button-Auswahl
  const chartData = {
    tag: {
      title: "Kontakte pro Tag",
      labels: kontakteProTag.map((item) =>
        new Date(item.datum).toLocaleDateString("de-DE")
      ),
      data: kontakteProTag.map((item) => item.anzahl),
    },
    monat: {
      title: "Kontakte pro Monat",
      labels: kontakteProMonat.map((item) =>
        new Date(item.datum).toLocaleDateString("de-DE", { month: "long" })
      ),
      data: kontakteProMonat.map((item) => item.anzahl),
    },
    jahr: {
      title: "Kontakte pro Jahr",
      labels: kontakteProJahr.map((item) => item.jahr),
      data: kontakteProJahr.map((item) => item.anzahl),
    },
  };

  const currentChart = chartData[activeChart];

  return (
    <div className="statistik-container">
      <h2 className="statistik-title">Statistik Übersicht</h2>

      {/* Auswahl Buttons */}
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
            datasets: [
              {
                label: currentChart.title,
                data: currentChart.data,
                fill: false, // Kein Hintergrund
                borderColor: "rgba(75, 192, 192, 1)", // Linienfarbe
                tension: 0.1, // Weichheit der Linie
                borderWidth: 2, // Linienstärke
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
              x: {
                title: {
                  display: true,
                  text: "Zeit",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Anzahl",
                },
                min: 0, // Y-Achse startet bei 0
              },
            },
          }}
        />
      </div>

      {/* Kunden pro Land */}
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

      {/* Top Dienstleistungen */}
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
                borderColor: "rgba(153, 102, 255, 1)",
                tension: 0.1,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
          }}
        />
      </div>

      {/* Offene und abgeschlossene Aufträge */}
      <div className="auftrag-stats">
        <h3>Auftragsstatistik</h3>
        <p>
          <strong>Offene Aufträge:</strong> {offeneAufträge}
        </p>
        <p>
          <strong>Abgeschlossene Aufträge:</strong> {abgeschlosseneAufträge}
        </p>
        <p>
          <strong>Durchschnittliche Bewertung:</strong> {durchschnittBewertung}
        </p>
      </div>
    </div>
  );
};

export default Statistik;
