import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './SimpleChatbot.scss';

const SimpleChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
    setHasUnreadMessages(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserMessage = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newMessages = [...messages, { text: trimmedText, sender: 'user' }];
    setMessages(newMessages);
    setHasUnreadMessages(!isOpen);
    setTyping(true);

    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/chatbot-answers/find-answer', { question: trimmedText });
      const replyText = response.data.reply || "Entschuldigung, ich konnte keine Antwort finden.";

      setMessages(prev => [...prev, { text: replyText, sender: 'bot' }]);
    } catch (error) {
      console.error("Fehler beim Abrufen der Antwort:", error);
      setMessages(prev => [...prev, { text: "Fehler beim Abrufen der Antwort. Bitte versuchen Sie es später erneut.", sender: 'bot' }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSend = () => {
    const input = inputRef.current;
    if (input && input.value.trim()) {
      handleUserMessage(input.value);
      input.value = '';
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-toggle" onClick={toggleChatbot}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faComments} />
        {!isOpen && hasUnreadMessages && <div className="unread-badge">!</div>}
      </div>

      {isOpen && (
        <div className="chatbot-content">
          <div className="chatbot-header">Chatbot</div>

          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div dangerouslySetInnerHTML={{ __html: message.text }} />
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
              ref={inputRef}
              type="text"
              placeholder="Ihre Nachricht..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Senden</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChatbot;
