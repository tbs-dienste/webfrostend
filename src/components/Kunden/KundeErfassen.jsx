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
  });

  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [ausgewaehlteDienstleistungen, setAusgewaehlteDienstleistungen] = useState([{ id: '', beschreibung: '' }]);
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
    newDienstleistungen[index].id = value;
    newDienstleistungen[index].beschreibung = ''; // Reset description when selecting a new service
    setAusgewaehlteDienstleistungen(newDienstleistungen);
  };

  const handleBeschreibungChange = (index, value) => {
    const newDienstleistungen = [...ausgewaehlteDienstleistungen];
    newDienstleistungen[index].beschreibung = value;
    setAusgewaehlteDienstleistungen(newDienstleistungen);
  };

  const handleAddDienstleistung = () => {
    setAusgewaehlteDienstleistungen([...ausgewaehlteDienstleistungen, { id: '', beschreibung: '' }]);
  };

  const handleKundeErfassen = async () => {
    if (!kunde.firma || !kunde.vorname || !kunde.nachname || !kunde.email || !kunde.mobil || ausgewaehlteDienstleistungen.length === 0 || !ausgewaehlteDienstleistungen[0].id) {
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
          .filter(dienstleistung => dienstleistung.id)
          .map(dienstleistung => ({
            dienstleistungsId: parseInt(dienstleistung.id),
            beschreibung: dienstleistung.beschreibung,
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
        {['firma', 'vorname', 'nachname', 'strasseHausnummer', 'postleitzahl', 'ort', 'land', 'email', 'mobil'].map((field, index) => (
          <div className="formular-gruppe" key={index}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input type={field === 'email' ? 'email' : 'text'} id={field} name={field} value={kunde[field]} onChange={handleInputChange} />
          </div>
        ))}

        {/* Dienstleistungen */}
        <div className="dienstleistungen-bereich">
          <label>Dienstleistungen</label>
          {ausgewaehlteDienstleistungen.map((dienstleistung, index) => (
            <div className="dienstleistung-gruppe" key={index}>
              <select value={dienstleistung.id} onChange={(e) => handleDienstleistungChange(index, e.target.value)}>
                <option value="">Dienstleistung auswählen</option>
                {dienstleistungen.map((dl) => (
                  <option key={dl.id} value={dl.id}>
                    {dl.title}
                  </option>
                ))}
              </select>

              {/* Beschreibung als Textarea unter der Dienstleistung */}
              {dienstleistung.id && (
                <textarea
                  placeholder="Beschreibung"
                  value={dienstleistung.beschreibung}
                  onChange={(e) => handleBeschreibungChange(index, e.target.value)}
                />
              )}
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
