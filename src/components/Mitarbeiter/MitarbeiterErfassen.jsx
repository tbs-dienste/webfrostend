import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import axios from 'axios'; // Importieren Sie Axios
import './MitarbeiterErfassen.scss';

const MitarbeiterErfassen = () => {
  const [mitarbeiter, setMitarbeiter] = useState([]);
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
  const [mitarbeiternummer, setMitarbeiternummer] = useState('');
  const [land, setLand] = useState('CH');
  const [iban, setIban] = useState('CH');

  useEffect(() => {
    const storedMitarbeiter = localStorage.getItem('mitarbeiter');
    if (storedMitarbeiter) {
      setMitarbeiter(JSON.parse(storedMitarbeiter));
    }
  }, []);

  const handleIbanChange = (e) => {
    let input = e.target.value.toUpperCase(); // Convert input to uppercase
    input = input.replace(/\D/g, ''); // Allow only digits

    // Format the IBAN according to the pattern "CHXX XXXX XXXX XXXX XXXX X"
    let formattedIban = land;
    for (let i = 0; i < input.length; i++) {
      if (i === 2 || i === 6 || i === 10 || i === 14 || i === 18) {
        formattedIban += ' '; // Add space after the first two and then after every subsequent block of four digits
      }
      formattedIban += input[i];
    }

    // Check if the IBAN length meets the conditions
    if (formattedIban.length >= 26) {
      formattedIban = formattedIban.substring(0, 26); // Trim the IBAN to 26 characters to disallow further input
    }

    setIban(formattedIban);
  };

  const handleLandChange = (e) => {
    const selectedLand = e.target.value;
    setLand(selectedLand);
    // Update IBAN placeholder based on selected country
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
      iban: land, // oder `iban`, je nachdem, wie Sie Ihre Daten modelliert haben
    };
  
    try {
      const response = await axios.post('https://backend-1-cix8.onrender.com/api/v1/mitarbeiter', newMitarbeiter);
      console.log('Response:', response.data);
      window.location = "/mitarbeiter";
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Mitarbeiters:', error);
      // Hier können Sie Fehlerbehandlung hinzufügen, z.B. eine Benachrichtigung für den Benutzer anzeigen
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
            <option value="divers">Divers</option>
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
