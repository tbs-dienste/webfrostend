import React, { useState } from 'react';
import './SimpleChatbot.scss'; // Stil für die Chatbot-Komponente

const SimpleChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleUserMessage = (text) => {
    let reply;
    if (text.toLowerCase().includes('hallo')) {
      reply = "Hallo! Wie kann ich Ihnen helfen?";
    } else if (text.toLowerCase().includes('preis')) {
      reply = "Die Preise variieren. Möchten Sie eine spezifische Information?";
    } else {
      reply = "Entschuldigung, ich verstehe Ihre Frage nicht. Klicken Sie hier für eine Videoberatung.";
    }
    
    setMessages([...messages, { text: text, sender: 'user' }]);
    setMessages([...messages, { text: reply, sender: 'bot' }]);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      <div className={`chatbot-button ${isOpen ? 'open' : ''}`} onClick={toggleChatbot}>
        {!isOpen ? <span>Chatbot</span> : <span>×</span>}
      </div>
      {isOpen && (
        <div className="chatbot-content">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' &&
              <div className="video-button">
                <a href="LINK_ZUR_VIDEOBERATUNG" target="_blank" rel="noopener noreferrer">
                  Zur Videoberatung
                </a>
              </div>
            }
          </div>
          <div className="user-input">
            <input
              type="text"
              placeholder="Nachricht eingeben..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUserMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChatbot;
