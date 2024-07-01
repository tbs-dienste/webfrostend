import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './FaqComponent.scss';

const FaqComponent = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    // Beispielhafte FAQs
    const exampleFaqs = [
      { id: 1, question: 'Welche Arten von Webseiten bieten Sie an?', answer: 'Wir bieten eine Vielzahl von Webseiten an, darunter Unternehmensseiten, E-Commerce-Seiten, Blogs, Portfolios und mehr.' },
      { id: 2, question: 'Wie lange dauert die Entwicklung einer Webseite?', answer: 'Die Entwicklungszeit hängt vom Umfang und den Anforderungen des Projekts ab, kann jedoch typischerweise zwischen 2 Wochen und mehreren Monaten liegen.' },
      { id: 3, question: 'Wie viel kostet eine Webseite?', answer: 'Die Kosten variieren je nach Komplexität und Funktionen der Webseite. Kontaktieren Sie uns für ein maßgeschneidertes Angebot.' },
      { id: 4, question: 'Bieten Sie auch Wartung und Support an?', answer: 'Ja, wir bieten umfassende Wartungs- und Support-Dienstleistungen an, um sicherzustellen, dass Ihre Webseite immer aktuell und sicher ist.' },
      { id: 5, question: 'Können Sie meine bestehende Webseite überarbeiten?', answer: 'Ja, wir können Ihre bestehende Webseite analysieren und Verbesserungen in Design, Funktionalität und SEO vornehmen.' },
    ];
    setFaqs(exampleFaqs);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="faq-list">
      <h1>FAQ</h1>
      {faqs.map((faq, index) => (
        <div className="faq-item" key={faq.id}>
          <div className="faq-question" onClick={() => toggleFaq(index)}>
            {faq.question}
            <span className="faq-toggle">
              <FontAwesomeIcon icon={openFaqIndex === index ? faChevronUp : faChevronDown} />
            </span>
          </div>
          {openFaqIndex === index && <div className="faq-answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
};

export default FaqComponent;
