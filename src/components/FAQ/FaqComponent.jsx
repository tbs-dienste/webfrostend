import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import './FaqComponent.scss';
import Loading from '../Loading/Loading';

const FaqComponent = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setIsAdmin(decoded.userType === 'admin');
        }

        const res = await axios.get(
          'https://tbsdigitalsolutionsbackend.onrender.com/api/faq',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFaqs(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('FAQs konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('FAQ wirklich löschen?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/faq/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="faq-error">{error}</div>;

  return (
    <section className="faq">
      <header className="faq-header">
        <div>
          <h1>Häufig gestellte Fragen</h1>
          <p>Antworten auf die wichtigsten Fragen rund um unsere Leistungen.</p>
        </div>

        {isAdmin && (
          <Link to="/createfaq" className="faq-add-btn">
            <FaPlus /> Neue FAQ
          </Link>
        )}
      </header>

      <div className="faq-list">
        {faqs.map(faq => (
          <article
            key={faq.id}
            className={`faq-item ${activeFaq === faq.id ? 'open' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => toggleFaq(faq.id)}
              aria-expanded={activeFaq === faq.id}
            >
              <span>{faq.question}</span>
              <i>{activeFaq === faq.id ? '−' : '+'}</i>
            </button>

            <div className="faq-answer">
              <p>{faq.answer || 'Keine Antwort vorhanden.'}</p>
            </div>

            {isAdmin && (
              <div className="faq-actions">
                <Link to={`/faq-edit/${faq.id}`} title="Bearbeiten">
                  <FaEdit />
                </Link>
                <button onClick={() => handleDelete(faq.id)} title="Löschen">
                  <FaTrash />
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default FaqComponent;
