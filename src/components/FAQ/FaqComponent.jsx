import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Icons importieren
import { jwtDecode } from 'jwt-decode'; // jwt-decode importieren
import './FaqComponent.scss';
import Loading from '../Loading/Loading';

const FaqComponent = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State für Admin-Status
  const [activeFaq, setActiveFaq] = useState(null); // State für die aktivierte FAQ

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsAdmin(decodedToken.userType === 'admin');
        }

        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/faq', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFaqs(response.data.data);
      } catch (error) {
        console.error("Fehler beim Laden der FAQs:", error);
        setError("Fehler beim Laden der FAQs.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bist du sicher, dass du diese FAQ löschen möchtest?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/faq/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFaqs(faqs.filter(faq => faq.id !== id));
      } catch (error) {
        console.error("Fehler beim Löschen der FAQ:", error);
      }
    }
  };

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id); // Wenn die FAQ bereits geöffnet ist, schließen
  };

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="faq-container">
      <h1>
        Häufig gestellte Fragen
        {isAdmin && (
          <Link to="/createfaq" className="add-button">+</Link>
        )}
      </h1>

      <div className="faq-list">
        {faqs.map(faq => (
          <div className="faq-card" key={faq.id}>
            <div className="faq-header" onClick={() => toggleFaq(faq.id)}>
              <h2>{faq.question}</h2>
            </div>
            {activeFaq === faq.id && (
              <div className="faq-answer">
                <p>
                  {faq.answer || "Keine Antwort verfügbar"}
                </p>
              </div>
            )}

            {isAdmin && ( // Admin-Schaltflächen nur für Admins anzeigen
              <div className="admin-buttons">
                <Link to={`/faq-edit/${faq.id}`} className="edit-button">
                  <FaEdit />
                </Link>
                <button className="delete-button" onClick={() => handleDelete(faq.id)}>
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqComponent;
