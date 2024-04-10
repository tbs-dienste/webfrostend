import React, { useState } from 'react';
import axios from 'axios';
import './KundeErfassen.scss';

const KundeErfassen = () => {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [strasseHausnummer, setStrasseHausnummer] = useState('');
  const [postleitzahl, setPostleitzahl] = useState('');
  const [ort, setOrt] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [mobil, setMobil] = useState('');
  const [geschlecht, setGeschlecht] = useState('');
  const [auftragsTyp, setAuftragsTyp] = useState('');
  const [auftragsBeschreibung, setAuftragsBeschreibung] = useState('');

  const handleKontaktAufnehmen = () => {
    const newKunde = {
      vorname,
      nachname,
      strasseHausnummer,
      postleitzahl,
      ort,
      email,
      telefon,
      mobil,
      geschlecht,
    };
  
    axios.post('https://backend-1-cix8.onrender.com/api/v1/kunden', newKunde)
      .then(response => {
        console.log('Kontaktdaten erfolgreich gesendet:', response.data);
        handleKontaktAufnehmen(response.data.data.id); // Datenstruktur anpassen, um die ID zu erhalten
        window.location.href = '/dankesnachricht'; // Hier wird die Weiterleitung zur Dankesnachricht-Seite durchgeführt
      })
      .catch(error => {
        console.error('Fehler beim Senden der Kontaktdaten:', error);
        alert('Fehler beim Aufnehmen der Kontaktdaten. Bitte versuchen Sie es erneut.');
      });
  };
  

  

  return (
    <div className="kunde-erfassen">
      <h2>Kontaktdaten</h2>
      <div className="formular">
        <div className="formular-gruppe">
          <label htmlFor="vorname">Vorname:</label>
          <input
            type="text"
            id="vorname"
            value={vorname}
            onChange={(e) => setVorname(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="nachname">Nachname:</label>
          <input
            type="text"
            id="nachname"
            value={nachname}
            onChange={(e) => setNachname(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="strasseHausnummer">Strasse und Hausnummer:</label>
          <input
            type="text"
            id="strasseHausnummer"
            value={strasseHausnummer}
            onChange={(e) => setStrasseHausnummer(e.target.value)}
          />
        </div>
       
        <div className="formular-gruppe">
          <label htmlFor="postleitzahl">Postleitzahl:</label>
          <input
            type="text"
            id="postleitzahl"
            value={postleitzahl}
            onChange={(e) => setPostleitzahl(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="ort">Ort:</label>
          <input
            type="text"
            id="ort"
            value={ort}
            onChange={(e) => setOrt(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="email">Email-Adresse:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="telefon">Telefon:</label>
          <input
            type="tel"
            id="telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="mobil">Mobil:</label>
          <input
            type="tel"
            id="mobil"
            value={mobil}
            onChange={(e) => setMobil(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="geschlecht">Geschlecht:</label>
          <select
            id="geschlecht"
            value={geschlecht}
            onChange={(e) => setGeschlecht(e.target.value)}
          >
            <option value="">Bitte auswählen</option>
            <option value="männlich">Männlich</option>
            <option value="weiblich">Weiblich</option>
            <option value="divers">Divers</option>
          </select>
        </div>
      </div>
      <h2>Auftrag</h2>
      <div className="formular">
        <div className="formular-gruppe">
          <label htmlFor="auftragsTyp">Auftragstyp:</label>
          <select
            id="auftragsTyp"
            value={auftragsTyp}
            onChange={(e) => setAuftragsTyp(e.target.value)}
          >
            <option value="">Bitte auswählen</option>
            <option value="Webseite">Webseite</option>
            <option value="Diashow">Diashow</option>
          </select>
        </div>
        <div className="formular-gruppe">
          <label htmlFor="auftragsBeschreibung">Auftragsbeschreibung:</label>
          <textarea
            id="auftragsBeschreibung"
            value={auftragsBeschreibung}
            onChange={(e) => setAuftragsBeschreibung(e.target.value)}
          ></textarea>
        </div>
      </div>
      <button onClick={handleKontaktAufnehmen}>Kontakt aufnehmen</button>
    </div>
  );
};

export default KundeErfassen;
