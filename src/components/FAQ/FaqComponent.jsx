import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Ensure that `Link` is imported
import './FaqComponent.scss';

const FaqComponent = ({ isAdmin }) => {
  const [faqs, setFaqs] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/faq'); // Update with your API endpoint
        console.log(response.data); // Log the response data
        if (Array.isArray(response.data.data)) {
          setFaqs(response.data.data); // Correctly set the FAQs array
        } else {
          console.error('Response data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {isAdmin && (
        <Link to="/createfaq" className="add-button">+</Link>
      )}

      <h1>Frequently Asked Questions</h1>

      <div className="faq-list">
        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <div className="faq-item" key={faq.id}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                {faq.question}
                <span className="faq-toggle">
                  <FontAwesomeIcon icon={openFaqIndex === index ? faChevronUp : faChevronDown} />
                </span>
              </div>
              {openFaqIndex === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))
        ) : (
          <p>No FAQs available.</p>
        )}
      </div>
    </div>
  );
};

export default FaqComponent;
