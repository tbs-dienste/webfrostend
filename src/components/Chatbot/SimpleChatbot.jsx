import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./SimpleChatbot.scss";

const SimpleChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(prev => {
      const next = !prev;
  
      // 👋 Begrüßung nur beim ersten Öffnen
      if (next && messages.length === 0) {
        setMessages([
          {
            text: "👋 Hallo! Wie kann ich Ihnen helfen?",
            sender: "bot"
          }
        ]);
      }
  
      return next;
    });
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { text, sender: "user" }]);
    setTyping(true);

    try {
      const res = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/chatbot-answers/find-answer",
        { question: text },
        { timeout: 10000 }
      );

      const reply =
        res.data?.reply ||
        "🤖 Keine Antwort erhalten.";

      setMessages(prev => [
        ...prev,
        { text: reply, sender: "bot" }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          text: "❌ Server nicht erreichbar.",
          sender: "bot"
        }
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleSend = () => {
    const value = inputRef.current.value;
    inputRef.current.value = "";
    sendMessage(value);
  };

  return (
    <>
      {/* 🔘 Toggle Button */}
      <div className="chatbot-toggle" onClick={toggleChat}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faComments} />
      </div>

      {/* 💬 Chat Window */}
      <div className={`chatbot-window ${isOpen ? "open" : ""}`}>
        <header className="chatbot-header">Chatbot</header>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.sender}`}>
              {m.text}
            </div>
          ))}

          {typing && (
            <div className="message bot typing">•••</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            ref={inputRef}
            placeholder="Ihre Nachricht..."
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Senden</button>
        </div>
      </div>
    </>
  );
};

export default SimpleChatbot;
