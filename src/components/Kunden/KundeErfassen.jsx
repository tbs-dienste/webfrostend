import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KundeErfassen.scss';
import agb from '../Documents/AGB.pdf';

const KundeErfassen = () => {
  const [kunde, setKunde] = useState({
    firma: '',
    vorname: '',
    nachname: '',
    strasseHausnummer: '',
    postleitzahl: '',
    ort: '',
    land: '',
    email: '',
    mobil: '',
    geschlecht: '',
    art: '' // Hinzugefügt für 'privat' oder 'geschäft'
  });

  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [ausgewaehlteDienstleistungen, setAusgewaehlteDienstleistungen] = useState(['']); // Start with one empty dienstleistung
  const [beschreibungen, setBeschreibungen] = useState(['']); // Start with one empty description
  const [datenschutzAkzeptiert, setDatenschutzAkzeptiert] = useState(false);

  useEffect(() => {
    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
        setDienstleistungen(response.data.data || []);
      } catch (error) {
        console.error('Fehler beim Abrufen der Dienstleistungen:', error);
      }
    };
    fetchDienstleistungen();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKunde((prevKunde) => ({ ...prevKunde, [name]: value }));
  };

  const handleDienstleistungChange = (index, value) => {
    const newDienstleistungen = [...ausgewaehlteDienstleistungen];
    newDienstleistungen[index] = value;
    setAusgewaehlteDienstleistungen(newDienstleistungen);

    // Update the description for the selected service
    const newBeschreibungen = [...beschreibungen];
    newBeschreibungen[index] = ''; // Reset description when service changes
    setBeschreibungen(newBeschreibungen);
  };

  const handleBeschreibungChange = (index, value) => {
    const newBeschreibungen = [...beschreibungen];
    newBeschreibungen[index] = value;
    setBeschreibungen(newBeschreibungen);
  };

  const handleAddDienstleistung = () => {
    setAusgewaehlteDienstleistungen([...ausgewaehlteDienstleistungen, '']); // Add a new empty dienstleistung
    setBeschreibungen([...beschreibungen, '']); // Add a new empty description
  };

  const handleKundeErfassen = async () => {
    if (!kunde.vorname || !kunde.nachname || !kunde.email || !kunde.mobil || ausgewaehlteDienstleistungen.length === 0 || !ausgewaehlteDienstleistungen[0]) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip_adresse = ipResponse.data.ip;

      const newKunde = {
        ...kunde,
        ip_adresse,
        dienstleistungen: ausgewaehlteDienstleistungen
          .filter((dienstleistungsId, index) => dienstleistungsId && beschreibungen[index]) // Ensure no empty values are sent
          .map((dienstleistungsId, index) => ({
            dienstleistungsId: parseInt(dienstleistungsId),
            beschreibung: beschreibungen[index],
          })),
      };

      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', newKunde);
      window.location.href = "/dankesnachricht";
    } catch (error) {
      console.error('Fehler beim Senden der Kundendaten:', error);
      alert('Fehler beim Erfassen der Kundendaten. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="kunde-erfassen">
      <h2>Kundendaten erfassen</h2>
      <div className="formular">
        {/* Formularfelder für die Kundendaten */}
        {/* Radio buttons für Privat- oder Geschäftskunde */}
        <div className="formular-gruppe">
          <label>Art des Kunden</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="art"
                value="privat"
                checked={kunde.art === 'privat'}
                onChange={handleInputChange}
              />
              Privatkunde
            </label>
            <label>
              <input
                type="radio"
                name="art"
                value="geschäft"
                checked={kunde.art === 'geschäft'}
                onChange={handleInputChange}
              />
              Geschäftskunde
            </label>
          </div>
        </div>
        {kunde.art === 'geschäft' && (
          <div className="formular-gruppe">
            <label htmlFor="firma">Firma</label>
            <input type="text" id="firma" name="firma" value={kunde.firma} onChange={handleInputChange} />
          </div>
        )}

        <div className="formular-gruppe">
          <label>Geschlecht</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="geschlecht"
                value="männlich"
                checked={kunde.geschlecht === 'männlich'}
                onChange={handleInputChange}
              />
              Männlich
            </label>
            <label>
              <input
                type="radio"
                name="geschlecht"
                value="weiblich"
                checked={kunde.geschlecht === 'weiblich'}
                onChange={handleInputChange}
              />
              Weiblich
            </label>
            <label>
              <input
                type="radio"
                name="geschlecht"
                value="divers"
                checked={kunde.geschlecht === 'divers'}
                onChange={handleInputChange}
              />
              Divers
            </label>
          </div>
        </div>

        <div className="formular-gruppe">
          <label htmlFor="vorname">Vorname</label>
          <input type="text" id="vorname" name="vorname" value={kunde.vorname} onChange={handleInputChange} />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="nachname">Nachname</label>
          <input type="text" id="nachname" name="nachname" value={kunde.nachname} onChange={handleInputChange} />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="strasseHausnummer">Strasse und Hausnummer</label>
          <input type="text" id="strasseHausnummer" name="strasseHausnummer" value={kunde.strasseHausnummer} onChange={handleInputChange} />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="postleitzahl">Postleitzahl</label>
          <input type="text" id="postleitzahl" name="postleitzahl" value={kunde.postleitzahl} onChange={handleInputChange} />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="ort">Ort</label>
          <input type="text" id="ort" name="ort" value={kunde.ort} onChange={handleInputChange} />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="land">Land</label>
          <input type="text" id="land" name="land" value={kunde.land} onChange={handleInputChange} />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={kunde.email} onChange={handleInputChange} />
        </div>
        <div className="formular-gruppe">
          <label htmlFor="mobil">Mobil</label>
          <input type="text" id="mobil" name="mobil" value={kunde.mobil} onChange={handleInputChange} />
        </div>



        {/* Dienstleistungen */}
        <div className="dienstleistungen-bereich">
          <label>Dienstleistungen</label>
          {ausgewaehlteDienstleistungen.map((dienstleistung, index) => (
            <div className="dienstleistung-gruppe" key={index}>
              <select value={dienstleistung} onChange={(e) => handleDienstleistungChange(index, e.target.value)}>
                <option value="">Dienstleistung auswählen</option>
                {dienstleistungen.map((dl) => (
                  <option key={dl.id} value={dl.id}>
                    {dl.title}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Beschreibung der Dienstleistung"
                value={beschreibungen[index]}
                onChange={(e) => handleBeschreibungChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" className="add-dienstleistung-button" onClick={handleAddDienstleistung}>
            Dienstleistung hinzufügen
          </button>
        </div>

        {/* Checkbox für Datenschutz */}
        <div className="checkbox-gruppe">
          <input
            type="checkbox"
            id="datenschutzAkzeptiert"
            name="datenschutzAkzeptiert"
            checked={datenschutzAkzeptiert}
            onChange={() => setDatenschutzAkzeptiert(!datenschutzAkzeptiert)}
          />
          <label htmlFor="datenschutzAkzeptiert">
            Ich akzeptiere die <a href={agb} target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.
          </label>
        </div>

        {/* Submit-Button */}
        <button type="button" className="submit-button" onClick={handleKundeErfassen}>
          Kunde erfassen
        </button>
      </div>
    </div>
  );
};

export default KundeErfassen;
