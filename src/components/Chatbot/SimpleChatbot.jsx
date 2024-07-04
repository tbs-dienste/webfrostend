import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import './SimpleChatbot.scss'; // Stil für die Chatbot-Komponente

const SimpleChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleUserMessage = (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);

    setTyping(true);
    setTimeout(() => {
      let reply;
      if (text.toLowerCase().includes('hallo')) {
        reply = "Hallo! Wie kann ich Ihnen helfen?";
      } else if (text.toLowerCase().includes('preis')) {
        reply = "Die Preise variieren. Möchten Sie eine spezifische Information?";
      } else {
        reply = "Entschuldigung, ich verstehe Ihre Frage nicht. Klicken Sie hier für eine Videoberatung.";
      }

      setMessages([...newMessages, { text: reply, sender: 'bot' }]);
      setTyping(false);
    }, 1500);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
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
