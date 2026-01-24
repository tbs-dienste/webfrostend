import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loading from "../../Loading/Loading";
import "./WeekCalendar.scss";

/* ------------------ ZEITEN LINKS ------------------ */
const HOURS = Array.from({ length: 12 }, (_, i) => {
  const h = 8 + i;
  return `${String(h).padStart(2, "0")}:00`;
});

/* ------------------ HILFSFUNKTIONEN ------------------ */
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getDurationInHours = (start, end) =>
  (timeToMinutes(end) - timeToMinutes(start)) / 60;

/* ISO-Kalenderwoche */
const getCalendarWeek = (dateStr) => {
  const date = new Date(dateStr);
  const thursday = new Date(date);
  thursday.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((thursday - firstThursday) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7
    )
  );
};

/* ================== COMPONENT ================== */
const WeekCalendar = () => {
  const [calendar, setCalendar] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  /* ------------------ FETCH ------------------ */
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Nicht eingeloggt");

        jwtDecode(token); // validiert Token

        const res = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/calendar",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setCalendar(res.data.calendar || {});
      } catch (err) {
        console.error(err);
        setError("Kalender konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  /* ------------------ WOCHEN BAUEN ------------------ */
  const weeks = useMemo(() => {
    const days = Object.keys(calendar).sort();
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [calendar]);

  /* ------------------ AKTUELLE WOCHE ------------------ */
  useEffect(() => {
    if (!weeks.length) return;
    const today = new Date().toISOString().split("T")[0];
    const index = weeks.findIndex(w => w.includes(today));
    setCurrentWeekIndex(index >= 0 ? index : 0);
  }, [weeks]);

  if (loading) return <Loading />;
  if (error) return <div className="calendar-error">{error}</div>;
  if (!weeks[currentWeekIndex]) return null;

  const week = weeks[currentWeekIndex];
  const kw = getCalendarWeek(week[0]);

  /* ================== RENDER ================== */
  return (
    <section className="week-calendar">

      {/* ---------- HEADER ---------- */}
      <header className="calendar-header">
        <button
          onClick={() => setCurrentWeekIndex(i => Math.max(0, i - 1))}
          disabled={currentWeekIndex === 0}
        >
          <FaChevronLeft />
        </button>

        <div className="calendar-title">
          <h1>Kalenderwoche {kw}</h1>
          <span>{week[0]} – {week[6]}</span>
        </div>

        <button
          onClick={() =>
            setCurrentWeekIndex(i =>
              Math.min(weeks.length - 1, i + 1)
            )
          }
          disabled={currentWeekIndex === weeks.length - 1}
        >
          <FaChevronRight />
        </button>
      </header>

      {/* ---------- TABLE ---------- */}
      <table className="calendar-table">
        <thead>
          <tr>
            <th className="time-col">Zeit</th>
            {week.map(date => (
              <th key={date}>
                {new Date(date).toLocaleDateString("de-DE", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit"
                })}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {HOURS.map(hour => (
            <tr key={hour}>
              <td className="time-col">{hour}</td>

              {week.map(date => {
                const events = calendar[date] || [];

                const eventStarting = events.find(e => e.start === hour);

                const covered = events.some(e => {
                  const cur = timeToMinutes(hour);
                  return (
                    cur > timeToMinutes(e.start) &&
                    cur < timeToMinutes(e.end)
                  );
                });

                if (covered) return null;

                if (eventStarting) {
                  const span = getDurationInHours(
                    eventStarting.start,
                    eventStarting.end
                  );

                  return (
                    <td
                      key={date + hour}
                      rowSpan={span}
                      className="calendar-cell"
                    >
                      <div
                        className={`event event--${eventStarting.status}`}
                        style={{ backgroundColor: eventStarting.color }}
                      >
                        <div className="event-time">
                          {eventStarting.start} – {eventStarting.end}
                        </div>
                        <div className="event-title">
                          {eventStarting.title}
                        </div>
                      </div>
                    </td>
                  );
                }

                return (
                  <td key={date + hour} className="calendar-cell" />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default WeekCalendar;
