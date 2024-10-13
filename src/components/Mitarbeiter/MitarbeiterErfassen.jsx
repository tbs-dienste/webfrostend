import React, { useState } from 'react';
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
  const [iban, setIban] = useState('');

  const handleIbanChange = (e) => {
    let input = e.target.value.toUpperCase();
    input = input.replace(/\D/g, ''); // Nur Zahlen beibehalten

    let formattedIban = land;
    for (let i = 0; i < input.length; i++) {
      if (i === 2 || i === 6 || i === 10 || i === 14 || i === 18) {
        formattedIban += ' ';
      }
      formattedIban += input[i];
    }

    if (formattedIban.length > 26) {
      formattedIban = formattedIban.substring(0, 26); // Maximal 26 Zeichen
    }

    setIban(formattedIban);
  };

  const handleLandChange = (e) => {
    const selectedLand = e.target.value;
    setLand(selectedLand);
    setIban(selectedLand); // IBAN initialisieren
  };

  const handleMitarbeiterHinzufügen = async (e) => {
    e.preventDefault(); // Verhindert das Standard-Formularverhalten

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
      iban // Hier wird die IBAN übergeben
    };

    try {
      const token = localStorage.getItem('token'); // Token aus localStorage holen
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter', newMitarbeiter, {
        headers: {
          Authorization: `Bearer ${token}` // Token im Header hinzufügen
        }
      });
      console.log('Response:', response.data);
      window.location = "/mitarbeiter"; // Weiterleitung nach dem erfolgreichen Hinzufügen
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Mitarbeiters:', error);
      alert('Fehler beim Hinzufügen des Mitarbeiters. Bitte versuche es später noch einmal.'); // Fehlerbenachrichtigung
    }
  };

  return (
    <div className="kunde-erfassen">
      <h2>Mitarbeiter erfassen</h2>
      <form className="formular" onSubmit={handleMitarbeiterHinzufügen}>
        <div className="formular-gruppe">
          <label htmlFor="geschlecht">Geschlecht:</label>
          <select
            id="geschlecht"
            value={geschlecht}
            onChange={(e) => setGeschlecht(e.target.value)}
            required
          >
            <option value="" disabled>Bitte wählen...</option>
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
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="nachname">Nachname:</label>
          <input
            type="text"
            id="nachname"
            value={nachname}
            onChange={(e) => setNachname(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="adresse">Strasse und Hausnummer:</label>
          <input
            type="text"
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="postleitzahl">Postleitzahl:</label>
          <input
            type="text"
            id="postleitzahl"
            value={postleitzahl}
            onChange={(e) => setPostleitzahl(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="ort">Ort:</label>
          <input
            type="text"
            id="ort"
            value={ort}
            onChange={(e) => setOrt(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="email">E-Mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="mobil">Mobil:</label>
          <input
            type="text"
            id="mobil"
            value={mobil}
            onChange={(e) => setMobil(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="benutzername">Benutzername:</label>
          <input
            type="text"
            id="benutzername"
            value={benutzername}
            onChange={(e) => setBenutzername(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="passwort">Passwort:</label>
          <input
            type="password"
            id="passwort"
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="iban">IBAN:</label>
          <input
            type="text"
            id="iban"
            value={iban}
            onChange={handleIbanChange}
            required
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
            {/* Fügen Sie weitere Länder hier hinzu */}
          </select>
        </div>

        <button type="submit">Mitarbeiter hinzufügen</button>
      </form>
    </div>
  );
};

export default MitarbeiterErfassen;
