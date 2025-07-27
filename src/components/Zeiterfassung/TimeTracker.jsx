import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TimeTracker.scss';

const TimeTracker = () => {
  const { id } = useParams();
  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [selectedDienstleistung, setSelectedDienstleistung] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDienstleistungen();
  }, [id]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const fetchDienstleistungen = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data?.data?.dienstleistungen || [];
      setDienstleistungen(data);
      setSelectedDienstleistung(data.length === 1 ? data[0] : null);
    } catch (error) {
      setMessage('Fehler beim Laden der Dienstleistungen.');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setTimer(0);
    setIsRunning(true);
    setMessage('');
  };

  const handleStop = async () => {
    setIsRunning(false);
    await saveArbeitszeit();
  };

  const saveArbeitszeit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/record`, {
        kundenId: id,
        dienstleistungId: selectedDienstleistung?.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + timer * 1000).toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Arbeitszeit gespeichert!');
    } catch (error) {
      setMessage('Fehler beim Speichern der Arbeitszeit.');
    }
  };

  // SVG Circle Constants
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - (timer % 60) / 60);

  return (
    <div className="time-tracker-container">
      <h2>Zeit Tracker</h2>
      {loading ? (
        <p>Lädt...</p>
      ) : (
        <>
          {dienstleistungen.length > 1 && (
            <div className="dropdown-container">
              <label>Dienstleistung wählen:</label>
              <select
                value={selectedDienstleistung?.id || ''}
                onChange={(e) =>
                  setSelectedDienstleistung(
                    dienstleistungen.find((d) => d.id === parseInt(e.target.value))
                  )
                }
                disabled={isRunning}
              >
                {dienstleistungen.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          {dienstleistungen.length === 1 && (
            <p className="single-service">Dienstleistung: {dienstleistungen[0].title}</p>
          )}

          <div className="animated-timer">
            <svg className="progress-ring" width="180" height="180">
              <circle
                className="progress-ring__background"
                stroke="#ecf0f1"
                strokeWidth="10"
                fill="transparent"
                r={radius}
                cx="90"
                cy="90"
              />
              <circle
                className="progress-ring__circle"
                stroke="#3498db"
                strokeWidth="10"
                fill="transparent"
                r={radius}
                cx="90"
                cy="90"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                }}
              />
            </svg>
            <span className="animated-timer-display">
              {new Date(timer * 1000).toISOString().substr(11, 8)}
            </span>
          </div>

          <div className="time-controls">
            {isRunning ? (
              <>
                <button className="stop-btn" onClick={handleStop}>Stoppen</button>
                <button className="cancel-btn" onClick={() => setIsRunning(false)}>Abbrechen</button>
              </>
            ) : (
              <button className="start-btn" onClick={handleStart}>Starten</button>
            )}
          </div>

          {message && <p className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>{message}</p>}
        </>
      )}
    </div>
  );
};

export default TimeTracker;