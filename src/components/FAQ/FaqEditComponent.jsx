import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FaqEditComponent.scss'; // Importiere das SCSS

const FaqEditComponent = () => {
  const { id } = useParams(); // FAQ-ID aus den URL-Parametern abrufen
  const [faq, setFaq] = useState({ question: '', answer: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/faq/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFaq(response.data.data);
      } catch (error) {
        console.error("Fehler beim Laden der FAQ:", error);
        setError("Fehler beim Laden der FAQ.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/faq/${id}`, faq, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.href = '/faq'; // Nach dem Bearbeiten zur FAQ-Liste zurückleiten
    } catch (error) {
      console.error("Fehler beim Aktualisieren der FAQ:", error);
      setError("Fehler beim Aktualisieren der FAQ.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="faq-edit-container">
      <h2>FAQ bearbeiten</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Frage:</label>
          <input
            type="text"
            name="question"
            value={faq.question}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Antwort:</label>
          <textarea
            name="answer"
            value={faq.answer}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Änderungen speichern</button>
      </form>
    </div>
  );
};

export default FaqEditComponent;
