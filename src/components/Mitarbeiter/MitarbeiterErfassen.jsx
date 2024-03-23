import React, { useState, useEffect } from 'react';
import './MitarbeiterErfassen.scss';

function MitarbeiterErfassen() {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [iban, setIban] = useState('');
  const [adresse, setAdresse] = useState('');
  const [benutzername, setBenutzername] = useState('');
  const [passwort, setPasswort] = useState('');
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]);

  useEffect(() => {
    const storedMitarbeiter = localStorage.getItem('mitarbeiter');
    if (storedMitarbeiter) {
      setMitarbeiterListe(JSON.parse(storedMitarbeiter));
    }
  }, []);

  const handleVornameChange = (event) => {
    setVorname(event.target.value);
  };

  const handleNachnameChange = (event) => {
    setNachname(event.target.value);
  };

  const handleIbanChange = (event) => {
    setIban(event.target.value);
  };

  const handleAdresseChange = (event) => {
    setAdresse(event.target.value);
  };

  const handleBenutzernameChange = (event) => {
    setBenutzername(event.target.value);
  };

  const handlePasswortChange = (event) => {
    setPasswort(event.target.value);
  };

  const handleMitarbeiterErfassen = () => {
    const neuerMitarbeiter = {
      vorname: vorname,
      nachname: nachname,
      iban: iban,
      adresse: adresse,
      benutzername: benutzername,
      passwort: passwort,
      online: true, // Neuer Mitarbeiter ist standardmäßig online
      
    };
  
    const neueMitarbeiterListe = [...mitarbeiterListe, neuerMitarbeiter];
    setMitarbeiterListe(neueMitarbeiterListe);
    localStorage.setItem('mitarbeiter', JSON.stringify(neueMitarbeiterListe));
  
    // Setze die Eingabefelder zurück
    setVorname('');
    setNachname('');
    setIban('');
    setAdresse('');
    setBenutzername('');
    setPasswort('');
  };
  

  return (
    <div className="mitarbeiter-erfassen">
      <h1>Mitarbeiter erfassen</h1>
      <div>
        <label>Vorname:</label>
        <input type="text" value={vorname} onChange={handleVornameChange} />
      </div>
      <div>
        <label>Nachname:</label>
        <input type="text" value={nachname} onChange={handleNachnameChange} />
      </div>
      <div>
        <label>IBAN:</label>
        <input type="text" value={iban} onChange={handleIbanChange} />
      </div>
      <div>
        <label>Adresse:</label>
        <input type="text" value={adresse} onChange={handleAdresseChange} />
      </div>
      <div>
        <label>Benutzername:</label>
        <input type="text" value={benutzername} onChange={handleBenutzernameChange} />
      </div>
      <div>
        <label>Passwort:</label>
        <input type="password" value={passwort} onChange={handlePasswortChange} />
      </div>
      <button onClick={handleMitarbeiterErfassen}>Mitarbeiter erfassen</button>
      <div>
        <h2>Mitarbeiterliste</h2>
        <ul>
          {mitarbeiterListe.map((mitarbeiter, index) => (
            <li key={index}>
              Vorname: {mitarbeiter.vorname}, Nachname: {mitarbeiter.nachname}, IBAN: {mitarbeiter.iban}, Adresse: {mitarbeiter.adresse}, Benutzername: {mitarbeiter.benutzername}, Passwort: {mitarbeiter.passwort}, 
              {mitarbeiter.online ? ' Online' : ' Offline'}, 
             
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MitarbeiterErfassen;
