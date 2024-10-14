import React, { useState } from 'react';
import axios from 'axios'; // Importiere axios für API-Anfragen
import './CreateFaq.scss';  // Import SCSS styling

const CreateFaq = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false); // State für den Ladezustand
  const [error, setError] = useState(null); // State für Fehlernachrichten

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ladezustand aktivieren
    setError(null); // Vorherige Fehler zurücksetzen

    try {
      const token = localStorage.getItem('token'); // Token aus localStorage abrufen
      
      // Sende die POST-Anfrage mit der richtigen Struktur
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/faq',
        {
          question, // Frage aus dem Input
          answer,   // Antwort aus dem Textbereich
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token im Header senden
          },
        }
      );

      if (response.status === 201) { // Überprüfen, ob die Antwort erfolgreich war
        alert('FAQ erfolgreich hinzugefügt!'); // Erfolgsmeldung
        window.location.href = "/faq"; // Umleitung zur FAQ-Seite

        // Reset form fields
        setQuestion('');
        setAnswer('');
      }
    } catch (error) {
      console.error("Fehler beim Erstellen der FAQ:", error);
      setError("Fehler beim Erstellen der FAQ. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false); // Ladezustand zurücksetzen
    }
  };

  return (
    <div className="create-faq-container">
      <h1>FAQ hinzufügen</h1>
      <form onSubmit={handleSubmit} className="add-faq-form">
        <label>
          <span>Frage</span>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Geben Sie Ihre Frage ein"
            required
          />
        </label>
        <label>
          <span>Antwort</span>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Geben Sie die Antwort ein"
            required
          ></textarea>
        </label>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Füge FAQ hinzu...' : 'FAQ hinzufügen'}
        </button>
        {error && <div className="error-message">{error}</div>} {/* Fehlernachricht */}
      </form>
    </div>
  );
};

export default CreateFaq;
