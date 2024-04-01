import React, { Component } from 'react';
import './KurseListe.scss'; // Importiere das SCSS-Styling

// Array von Programmierkursen mit angepassten Preisen in Euro
const programmierKurse = [
  {
    id: 1,
    titel: 'HTML für Anfänger',
    beschreibung: 'Grundlagen von HTML kennenlernen',
    preis: '29.99',
    zoomMeeting: 'Online Zoom Meeting: Jeden Montag um 18:00 Uhr',
    lerninhalte: [
      'Grundlegende HTML-Tags kennenlernen',
      'Strukturieren von Webseiten mit HTML',
      'Einbindung von Bildern, Links und Videos'
    ]
  },
  {
    id: 2,
    titel: 'JavaScript für Einsteiger',
    beschreibung: 'Grundlegende Konzepte von JavaScript verstehen',
    preis: '39.99',
    zoomMeeting: 'Online Zoom Meeting: Jeden Mittwoch um 19:00 Uhr',
    lerninhalte: [
      'Variablen, Datentypen und Operatoren',
      'Bedingungen und Schleifen',
      'Funktionen und Ereignisbehandlung'
    ]
  },
  {
    id: 3,
    titel: 'React.js Grundkurs',
    beschreibung: 'Lernen Sie die Grundlagen von React.js',
    preis: '49.99',
    zoomMeeting: 'Online Zoom Meeting: Jeden Freitag um 17:00 Uhr',
    lerninhalte: [
      'Einführung in React.js und JSX',
      'Komponenten und Props',
      'Zustand und Lebenszyklus von Komponenten'
    ]
  }
];

class KursListe extends Component {
  render() {
    return (
      <div className="kurs-liste-container">
        <h1>Willkommen zu unseren Online-Kursen</h1>
        <p>
          Unsere Kurse bieten feste Online Zoom Meetings an, bei denen Sie gemeinsam mit anderen lernen können.
          Nach den Sitzungen stehen Ihnen außerdem Lernvideos zur Verfügung.
        </p>
        <div className="kurs-liste">
          {programmierKurse.map(kurs => (
            <div key={kurs.id} className="kurs">
              <h2 className="kurs-titel">{kurs.titel}</h2>
              <p className="kurs-beschreibung">{kurs.beschreibung}</p>
              <p className="kurs-preis">Preis: €{kurs.preis}</p>
              <p className="kurs-meeting">{kurs.zoomMeeting}</p>
              <div className="kurs-button-container">
                <div className="kurs-button-disabled" title="Bald verfügbar">
                  Jetzt kaufen
                </div>
                <span style={{ color: 'red' }}>Bald verfügbar</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default KursListe;
