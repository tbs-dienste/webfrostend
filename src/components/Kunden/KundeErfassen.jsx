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
  const [budget, setBudget] = useState('');
  const [zweck, setZweck] = useState('');
  const [speicherkapazität, setSpeicherkapazität] = useState('');
  const [ram, setRam] = useState('');
  const [kühlung, setKühlung] = useState('');
  const [gehäuse, setGehäuse] = useState('');
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
      auftragsTyp,
      auftragsBeschreibung: {
        budget,
        zweck,
        speicherkapazität,
        ram,
        kühlung,
        gehäuse,
        auftragsBeschreibung // Auftragsbeschreibung für Diashow/Webseite oder andere Zwecke
      },
      rechnungGestellt: false, // Standardmäßig auf false setzen
      rechnungBezahlt: false
    };


    axios.post('https://backend-1-cix8.onrender.com/api/v1/kunden', newKunde)
      .then(() => {
        console.log('Kontaktdaten erfolgreich gesendet.');
        window.location.href = '/dankesnachricht';
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
        {/* Kontaktdaten Formular */}
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
        {/* Ende Kontaktdaten Formular */}
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
            <option value="Gamingpc">Gaming PC</option>
          </select>
        </div>
        {/* Inputfelder für den Gaming-PC Auftrag */}
        {auftragsTyp === 'Gamingpc' && (
          <>
            <div className="formular-gruppe">
              <label htmlFor="budget">Budget:</label>
              <input
                type="number"
                inputMode="numeric"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}

                onKeyPress={(e) => {
                  // Nur Zahlen zulassen
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="formular-gruppe">
              <label htmlFor="zweck">Zweck:</label>
              <select
                id="zweck"
                value={zweck}
                onChange={(e) => setZweck(e.target.value)}

              >
                <option value="">Bitte auswählen</option>
                <option value="Gaming">Gaming</option>
                <option value="Casual">Casual</option>
                <option value="Work">Work</option>
                <option value="Stream">Stream</option>
                <option value="Diverses">Diverses</option>
              </select>
            </div>
            <div className="formular-gruppe">
              <label htmlFor="speicherkapazität">Speicherkapazität (TB):</label>
              <input
                type="text"
                id="speicherkapazität"
                value={speicherkapazität}
                onChange={(e) => setSpeicherkapazität(e.target.value)}

              />
            </div>
            <div className="formular-gruppe">
              <label htmlFor="ram">RAM (GB):</label>
              <input
                type="text"
                id="ram"
                value={ram}
                onChange={(e) => setRam(e.target.value)}

              />
            </div>
            <div className="formular-gruppe">
              <label htmlFor="kühlung">Kühlung:</label>
              <select
                id="kühlung"
                value={kühlung}
                onChange={(e) => setKühlung(e.target.value)}

              >
                <option value="">Bitte auswählen</option>
                <option value="Luft">Luft</option>
                <option value="Wasser">Wasser</option>
              </select>
            </div>
            <div className="formular-gruppe">
              <label htmlFor="gehäuse">Gehäuse:</label>
              <select
                id="gehäuse"
                value={gehäuse}
                onChange={(e) => setGehäuse(e.target.value)}

              >
                <option value="">Bitte auswählen</option>
                <option value="RGB">RGB</option>
                <option value="Geschlossen">Geschlossen</option>
              </select>
            </div>
          </>
        )}
        {/* Inputfelder für Diashow/Webseite Auftrag */}
        {(auftragsTyp === 'Diashow' || auftragsTyp === 'Webseite') && (
          <div className="formular-gruppe">
            <label htmlFor="auftragsBeschreibung">Auftragsbeschreibung:</label>
            <textarea
              id="auftragsBeschreibung"
              value={auftragsBeschreibung}
              onChange={(e) => setAuftragsBeschreibung(e.target.value)}

            ></textarea>
          </div>
        )}
        {/* End Inputfelder für Diashow/Webseite Auftrag */}
      </div>
      <button onClick={handleKontaktAufnehmen} >Kontakt aufnehmen</button>

    </div>
  );
};

export default KundeErfassen;
