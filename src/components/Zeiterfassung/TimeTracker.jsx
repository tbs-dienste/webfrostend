import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './TimeTracker.scss';

const TimeTracker = () => {
  const { id } = useParams(); // Lese die ID aus der URL

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [workSessions, setWorkSessions] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(20);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    fetchWorkSessions();
  }, [id]);

  const fetchWorkSessions = async () => {
    try {
      const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/work_sessions/${id}`);
      setWorkSessions(response.data.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Arbeitszeitsitzungen:', error);
    }
  };

  const getCurrentSession = () => {
    if (startTime) {
      const currentDuration = (new Date() - startTime) / (1000 * 60 * 60);
      const sessionPrice = roundTo5Cents(currentDuration * hourlyRate);
      return {
        customerId: id,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: currentDuration.toFixed(2),
        price: sessionPrice.toFixed(2)
      };
    }
    return null;
  };

  const handleStart = () => {
    setStartTime(new Date());
    setIsTracking(true);
  };

  const handleStop = async () => {
    setIsTracking(false);
    setEndTime(new Date());
    if (startTime) {
      const currentSession = getCurrentSession();
      if (currentSession) {
        try {
          await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/work_sessions', currentSession);
          fetchWorkSessions();
        } catch (error) {
          console.error('Fehler beim Speichern der Arbeitszeitsitzung:', error);
        }
      }
    }
  };

  const handleEdit = session => {
    setEditingSession(session);
    setIsEditing(true);
  };

  const handleDelete = async sessionId => {
    try {
      await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/work_sessions/${sessionId}`);
      fetchWorkSessions();
    } catch (error) {
      console.error('Fehler beim Löschen der Arbeitszeitsitzung:', error);
    }
  };

  const handleSaveSession = async () => {
    if (editingSession) {
      try {
        await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/work_sessions/${editingSession.id}`, editingSession);
        setIsEditing(false);
        setEditingSession(null);
        fetchWorkSessions();
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Arbeitszeitsitzung:', error);
      }
    }
  };

  const handleSaveHourlyRate = () => {
    setIsEditing(false); // Beenden des Bearbeitungsmodus nach dem Speichern
  };

  const totalAmount = roundTo5Cents(workSessions.reduce((total, session) => total + parseFloat(session.price), 0));
  const totalDuration = workSessions.reduce((total, session) => total + parseFloat(session.duration), 0);

  // PDF-Generierungsfunktion
  const generatePDF = () => (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header}>Arbeitszeit-Report</Text>
        {workSessions.map((session, index) => (
          <View key={index} style={styles.section}>
            <Text>Start: {new Date(session.startTime).toLocaleString()}</Text>
            <Text>Ende: {new Date(session.endTime).toLocaleString()}</Text>
            <Text>Dauer: {session.duration} Stunden</Text>
            <Text>Preis: {session.price} €</Text>
          </View>
        ))}
        <View style={styles.section}>
          <Text>Gesamtdauer: {totalDuration.toFixed(2)} Stunden</Text>
          <Text>Gesamtpreis: {totalAmount.toFixed(2)} €</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="time-tracker">
      <h1>Arbeitszeiterfassung</h1>
      <div>
        <button onClick={isTracking ? handleStop : handleStart}>
          {isTracking ? 'Stop' : 'Start'}
        </button>
      </div>
      {isTracking && (
        <div>
          <h2>Laufende Sitzung</h2>
          <p>Start: {new Date(startTime).toLocaleString()}</p>
          <p>Aktuelle Dauer: {((new Date() - startTime) / (1000 * 60 * 60)).toFixed(2)} Stunden</p>
          <p>Aktueller Preis: {roundTo5Cents(((new Date() - startTime) / (1000 * 60 * 60)) * hourlyRate).toFixed(2)} €</p>
        </div>
      )}
      <div>
        <h2>Arbeitszeitsitzungen</h2>
        <ul>
          {workSessions.map(session => (
            <li key={session.id}>
              <p>Start: {new Date(session.startTime).toLocaleString()}</p>
              <p>Ende: {new Date(session.endTime).toLocaleString()}</p>
              <p>Dauer: {session.duration} Stunden</p>
              <p>Preis: {session.price} €</p>
              <button onClick={() => handleEdit(session)}>Bearbeiten</button>
              <button onClick={() => handleDelete(session.id)}>Löschen</button>
            </li>
          ))}
        </ul>
      </div>
      {isEditing && editingSession && (
        <div>
          <h2>Arbeitszeitsitzung bearbeiten</h2>
          <label>Startzeit:</label>
          <input
            type="datetime-local"
            value={new Date(editingSession.startTime).toISOString().slice(0, -1)}
            onChange={e => setEditingSession({ ...editingSession, startTime: new Date(e.target.value).toISOString() })}
          />
          <label>Endzeit:</label>
          <input
            type="datetime-local"
            value={new Date(editingSession.endTime).toISOString().slice(0, -1)}
            onChange={e => setEditingSession({ ...editingSession, endTime: new Date(e.target.value).toISOString() })}
          />
          <label>Dauer:</label>
          <input
            type="number"
            value={editingSession.duration}
            onChange={e => setEditingSession({ ...editingSession, duration: parseFloat(e.target.value) })}
          />
          <label>Preis:</label>
          <input
            type="number"
            value={editingSession.price}
            onChange={e => setEditingSession({ ...editingSession, price: parseFloat(e.target.value) })}
          />
          <button onClick={handleSaveSession}>Speichern</button>
        </div>
      )}
      <div>
        <h2>Stundensatz</h2>
        {isEditing ? (
          <div>
            <input
              type="number"
              value={hourlyRate}
              onChange={e => setHourlyRate(parseFloat(e.target.value))}
            />
            <button onClick={handleSaveHourlyRate}>Speichern</button>
          </div>
        ) : (
          <div>
            <p>Stundensatz: {hourlyRate} €</p>
            <button onClick={() => setIsEditing(true)}>Bearbeiten</button>
          </div>
        )}
      </div>
      <PDFDownloadLink document={generatePDF()} fileName="arbeitszeit-report.pdf">
        {({ loading }) => (loading ? 'PDF wird erstellt...' : 'PDF herunterladen')}
      </PDFDownloadLink>
    </div>
  );
};

const styles = StyleSheet.create({
  body: {
    padding: 10
  },
  header: {
    fontSize: 18,
    marginBottom: 10
  },
  section: {
    marginBottom: 10
  }
});

const roundTo5Cents = num => {
  return Math.round(num * 20) / 20;
};

export default TimeTracker;
