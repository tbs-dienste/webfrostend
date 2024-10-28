import React, { useState } from 'react';
import axios from 'axios';
import './MitarbeiterErfassen.scss';

const MitarbeiterErfassen = () => {
  const [formData, setFormData] = useState({
    geschlecht: '',
    vorname: '',
    nachname: '',
    adresse: '',
    postleitzahl: '',
    ort: '',
    email: '',
    mobil: '',
    benutzername: '',
    passwort: '',
    geburtstagdatum: '',
    iban: '',
    land: 'DE',
    verfügbarkeit: '',
    teilzeit_prozent: '',
    fähigkeiten: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Mitarbeiter erfolgreich hinzugefügt:', response.data);
      alert('Mitarbeiter erfolgreich hinzugefügt');
      window.location = "/mitarbeiter";
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Mitarbeiters:', error);
      alert('Fehler beim Hinzufügen des Mitarbeiters. Bitte überprüfe die Daten.');
    }
  };

  return (
    <div className="mitarbeiter-erfassen">
      <h2>Mitarbeiter erfassen</h2>
      <form className="formular" onSubmit={handleSubmit}>
        <div className="formular-gruppe">
          <label htmlFor="geschlecht">Geschlecht:</label>
          <select
            id="geschlecht"
            name="geschlecht"
            value={formData.geschlecht}
            onChange={handleChange}
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
            name="vorname"
            value={formData.vorname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="nachname">Nachname:</label>
          <input
            type="text"
            id="nachname"
            name="nachname"
            value={formData.nachname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="adresse">Adresse:</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="postleitzahl">Postleitzahl:</label>
          <input
            type="text"
            id="postleitzahl"
            name="postleitzahl"
            value={formData.postleitzahl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="ort">Ort:</label>
          <input
            type="text"
            id="ort"
            name="ort"
            value={formData.ort}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="email">E-Mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="mobil">Mobil:</label>
          <input
            type="text"
            id="mobil"
            name="mobil"
            value={formData.mobil}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="benutzername">Benutzername:</label>
          <input
            type="text"
            id="benutzername"
            name="benutzername"
            value={formData.benutzername}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="passwort">Passwort:</label>
          <input
            type="password"
            id="passwort"
            name="passwort"
            value={formData.passwort}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="geburtstagdatum">Geburtsdatum:</label>
          <input
            type="date"
            id="geburtstagdatum"
            name="geburtstagdatum"
            value={formData.geburtstagdatum}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="iban">IBAN:</label>
          <input
            type="text"
            id="iban"
            name="iban"
            value={formData.iban}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="land">Land:</label>
          <select
            id="land"
            name="land"
            value={formData.land}
            onChange={handleChange}
          >
            <option value="DE">Deutschland</option>
            <option value="CH">Schweiz</option>
            {/* Weitere Länderoptionen */}
          </select>
        </div>

        <div className="formular-gruppe">
          <label htmlFor="verfügbarkeit">Verfügbarkeit:</label>
          <select
            id="verfügbarkeit"
            name="verfügbarkeit"
            value={formData.verfügbarkeit}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Bitte wählen...</option>
            <option value="flexibel">Flexibel</option>
            <option value="vollzeit">Vollzeit</option>
            <option value="teilzeit">Teilzeit</option>
          </select>
        </div>

        {formData.verfügbarkeit === 'teilzeit' && (
          <div className="formular-gruppe">
            <label htmlFor="teilzeit_prozent">Teilzeit-Prozent:</label>
            <input
              type="number"
              id="teilzeit_prozent"
              name="teilzeit_prozent"
              value={formData.teilzeit_prozent}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>
        )}

        <div className="formular-gruppe">
          <label htmlFor="fähigkeiten">Fähigkeiten:</label>
          <textarea
            id="fähigkeiten"
            name="fähigkeiten"
            value={formData.fähigkeiten}
            onChange={handleChange}
            placeholder="Fähigkeiten eingeben..."
          />
        </div>

        <button type="submit">Mitarbeiter hinzufügen</button>
      </form>
    </div>
  );
};

export default MitarbeiterErfassen;
