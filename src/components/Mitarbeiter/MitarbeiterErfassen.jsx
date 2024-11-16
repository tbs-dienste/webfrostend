import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaLock, FaBuilding, FaGlobe, FaClipboardList } from 'react-icons/fa';
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
  
    // Wenn "Vollzeit" gewählt wurde, setze teilzeit_prozent auf null
    const formDataToSubmit = {
      ...formData,
      teilzeit_prozent: formData.verfügbarkeit === 'teilzeit' ? formData.teilzeit_prozent : null, // Null setzen, wenn nicht Teilzeit
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter',
        formDataToSubmit,
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
      <h2><FaBuilding /> Mitarbeiter erfassen</h2>
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
          <label htmlFor="vorname"><FaUser /> Vorname:</label>
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
          <label htmlFor="nachname"><FaUser /> Nachname:</label>
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
          <label htmlFor="adresse"><FaMapMarkerAlt /> Adresse:</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
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
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="email"><FaEnvelope /> E-Mail:</label>
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
          <label htmlFor="mobil"><FaPhone /> Mobil:</label>
          <input
            type="tel"
            id="mobil"
            name="mobil"
            value={formData.mobil}
            onChange={handleChange}
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="benutzername"><FaUser /> Benutzername:</label>
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
          <label htmlFor="passwort"><FaLock /> Passwort:</label>
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
          <label htmlFor="iban">IBAN:</label>
          <input
            type="text"
            id="iban"
            name="iban"
            value={formData.iban}
            onChange={handleChange}
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="land"><FaGlobe /> Land:</label>
          <input
            type="text"
            id="land"
            name="land"
            value={formData.land}
            onChange={handleChange}
          />
        </div>

        <div className="formular-gruppe">
          <label htmlFor="geburtstagdatum"><FaCalendarAlt /> Geburtstag:</label>
          <input
            type="date"
            id="geburtstagdatum"
            name="geburtstagdatum"
            value={formData.geburtstagdatum}
            onChange={handleChange}
          />
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
            />
          </div>
        )}

        <div className="formular-gruppe">
          <label htmlFor="fähigkeiten"><FaClipboardList /> Fähigkeiten:</label>
          <textarea
            id="fähigkeiten"
            name="fähigkeiten"
            value={formData.fähigkeiten}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Mitarbeiter hinzufügen</button>
      </form>
    </div>
  );
};

export default MitarbeiterErfassen;
