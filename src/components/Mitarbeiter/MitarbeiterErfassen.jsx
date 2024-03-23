import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import './MitarbeiterErfassen.scss';

const MitarbeiterErfassen = () => {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [geschlecht, setGeschlecht] = useState('');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [strasseHausnummer, setStrasseHausnummer] = useState('');
  const [postleitzahl, setPostleitzahl] = useState('');
  const [ort, setOrt] = useState('');
  const [email, setEmail] = useState('');
  const [mobil, setMobil] = useState('');
  const [benutzername, setBenutzername] = useState('');
  const [passwort, setPasswort] = useState('');
  const [iban, setIban] = useState('');
  const [mitarbeiternummer, setMitarbeiternummer] = useState('');

  useEffect(() => {
    const storedMitarbeiter = localStorage.getItem('mitarbeiter');
    if (storedMitarbeiter) {
      setMitarbeiter(JSON.parse(storedMitarbeiter));
    }
  }, []);

  const handleMitarbeiterHinzufügen = () => {
    const newMitarbeiternummer = generateRandomMitarbeiternummer();

    const newMitarbeiter = {
      id: mitarbeiter.length + 1,
      mitarbeiternummer: newMitarbeiternummer,
      geschlecht,
      vorname,
      nachname,
      strasseHausnummer,
      postleitzahl,
      ort,
      email,
      mobil,
      benutzername,
      passwort,
      iban,
      auftrag: [],
    };

    setMitarbeiter([...mitarbeiter, newMitarbeiter]);
    localStorage.setItem('mitarbeiter', JSON.stringify([...mitarbeiter, newMitarbeiter]));

    setGeschlecht('');
    setVorname('');
    setNachname('');
    setStrasseHausnummer('');
    setPostleitzahl('');
    setOrt('');
    setEmail('');
    setMobil('');
    setBenutzername('');
    setPasswort('');
    setIban('');
    setMitarbeiternummer(newMitarbeiternummer);

    window.location.href = '/mitarbeiter';
  };

  const generateRandomMitarbeiternummer = () => {
    return Math.floor(Math.random() * 1000000) + 1;
  };

  useEffect(() => {
    // Wenn die Kundennummer geändert wird, speichern Sie den Strichcode im Local Storage
    if (mitarbeiternummer) {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, mitarbeiternummer);
      const dataURL = canvas.toDataURL('image/png');
      localStorage.setItem(`mitarbeiter_${mitarbeiternummer}_barcode`, dataURL);
    }
  }, [mitarbeiternummer]);


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
          <label htmlFor="iban">Iban:</label>
          <input
            type="text"
            id="iban"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
          />
        </div>
        <button onClick={handleMitarbeiterHinzufügen}>Kontakt aufnehmen</button>
      </div>
    </div>
  );
};

export default MitarbeiterErfassen;

