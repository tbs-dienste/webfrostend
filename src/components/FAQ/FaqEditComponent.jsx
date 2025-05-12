import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FaqEditComponent.scss';

const FaqEditComponent = () => {
  const { id } = useParams();
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
      window.location.href = '/faq';
    } catch (error) {
      console.error("Fehler beim Aktualisieren der FAQ:", error);
      setError("Fehler beim Aktualisieren der FAQ.");
    }
  };

  if (loading) return <div className="edit-faq-container"><p>Loading...</p></div>;

  return (
    <div className="edit-faq-container">
      <h1>FAQ bearbeiten</h1>
      <form className="edit-faq-form" onSubmit={handleSubmit}>
        <label>
          <span>Frage</span>
          <input
            type="text"
            name="question"
            value={faq.question}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <span>Antwort</span>
          <textarea
            name="answer"
            value={faq.answer}
            onChange={handleChange}
            required
          />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button">Änderungen speichern</button>
      </form>
    </div>
  );
};

export default FaqEditComponent;
