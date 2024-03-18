import React, { useState, useEffect } from 'react';
import './KundeErfassen.scss';

const KundeErfassen = () => {
  const [kunden, setKunden] = useState([]);
  const [vorname, setVorname] = useState('');
  const [zweiterVorname, setZweiterVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [strasseHausnummer, setStrasseHausnummer] = useState('');
  const [adresszeile2, setAdresszeile2] = useState('');
  const [stadt, setStadt] = useState('');
  const [kanton, setKanton] = useState('');
  const [postleitzahl, setPostleitzahl] = useState('');
  const [ort, setOrt] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [mobil, setMobil] = useState('');

  useEffect(() => {
    const storedKunden = localStorage.getItem('kunden');
    if (storedKunden) {
      setKunden(JSON.parse(storedKunden));
    }
  }, []);

  const handleKundeHinzufügen = () => {
    const newKunde = {
      id: kunden.length + 1,
      vorname,
      zweiterVorname,
      nachname,
      strasseHausnummer,
      adresszeile2,
      stadt,
      kanton,
      postleitzahl,
      ort,
      email,
      telefon,
      mobil,
      arbeitszeiten: []
    };

    setKunden([...kunden, newKunde]);
    localStorage.setItem('kunden', JSON.stringify([...kunden, newKunde]));

    // Zurücksetzen der Felder
    setVorname('');
    setZweiterVorname('');
    setNachname('');
    setStrasseHausnummer('');
    setAdresszeile2('');
    setStadt('');
    setKanton('');
    setPostleitzahl('');
    setOrt('');
    setEmail('');
    setTelefon('');
    setMobil('');

    window.location.href = '/dankesnachricht';
  };

  return (
    <div className="kunde-erfassen">
      <h2>Kontakt</h2>
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
          <label htmlFor="zweiterVorname">Zweiter Vorname:</label>
          <input
            type="text"
            id="zweiterVorname"
            value={zweiterVorname}
            onChange={(e) => setZweiterVorname(e.target.value)}
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
          <label htmlFor="adresszeile2">2. Adresszeile:</label>
          <input
            type="text"
            id="adresszeile2"
            value={adresszeile2}
            onChange={(e) => setAdresszeile2(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="stadt">Stadt:</label>
          <input
            type="text"
            id="stadt"
            value={stadt}
            onChange={(e) => setStadt(e.target.value)}
          />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="kanton">Kanton:</label>
          <input
            type="text"
            id="kanton"
            value={kanton}
            onChange={(e) => setKanton(e.target.value)}
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
        <button onClick={handleKundeHinzufügen}>Kontakt aufnehmen</button>
      </div>
     
    </div>
  );
};

export default KundeErfassen;
