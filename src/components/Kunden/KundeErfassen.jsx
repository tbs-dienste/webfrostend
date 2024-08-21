import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KundeErfassen.scss';

const KundeErfassen = () => {
  // State-Variablen für das Formular
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
  const [firma, setFirma] = useState('');
  const [land, setLand] = useState('');

  // State-Variable für die Auftragsarten-Optionen
  const [auftragsTypOptions, setAuftragsTypOptions] = useState([]);

  // Hole die Auftragsarten-Optionen beim ersten Rendern
  useEffect(() => {
    const fetchAuftragsTypOptions = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
        if (Array.isArray(response.data.data)) {
          setAuftragsTypOptions(response.data.data);
        } else {
          console.error('Fehlerhafte Datenstruktur:', response.data);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der AuftragsTyp-Optionen:', error);
      }
    };

    fetchAuftragsTypOptions();
  }, []);

  // Formular senden
  const handleKontaktAufnehmen = async () => {
    if (!vorname || !nachname || !email || !telefon || !mobil || !auftragsTyp) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    // Geschlecht in die entsprechenden Werte umwandeln
    const geschlechtWert = geschlecht === 'männlich' ? 'm' : geschlecht === 'weiblich' ? 'w' : '';

    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip_adresse = ipResponse.data.ip;

      const newKunde = {
        land,
        firma,
        vorname,
        nachname,
        strasseHausnummer,
        postleitzahl,
        ort,
        email,
        telefon,
        mobil,
        geschlecht: geschlechtWert,
        auftragsTyp,
        auftragsBeschreibung,
        ip_adresse
      };

      // Sende die Daten an die API
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', newKunde);

      console.log('Kontaktdaten erfolgreich gesendet:', response.data);
      window.location.href = '/dankesnachricht';
    } catch (error) {
      console.error('Fehler beim Senden der Kontaktdaten:', error);
      alert('Fehler beim Aufnehmen der Kontaktdaten. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="kunde-erfassen">
      <h2>Kontaktdaten</h2>
      <div className="formular">
        <div className="formular-gruppe">
          <label htmlFor="geschlecht">Geschlecht:</label>
          <select
            id="geschlecht"
            value={geschlecht}
            onChange={(e) => setGeschlecht(e.target.value)}
            className="dropdown"
          >
            <option value="">Bitte auswählen</option>
            <option value="männlich">Männlich</option>
            <option value="weiblich">Weiblich</option>
          </select>
        </div>
        <div className="formular-gruppe">
          <label htmlFor="firma">Firma:</label>
          <input
            type="text"
            id="firma"
            value={firma}
            onChange={(e) => setFirma(e.target.value)}
          />
        </div>
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
          <label htmlFor="land">Land:</label>
          <select
            id="land"
            value={land}
            onChange={(e) => setLand(e.target.value)}
            className="dropdown"
          >
            <option value="">Bitte auswählen</option>
            <option value="Deutschland">Deutschland</option>
            <option value="Schweiz">Schweiz</option>
            <option value="Österreich">Österreich</option>
            <option value="Frankreich">Frankreich</option>
            <option value="Italien">Italien</option>
            <option value="England">England</option>
          </select>
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
          <label htmlFor="auftragsTyp">Auftragsart:</label>
          <select
            id="auftragsTyp"
            value={auftragsTyp}
            onChange={(e) => setAuftragsTyp(e.target.value)}
            className="dropdown"
          >
            <option value="">Bitte auswählen</option>
            {auftragsTypOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
        <div className="formular-gruppe">
          <label htmlFor="auftragsBeschreibung">Auftragsbeschreibung:</label>
          <textarea
            id="auftragsBeschreibung"
            value={auftragsBeschreibung}
            onChange={(e) => setAuftragsBeschreibung(e.target.value)}
          />
        </div>
        <button onClick={handleKontaktAufnehmen} className="submit-button">Kontakt aufnehmen</button>
      </div>
    </div>
  );
};

export default KundeErfassen;
