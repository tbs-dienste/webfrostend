import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import './TimeTracker.scss'; // Importiere das SCSS-Styling

const TimeTracker = () => {
  const { id } = useParams(); // Lese die ID aus der URL

  // Nutze die ID des Kunden, um die Arbeitszeiten für jeden Kunden separat zu speichern
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [workSessions, setWorkSessions] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(20);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedSessions = localStorage.getItem(`workSessions_${id}`); // Verwende die ID des Kunden im localStorage-Key
    const storedHourlyRate = localStorage.getItem(`hourlyRate_${id}`);
    if (storedSessions) {
      setWorkSessions(JSON.parse(storedSessions));
    }
    if (storedHourlyRate) {
      setHourlyRate(parseFloat(storedHourlyRate));
    }
  }, [id]); // Füge die ID als Abhängigkeit hinzu

  useEffect(() => {
    let timer;
    if (isTracking) {
      const interval = 1000; // 1 Sekunde
      timer = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + interval);
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isTracking]);

  const handleStart = () => {
    setStartTime(new Date());
    setIsTracking(true);
  };

  const handleStop = () => {
    setIsTracking(false);
    const endTime = new Date();
    const duration = (endTime - startTime) / (1000 * 60 * 60); // Dauer in Stunden
    const sessionPrice = roundTo5Cents(duration * hourlyRate);
    const newSession = { id: Date.now(), start: startTime.toLocaleString(), end: endTime.toLocaleString(), duration: duration.toFixed(2), price: sessionPrice.toFixed(2) };
    const newWorkSessions = [...workSessions, newSession];
    localStorage.setItem(`workSessions_${id}`, JSON.stringify(newWorkSessions));
    setWorkSessions(newWorkSessions);
    setElapsedTime(0);
  };

  const handleDeleteSession = (id) => {
    const updatedSessions = workSessions.filter(session => session.id !== id);
    localStorage.setItem(`workSessions_${id}`, JSON.stringify(updatedSessions));
    setWorkSessions(updatedSessions);
  };

  const handleSaveHourlyRate = () => {
    localStorage.setItem(`hourlyRate_${id}`, hourlyRate.toString());
    setIsEditing(false); // Beenden des Bearbeitungsmodus nach dem Speichern
  };

  const totalAmount = roundTo5Cents(workSessions.reduce((total, session) => total + parseFloat(session.price), 0));

  // PDF-Generierungsfunktion
  const generatePDF = () => {
    return (
      <Document>
        <Page>
          <View>
            {workSessions.map((session, index) => (
              <Text key={index}>{session.start} - {session.end} - {session.duration} Stunden - {session.price} €</Text>
            ))}
            <Text>Gesamt: {totalAmount.toFixed(2)} €</Text>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <div className="time-tracker-container">
      <h1>Time Tracker</h1>
      <p className="time-display">Bereits gearbeitete Zeit: {elapsedTime} ms</p>
      <div className="buttons-container">
        {!isTracking ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
        <button onClick={() => setIsEditing(true)}>Stundensatz bearbeiten</button>
        {isEditing && (
          <div className="edit-rate-container">
            <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(parseFloat(e.target.value))} />
            <button onClick={handleSaveHourlyRate}>Speichern</button>
          </div>
        )}
      </div>
      <PDFDownloadLink document={generatePDF()} fileName="work_sessions.pdf" className="pdf-download-link">
        {({ blob, url, loading, error }) =>
          loading ? 'PDF wird generiert...' : 'PDF herunterladen'
        }
      </PDFDownloadLink>
      <div className="work-sessions-container">
        <h2>Arbeitssitzungen</h2>
        <ul>
          {workSessions.map(session => (
            <li key={session.id}>
              {session.start} - {session.end} - {session.duration} Stunden - {session.price} € 
              <button onClick={() => handleDeleteSession(session.id)}>Löschen</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const roundTo5Cents = (amount) => {
  return Math.round(amount * 20) / 20;
};

export default TimeTracker;
