import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MitarbeiterErfassen.scss';

const MitarbeiterErfassen = () => {
  const [geschlecht, setGeschlecht] = useState('');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [adresse, setAdresse] = useState('');
  const [postleitzahl, setPostleitzahl] = useState('');
  const [ort, setOrt] = useState('');
  const [email, setEmail] = useState('');
  const [mobil, setMobil] = useState('');
  const [benutzername, setBenutzername] = useState('');
  const [passwort, setPasswort] = useState('');
  const [land, setLand] = useState('CH');
  const [iban, setIban] = useState('CH');

  const handleIbanChange = (e) => {
    let input = e.target.value.toUpperCase();
    input = input.replace(/\D/g, '');

    let formattedIban = land;
    for (let i = 0; i < input.length; i++) {
      if (i === 2 || i === 6 || i === 10 || i === 14 || i === 18) {
        formattedIban += ' ';
      }
      formattedIban += input[i];
    }

    if (formattedIban.length >= 26) {
      formattedIban = formattedIban.substring(0, 26);
    }

    setIban(formattedIban);
  };

  const handleLandChange = (e) => {
    const selectedLand = e.target.value;
    setLand(selectedLand);
    setIban(selectedLand);
  };

  const handleMitarbeiterHinzufügen = async () => {
    const newMitarbeiter = {
      geschlecht,
      vorname,
      nachname,
      adresse,
      postleitzahl,
      ort,
      email,
      mobil,
      benutzername,
      passwort,
      iban: land
    };

    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter', newMitarbeiter);
      console.log('Response:', response.data);
      window.location = "/mitarbeiter";
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Mitarbeiters:', error);
    }
  };

  return (
    <div className="kunde-erfassen">
      <h2>Kontakt</h2>
      <div className="formular">
        <div className="formular-gruppe">
          <label htmlFor="geschlecht">Geschlecht:</label>
          <select
            id="geschlecht"
            value={geschlecht}
            onChange={(e) => setGeschlecht(e.target.value)}
          >
            <option value="männlich">Männlich</option>
            <option value="weiblich">Weiblich</option>
          </select>
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
          <label htmlFor="adresse">Strasse und Hausnummer:</label>
          <input
            type="text"
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
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
          <label htmlFor="mobil">Mobil:</label>
          <input
            type="tel"
            id="mobil"
            value={mobil}
            onChange={(e) => setMobil(e.target.value)}
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="benutzername">Benutzername:</label>
          <input
            type="text"
            id="benutzername"
            value={benutzername}
            onChange={(e) => setBenutzername(e.target.value)}
            />
          </div>
  
          <div className="formular-gruppe">
            <label htmlFor="passwort">Passwort:</label>
            <input
              type="password"
              id="passwort"
              value={passwort}
              onChange={(e) => setPasswort(e.target.value)}
            />
          </div>
  
          <div className="formular-gruppe">
            <label htmlFor="land">Land:</label>
            <select
              id="land"
              value={land}
              onChange={handleLandChange}
            >
              <option value="CH">Schweiz</option>
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="UK">England</option>
            </select>
          </div>
  
          <div className="formular-gruppe">
            <label htmlFor="iban">Iban:</label>
            <input
              type="text"
              id="iban"
              value={iban}
              onChange={handleIbanChange}
            />
          </div>
  
          <button onClick={handleMitarbeiterHinzufügen}>Kontakt aufnehmen</button>
        </div>
      </div>
    );
  };
  
  export default MitarbeiterErfassen;

  