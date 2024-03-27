import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
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
  const [geschlecht, setGeschlecht] = useState('');
  const [kundennummer, setKundennummer] = useState('');
  const [selectedOption, setSelectedOption] = useState('kunde');
  const [auftragsTyp, setAuftragsTyp] = useState('');
  const [auftragsBeschreibung, setAuftragsBeschreibung] = useState('');

  useEffect(() => {
    const storedKunden = localStorage.getItem('kunden');
    if (storedKunden) {
      setKunden(JSON.parse(storedKunden));
    }
  }, []);

  const handleKundeHinzufügen = () => {
    const newKundennummer = generateRandomKundennummer();
    const newKunde = {
      id: newKundennummer, // Die Kundennummer wird auch als ID verwendet
      kundennummer: newKundennummer,
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
      geschlecht,
      aufträge: selectedOption === 'auftrag' ? [{ typ: auftragsTyp, beschreibung: auftragsBeschreibung, auftragsnummer: generateRandomAuftragsnummer() }] : [],
    };

    setKunden([...kunden, newKunde]);
    localStorage.setItem('kunden', JSON.stringify([...kunden, newKunde]));

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
    setGeschlecht('');
    setKundennummer(newKundennummer);
    setAuftragsTyp('');
    setAuftragsBeschreibung('');

    window.location.href = '/dankesnachricht';
  };

  const generateRandomKundennummer = () => {
    return Math.floor(Math.random() * 1000000) + 1;
  };

  const generateRandomAuftragsnummer = () => {
    return 'AUF' + Math.floor(Math.random() * 1000000) + 1;
  };

  useEffect(() => {
    if (kundennummer) {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, kundennummer);
      const dataURL = canvas.toDataURL('image/png');
      localStorage.setItem(`kunden_${kundennummer}_barcode`, dataURL);
    }
  }, [kundennummer]);

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
          <label htmlFor="auftragsOptionen">Auftrag erfassen?</label>
          <select
            id="auftragsOptionen"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="kunde">Nein</option>
            <option value="auftrag">Ja</option>
          </select>
        </div>
        {selectedOption === 'auftrag' && (
          <>
            <div className="formular-gruppe">
              <label htmlFor="auftragsTyp">Auftragstyp:</label>
              <select
                id="auftragsTyp"
                value={auftragsTyp}
                onChange={(e) => setAuftragsTyp(e.target.value)}
              >
                
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
          </>
        )}
        <button onClick={handleKundeHinzufügen}>Kontakt aufnehmen</button>
      </div>
    </div>
  );
};

export default KundeErfassen;

