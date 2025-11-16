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
  const [activeUmsatz, setActiveUmsatz] = useState("monat");

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

  if (loading) return <div className="loading">Lade Statistiken...</div>;
  if (error) return <div className="error">{error}</div>;

  const {
    totalKunden,
    archivierteKunden,
    aktiveKunden,
    privatKunden,
    geschaeftKunden,
    kontakteProTag,
    kontakteProWoche,
    kontakteProMonat,
    kontakteProJahr,
    kontakteProJahrMonate,
    kundenProLand,
    kundenProGeschlecht,
    topDienstleistungen,
    offeneAufträge,
    abgeschlosseneAufträge,
    umsatzProMonat,
    umsatzProJahr,
    transaktionenNachMethode,
    transaktionenNachKartenart,
    bewertungenPerMonth,
  } = statistikData;

  // === Charts vorbereiten ===

  const chartData = {
    tag: {
      title: "Kontakte pro Tag",
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: "Private Kunden",
          data: Array.from({ length: 24 }, (_, i) => {
            const data = kontakteProTag.find((item) => item.stunde === i);
            return data ? data.privat : 0;
          }),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: Array.from({ length: 24 }, (_, i) => {
            const data = kontakteProTag.find((item) => item.stunde === i);
            return data ? data.geschaeft : 0;
          }),
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
          Monday: "Montag",
          Tuesday: "Dienstag",
          Wednesday: "Mittwoch",
          Thursday: "Donnerstag",
          Friday: "Freitag",
          Saturday: "Samstag",
          Sunday: "Sonntag",
        };
        return wochenTageDeutsch[item.wochentag];
      }),
      datasets: [
        {
          label: "Private Kunden",
          data: kontakteProWoche.map((item) => item.privat),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: kontakteProWoche.map((item) => item.geschaeft),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
    monat: {
      title: "Kontakte pro Monat",
      labels: kontakteProMonat.map((item) => new Date(item.datum).getDate()),
      datasets: [
        {
          label: "Private Kunden",
          data: kontakteProMonat.map((item) => item.privat),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: kontakteProMonat.map((item) => item.geschaeft),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
    monate: {
      title: "Kontakte pro Monat im Jahr",
      labels: kontakteProJahrMonate.map((item) => item.monat),
      datasets: [
        {
          label: "Private Kunden",
          data: kontakteProJahrMonate.map((item) => item.privat),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: kontakteProJahrMonate.map((item) => item.geschaeft),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
    jahr: {
      title: "Kontakte pro Jahr",
      labels: [...new Set(kontakteProJahr.map((item) => item.jahr))],
      datasets: [
        {
          label: "Private Kunden",
          data: [...new Set(kontakteProJahr.map((item) => item.jahr))].map(
            (jahr) =>
              kontakteProJahr.find((item) => item.jahr === jahr && item.art === "privat")?.anzahl || 0
          ),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
        {
          label: "Geschäftliche Kunden",
          data: [...new Set(kontakteProJahr.map((item) => item.jahr))].map(
            (jahr) =>
              kontakteProJahr.find((item) => item.jahr === jahr && item.art === "geschäft")?.anzahl || 0
          ),
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    },
  };

  const pieChartDataLand = {
    labels: kundenProLand.map((item) => item.land),
    datasets: [
      {
        data: kundenProLand.map((item) => item.anzahl),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"],
        hoverOffset: 4,
      },
    ],
  };

  const pieChartDataGeschlecht = {
    labels: kundenProGeschlecht.map((item) => item.geschlecht),
    datasets: [
      {
        data: kundenProGeschlecht.map((item) => item.anzahl),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"],
        hoverOffset: 4,
      },
    ],
  };

  const barChartDataTopDienstleistungen = {
    labels: topDienstleistungen.map((item) => item.title),
    datasets: [
      {
        label: "Top Dienstleistungen",
        data: topDienstleistungen.map((item) => item.anzahl),
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  const transaktionenNachMethodeData = {
    labels: transaktionenNachMethode.map((item) => item.method),
    datasets: [
      {
        label: "Anzahl Transaktionen",
        data: transaktionenNachMethode.map((item) => item.anzahl_transaktionen),
        backgroundColor: ["#FF6347", "#42A5F5"],
      },
      {
        label: "Gesamtbetrag",
        data: transaktionenNachMethode.map((item) => parseFloat(item.gesamtbetrag)),
        backgroundColor: ["#FFEB3B", "#66BB6A"],
      },
    ],
  };

  const transaktionenNachKartenartData = {
    labels: transaktionenNachKartenart.map((item) => item.cardType),
    datasets: [
      {
        label: "Anzahl Transaktionen",
        data: transaktionenNachKartenart.map((item) => item.anzahl_transaktionen),
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFCA28", "#FF7043", "#AB47BC", "#8D6E63"],
      },
      {
        label: "Gesamtbetrag",
        data: transaktionenNachKartenart.map((item) => parseFloat(item.gesamtbetrag)),
        backgroundColor: ["#1E88E5", "#43A047", "#FFB300", "#F4511E", "#8E24AA", "#6D4C41"],
      },
    ],
  };

  const umsatzData = {
    monat: {
      labels: umsatzProMonat.map((item) => item.monat),
      datasets: [
        {
          label: "Umsatz in CHF",
          data: umsatzProMonat.map((item) => item.umsatz),
          backgroundColor: "#36A2EB",
        },
      ],
    },
    jahr: {
      labels: umsatzProJahr.map((item) => item.jahr),
      datasets: [
        {
          label: "Umsatz in CHF",
          data: umsatzProJahr.map((item) => item.umsatz),
          backgroundColor: "#FF6384",
        },
      ],
    },
  };

  const currentChart = chartData[activeChart];

  return (
    <div className="statistik-container">
      <h2 className="statistik-title">Statistik Übersicht</h2>

      {/* Übersicht */}
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

      {/* Chart-Auswahl */}
      <div className="chart-buttons">
        {["tag", "woche", "monat", "monate", "jahr"].map((c) => (
          <button
            key={c}
            className={activeChart === c ? "active" : ""}
            onClick={() => setActiveChart(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="chart-container">
        <h3>{currentChart.title}</h3>
        <Line data={currentChart} />
      </div>

      <div className="chart-container">
        <h3>Verteilung der Kunden nach Land</h3>
        <Pie data={pieChartDataLand} />
      </div>

      <div className="chart-container">
        <h3>Verteilung nach Geschlecht</h3>
        <Pie data={pieChartDataGeschlecht} />
      </div>

      <div className="chart-container">
        <h3>Top Dienstleistungen</h3>
        <Bar data={barChartDataTopDienstleistungen} />
      </div>

      <div className="umsatz-statistik-container">
        <h2>Umsatzstatistik</h2>
        <div className="chart-buttons">
          {["monat", "jahr"].map((u) => (
            <button
              key={u}
              className={activeUmsatz === u ? "active" : ""}
              onClick={() => setActiveUmsatz(u)}
            >
              {u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>
        <div className="chart-container">
          <Bar data={umsatzData[activeUmsatz]} options={{ responsive: true }} />
        </div>
      </div>

      <div className="chart-container">
        <h2>Transaktionen nach Zahlungsmethode</h2>
        <Bar
          data={transaktionenNachMethodeData}
          options={{ responsive: true }}
        />
      </div>

      <div className="chart-container">
        <h2>Transaktionen nach Kartenart</h2>
        <Pie data={transaktionenNachKartenartData} options={{ responsive: true }} />
      </div>

      <div className="chart-container">
        <h2>Durchschnittliche Bewertungen pro Monat</h2>
        <Line
          data={{
            labels: bewertungenPerMonth.labels,
            datasets: [
              {
                label: "Durchschnitt",
                data: bewertungenPerMonth.data,
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
                borderWidth: 2,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Statistik;
