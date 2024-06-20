import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import './SimpleChatbot.scss'; // Stile importieren

const SimpleChatbot = () => {
  const [chatbotOpened, setChatbotOpened] = useState(false);

  const serviceDetails = {
    1: {
      img: 'webseite.png',
      title: "Webseite Programmieren",
      description: "Details zur Webseite Programmieren: Möchten Sie eine professionelle Online-Präsenz für Ihr Unternehmen oder Ihre persönlichen Projekte? Wir bieten maßgeschneiderte Webseiten-Entwicklungsdienstleistungen, die auf Ihre spezifischen Anforderungen zugeschnitten sind. Von der Konzeption bis zur Umsetzung kümmern wir uns um jeden Schritt des Prozesses, um sicherzustellen, dass Ihre Webseite modern, benutzerfreundlich und funktional ist. Egal ob es sich um eine Unternehmenswebsite, einen Blog, einen Online-Shop oder eine Portfolio-Website handelt - wir machen es möglich! Kontaktieren Sie uns noch heute, um Ihre Vision in die Realität umzusetzen."
    },
    2: {
      img: 'diashow.png',
      title: "Diashow erstellen",
      description: "Details zur Diashow erstellen: Mit unserer Diashow-Erstellungs-Dienstleistung machen wir Ihre besonderen Momente unvergesslich! Egal ob für Hochzeiten, Konfirmationen, Geburtstage oder andere Anlässe - wir verwandeln Ihre Fotos und Videos in eine atemberaubende Diashow. Von der Auswahl der Musik bis zur Bearbeitung der Bilder kümmern wir uns um jedes Detail, um eine Diashow zu erstellen, die Ihre Erwartungen übertrifft. Teilen Sie uns einfach Ihre Vorstellungen mit, und wir kreieren eine maßgeschneiderte Diashow, die Ihre persönliche Geschichte zum Leben erweckt."
    },
    3: {
      img: 'pc.png',
      title: "Gaming PC zusammenbauen",
      description: "Details zur Gaming PC Zusammenstellung: Teilen Sie uns einfach Ihr Budget mit, und wir stellen Ihnen einen passenden Gaming PC im gewünschten Budgetbereich zusammen. Bereit für grenzenloses Gaming-Vergnügen, abgestimmt auf Ihre Vorlieben und finanziellen Möglichkeiten."
    },
    4: {
      img: 'musik.png',
      title: "Musik",
      description: "Details zur Musik: Teilen Sie uns einfach Ihre Musikpräferenzen und Ihr Budget mit, und wir bieten Ihnen passende Musiklösungen an, die Ihre Erwartungen übertreffen."
    }
  };

  // Komponente vor ihrer Verwendung definieren
  const ResponseComponent = (props) => {
    const userInput = props.previousValue.toLowerCase().trim();
    let responseMessage = "Entschuldigung, ich verstehe Ihre Frage nicht. Wie kann ich Ihnen sonst helfen?";

    // Durchsuche die serviceDetails nach passenden Dienstleistungen
    for (let key in serviceDetails) {
      if (userInput.includes(key.toLowerCase())) {
        responseMessage = serviceDetails[key].description;
        break;
      }
    }

    return (
      <div>
        {props.previousValue && (
          <p>
            Sie haben gefragt: <strong>{props.previousValue}</strong>
          </p>
        )}
        <p>{responseMessage}</p>
      </div>
    );
  };

  const steps = [
    {
      id: '1',
      message: 'Hallo! Wie kann ich Ihnen helfen?',
      trigger: 'userInput',
    },
    {
      id: 'userInput',
      user: true,
      trigger: 'response',
    },
    {
      id: 'response',
      component: <ResponseComponent />,
      trigger: 'userInput',
    },
  ];

  const toggleChatbot = () => {
    setChatbotOpened(!chatbotOpened);
  };

  return (
    <div>
      <div className={`chatbot-button ${chatbotOpened ? 'active' : ''}`} onClick={toggleChatbot}>
        <span>Chat</span>
      </div>
      <div className={`chatbot-container ${chatbotOpened ? 'active' : ''}`}>
        <div className="chatbot-header">
          <span>Chatbot</span>
          <button className="close-btn" onClick={toggleChatbot}>X</button>
        </div>
        <div className="chatbot-messages">
          <ChatBot steps={steps} />
        </div>
      </div>
    </div>
  );
};

export default SimpleChatbot;
