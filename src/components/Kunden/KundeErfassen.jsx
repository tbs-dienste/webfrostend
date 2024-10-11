import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KundeErfassen.scss';
import agb from '../Documents/AGB.pdf';

const KundeErfassen = () => {
  // State-Variablen für das Formular
  const [firma, setFirma] = useState('');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [strasseHausnummer, setStrasseHausnummer] = useState('');
  const [postleitzahl, setPostleitzahl] = useState('');
  const [ort, setOrt] = useState('');
  const [land, setLand] = useState('');
  const [email, setEmail] = useState('');
  const [mobil, setMobil] = useState('');
  const [geschlecht, setGeschlecht] = useState('');
  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [ausgewaehlteDienstleistungen, setAusgewaehlteDienstleistungen] = useState([]);
  const [datenschutzAkzeptiert, setDatenschutzAkzeptiert] = useState(false);

  useEffect(() => {
    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
        if (Array.isArray(response.data.data)) {
          setDienstleistungen(response.data.data);
        } else {
          console.error('Fehlerhafte Datenstruktur:', response.data);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Dienstleistungen:', error);
      }
    };

    fetchDienstleistungen();
  }, []);

  const handleAddDienstleistung = () => {
    setAusgewaehlteDienstleistungen([...ausgewaehlteDienstleistungen, '']);
  };

  const handleDienstleistungChange = (index, value) => {
    const newDienstleistungen = [...ausgewaehlteDienstleistungen];
    newDienstleistungen[index] = value;
    setAusgewaehlteDienstleistungen(newDienstleistungen);
  };

  const handleKundeErfassen = async () => {
    if (!firma || !vorname || !nachname || !email || !mobil || ausgewaehlteDienstleistungen.length === 0) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip_adresse = ipResponse.data.ip;

      const newKunde = {
        firma,
        vorname,
        nachname,
        strasseHausnummer,
        postleitzahl,
        ort,
        land,
        email,
        mobil,
        geschlecht,
        ip_adresse,
        dienstleistungen: ausgewaehlteDienstleistungen.map(dienstleistungsId => ({
          dienstleistungsId: parseInt(dienstleistungsId),
        })),
      };

      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', newKunde);
      console.log('Kundendaten erfolgreich gesendet:', response.data);
      alert('Kunde erfolgreich erfasst!');
    } catch (error) {
      console.error('Fehler beim Senden der Kundendaten:', error);
      alert('Fehler beim Erfassen der Kundendaten. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="kunde-erfassen">
      <h2>Kundendaten erfassen</h2>
      <div className="formular">
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
          <input
            type="text"
            id="land"
            value={land}
            onChange={(e) => setLand(e.target.value)}
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
            <option value="M">Männlich</option>
            <option value="W">Weiblich</option>
          </select>
        </div>

        {/* Bereich für die Auswahl der Dienstleistungen */}
        <div className="dienstleistungen-bereich">
          <label>Dienstleistungen:</label>
          {ausgewaehlteDienstleistungen.map((dienstleistung, index) => (
            <div key={index} className="dienstleistung-gruppe">
              <select
                value={dienstleistung}
                onChange={(e) => handleDienstleistungChange(index, e.target.value)}
              >
                <option value="">Bitte auswählen</option>
                {dienstleistungen.map((dienst) => (
                  <option key={dienst.id} value={dienst.id}>
                    {dienst.title}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={handleAddDienstleistung} className="add-dienstleistung-button">
            + Weitere Dienstleistung hinzufügen
          </button>
        </div>

        <div className="formular-gruppe checkbox-gruppe">
          <input
            type="checkbox"
            id="datenschutz"
            checked={datenschutzAkzeptiert}
            onChange={(e) => setDatenschutzAkzeptiert(e.target.checked)}
          />
          <label htmlFor="datenschutz">
            Ich akzeptiere die <a href={agb} target="_blank" rel="noopener noreferrer">AGB</a>
          </label>
        </div>
        <button onClick={handleKundeErfassen} className="submit-button">Kunde erfassen</button>
      </div>
    </div>
  );
};

export default KundeErfassen;
