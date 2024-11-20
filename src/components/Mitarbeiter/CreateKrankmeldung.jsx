import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FaCheck } from 'react-icons/fa';
import './CreateKrankmeldung.scss';

const CreateKrankmeldung = () => {
  // Setzt den Zustand für die Start- und Enddaten sowie für andere Eingabewerte
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Funktion zum Setzen des Startdatums und der Enddatum-Erweiterung
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Datum im Format YYYY-MM-DD
    setStartDate(formattedToday);
    
    // Enddatum standardmäßig auf Startdatum + 1 Tag setzen
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const formattedNextDay = nextDay.toISOString().split('T')[0];
    setEndDate(formattedNextDay);
  }, []);

  // Funktion zum Absenden des Formulars
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason) {
      setMessage('Bitte füllen Sie alle Felder aus, um die Krankmeldung abzusenden.');
      return;
    }

    const token = localStorage.getItem('token');
    const data = { startDate, endDate, reason };

    try {
      setIsSubmitting(true);
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/krankmeldung', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setMessage('Ihre Krankmeldung wurde erfolgreich gesendet.');
        setTimeout(() => {
          window.close(); // Fenster nach 30 Sekunden schließen
        }, 30000);
      } else {
        setMessage('Es ist ein Fehler beim Erstellen Ihrer Krankmeldung aufgetreten.');
      }
    } catch (error) {
      console.error('Fehler beim Senden der POST-Anfrage:', error);
      setMessage('Ein technischer Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Neue Krankmeldung erstellen</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="krankmeldung-form">
        <div className="form-group">
          <label htmlFor="startDate">Startdatum</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Enddatum</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Grund</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Wird gesendet...' : 'Krankmeldung absenden'}
        </button>
      </form>
    </div>
  );
};

export default CreateKrankmeldung;
