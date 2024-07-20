import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import './SimpleChatbot.scss'; // Stil für die Chatbot-Komponente

const SimpleChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const faqs = [
    { question: 'hallo', reply: 'Hallo! Wie kann ich Ihnen helfen?' },
    { question: 'wie viel kostet', reply: 'Die Preise variieren. Möchten Sie eine spezifische Information? <br/><a href="https://tbs-solutions.vercel.app/preise" class="chatbot-link" target="_blank">Preisinformationen</a>' },
    { question: 'ich brauche hilfe', reply: 'Ich bin hier, um Ihnen zu helfen. Was brauchen Sie? <br/><a href="https://tbs-solutions.vercel.app/kundeerfassen" class="chatbot-link" target="_blank">Kontakt aufnehmen</a>' },
    { question: 'was sind die öffnungszeiten', reply: 'Unsere Öffnungszeiten sind Montag bis Freitag von 9 bis 17 Uhr. <br/><a href="https://tbs-solutions.vercel.app" class="chatbot-link" target="_blank">Website besuchen</a>' },
    { question: 'was ist deine funktion', reply: 'Ich bin ein virtueller Assistent, um Ihre Fragen zu beantworten und Ihnen Informationen zu geben.' },
    { question: 'wer bist du', reply: 'Ich bin ein Chatbot, entwickelt um Ihnen zu helfen.' },
    { question: 'wo finde ich euch', reply: 'Sie können uns auf unserer Website finden: <br/><a href="https://tbs-solutions.vercel.app" class="chatbot-link" target="_blank">TBS Solutions</a>' }
  ];

  const synonyms = {
    hallo: ['hi', 'hey', 'hallo', 'guten tag'],
    'wie viel kostet': ['kosten', 'preis', 'kostenpunkt'],
    'ich brauche hilfe': ['hilfe', 'unterstützung'],
    'was sind die öffnungszeiten': ['öffnungszeiten', 'stunden', 'arbeitszeiten'],
    'was ist deine funktion': ['funktion', 'aufgabe', 'rolle'],
    'wer bist du': ['identität', 'wer', 'name'],
    'wo finde ich euch': ['standort', 'adresse', 'finden']
  };

  const getBotReply = (text) => {
    for (let faq of faqs) {
      for (let synonym of synonyms[faq.question] || [faq.question]) {
        if (text.toLowerCase().includes(synonym.toLowerCase())) {
          return faq.reply;
        }
      }
    }
    return `
      Entschuldigung, ich verstehe Ihre Frage nicht.
      <br/><a href="https://www.example.com/kontakt" class="chatbot-link" target="_blank">Kontakt aufnehmen</a>
      <br/><div class="button-container">
        <button className="chatbot-button" onClick={handleChatWithAgent}>Chat</button>
        <button className="chatbot-button" onClick={handleVideoConsultation}>Videoberatung</button>
      </div>
    `;
  };

  const handleUserMessage = (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);

    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages([...newMessages, { text: reply, sender: 'bot' }]);
      setTyping(false);
    }, 1500);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleChatWithAgent = () => {
    window.open("https://www.example.com/chat", "_blank");
  };

  const handleVideoConsultation = () => {
    window.open("https://www.example.com/videoberatung", "_blank");
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div className="chatbot-container">
      <div className={`chatbot-button ${isOpen ? 'open' : ''}`} onClick={toggleChatbot}>
        {!isOpen ? <FontAwesomeIcon icon={faComments} /> : <FontAwesomeIcon icon={faTimes} />}
      </div>
      {isOpen && (
        <div className="chatbot-content">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`} dangerouslySetInnerHTML={{ __html: message.text }}>
              </div>
            ))}
            {typing && (
              <div className="message bot typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="user-input">
            <input
              type="text"
              placeholder="Nachricht eingeben..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleUserMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button onClick={() => {
              const input = document.querySelector('.user-input input');
              handleUserMessage(input.value);
              input.value = '';
            }}>
              Senden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChatbot;
