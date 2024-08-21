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
      { id: 6, question: 'Wie erstellen Sie maßgeschneiderte Diashows?', answer: 'Unsere Diashow-Erstellung umfasst das Bearbeiten von Fotos und Videos, die Auswahl passender Musik und das Designen der Diashow, um Ihre besonderen Momente unvergesslich zu machen.' },
      { id: 7, question: 'Welche Möglichkeiten gibt es beim Gaming PC Zusammenbau?', answer: 'Wir stellen einen Gaming-PC entsprechend Ihrem Budget und Ihren Anforderungen zusammen, wobei wir auf die neuesten Technologien und Leistungsanforderungen achten.' },
      { id: 8, question: 'Wie gestalten Sie Visitenkarten?', answer: 'Wir bieten maßgeschneiderte Designs für Visitenkarten, die auf Ihre Marke abgestimmt sind. Der Service umfasst die Auswahl von Farben, Schriften und Grafiken, um einen bleibenden Eindruck zu hinterlassen.' },
      { id: 9, question: 'Können Sie uns beim Erstellen von Flyern helfen?', answer: 'Ja, wir erstellen kreative und ansprechende Flyer, die Ihre Botschaft effektiv kommunizieren. Dies umfasst das Layout, die Grafiken und die Typografie.' },
      { id: 10, question: 'Welchen IT-Support bieten Sie an?', answer: 'Unser IT-Support umfasst schnelle Lösungen für technische Probleme, einschließlich Hardware- und Software-Support, Netzwerkverwaltung und Sicherheitslösungen.' },
      { id: 11, question: 'Wie funktioniert Ihre Eventplanung?', answer: 'Wir bieten umfassende Eventplanung, einschließlich Budgetierung, Standortwahl, Catering und Veranstaltungsmanagement, um sicherzustellen, dass Ihr Event reibungslos abläuft.' },
      { id: 12, question: 'Wie erstellen Sie Mockups?', answer: 'Wir erstellen detaillierte und realistische Mockups für Ihre Designs, sei es für Produktverpackungen, Webdesigns, App-Layouts oder Marketingmaterialien.' },
    ];
    setFaqs(exampleFaqs);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>Häufig gestellte Fragen</h1>
      <div className="faq-list">
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
    </div>
  );
};

export default FaqComponent;
