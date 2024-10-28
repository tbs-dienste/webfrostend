import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './SimpleChatbot.scss'; // Stil für die Chatbot-Komponente

const SimpleChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setHasUnreadMessages(false); // Benachrichtigung zurücksetzen, wenn geöffnet
  };

  const handleUserMessage = async (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);
    setHasUnreadMessages(!isOpen); // Setzt die Benachrichtigung, wenn der Chat geschlossen ist

    setTyping(true);
    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/chatbot-answers/findAnswer', { question: text });
      const reply = response.data.reply;

      setMessages([...newMessages, { text: reply, sender: 'bot' }]);
    } catch (error) {
      console.error("Fehler beim Abrufen der Antwort:", error);
      setMessages([...newMessages, { text: "Entschuldigung, ich kann die Antwort nicht abrufen.", sender: 'bot' }]);
    } finally {
      setTyping(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-button" onClick={toggleChatbot}>
        {isOpen ? (
          <FontAwesomeIcon icon={faTimes} />
        ) : (
          <>
            <FontAwesomeIcon icon={faComments} />
            {hasUnreadMessages && <div className="unread-badge">!</div>}
          </>
        )}
      </div>

      {isOpen && (
        <div className="chatbot-content">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender}`}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
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
              placeholder="Ihre Nachricht..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
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
