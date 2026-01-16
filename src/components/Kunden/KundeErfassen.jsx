import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KundeErfassen.scss';
import agb from '../Documents/AGB.pdf';

const KundeErfassen = () => {
  const [kunde, setKunde] = useState({
    firma: '',
    vorname: '',
    nachname: '',
    strasse: '',
    hausnummer: '',
    strasseHausnummer: '',
    postleitzahl: '',
    ort: '',
    land: '',
    email: '',
    mobil: '',
    geschlecht: '',
    art: '',
  });

  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [ausgewaehlteDienstleistungen, setAusgewaehlteDienstleistungen] = useState(['']);
  const [beschreibungen, setBeschreibungen] = useState(['']);
  const [datenschutzAkzeptiert, setDatenschutzAkzeptiert] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get(
          'https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung'
        );
  
        // ✅ WICHTIG
        setDienstleistungen(response.data.data || response.data || []);
      } catch (error) {
        console.error('Fehler beim Laden der Dienstleistungen:', error);
      }
    };
  
    fetchDienstleistungen();
  }, []);
  

  useEffect(() => {
    // Klick außerhalb schließt Vorschläge
    const handleClickOutside = (e) => {
      if (!e.target.closest('.adresse-wrapper')) setShowSuggestions(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setDatenschutzAkzeptiert(checked);
    } else {
      setKunde((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === 'strasse' || name === 'hausnummer') {
          updated.strasseHausnummer = `${updated.strasse} ${updated.hausnummer}`.trim();
        }
        return updated;
      });
      if (name === 'strasse' && value.length > 3) fetchAddressSuggestions(value);
      else if (name === 'strasse') setAddressSuggestions([]);
    }
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=CH&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Adressvorschläge Fehler:', err);
    }
  };

  const handleSelectAddress = (suggestion) => {
    const addr = suggestion.address;
    setKunde((prev) => ({
      ...prev,
      strasse: addr.road || '',
      hausnummer: addr.house_number || '',
      strasseHausnummer: (addr.road || '') + (addr.house_number ? ' ' + addr.house_number : ''),
      postleitzahl: addr.postcode || '',
      ort: addr.city || addr.town || addr.village || '',
      land: addr.country || '',
    }));
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  const handleDienstleistungChange = (i, val) => {
    const copy = [...ausgewaehlteDienstleistungen];
    copy[i] = val;
    setAusgewaehlteDienstleistungen(copy);

    const copyDesc = [...beschreibungen];
    copyDesc[i] = '';
    setBeschreibungen(copyDesc);
  };

  const handleBeschreibungChange = (i, val) => {
    const copy = [...beschreibungen];
    copy[i] = val;
    setBeschreibungen(copy);
  };

  const handleAddDienstleistung = () => {
    setAusgewaehlteDienstleistungen([...ausgewaehlteDienstleistungen, '']);
    setBeschreibungen([...beschreibungen, '']);
  };

  const handleKundeErfassen = async () => {
    if (isSubmitting) return;

    if (
      !kunde.vorname ||
      !kunde.nachname ||
      !kunde.email ||
      !kunde.mobil ||
      !datenschutzAkzeptiert ||
      ausgewaehlteDienstleistungen.length === 0 ||
      !ausgewaehlteDienstleistungen[0]
    ) {
      alert('Bitte alle Pflichtfelder ausfüllen und AGB akzeptieren.');
      return;
    }

    setIsSubmitting(true);

    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip_adresse = ipResponse.data.ip;

      const newKunde = {
        ...kunde,
        ip_adresse,
        dienstleistungen: ausgewaehlteDienstleistungen
          .filter((dlId, i) => dlId)
          .map((dlId, i) => ({
            dienstleistungsId: parseInt(dlId),
            beschreibung: beschreibungen[i] || '',
          })),
      };

      await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden', newKunde);
      window.location.href = '/dankesnachricht';
    } catch (error) {
      console.error(error);
      alert('Fehler beim Erfassen der Kundendaten.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kunde-erfassen">
      <h2>Kundendaten erfassen</h2>
      <div className="formular">
        {/* Kundentyp & Geschlecht */}
        <div className="flex-row">
          <div className="radio-gruppe">
            <span>Kundentyp</span>
            <label>
              <input type="radio" name="art" value="privat" checked={kunde.art === 'privat'} onChange={handleInputChange} />
              Privatkunde
            </label>
            <label>
              <input type="radio" name="art" value="geschäft" checked={kunde.art === 'geschäft'} onChange={handleInputChange} />
              Geschäftskunde
            </label>
          </div>

          <div className="radio-gruppe">
            <span>Geschlecht</span>
            <label>
              <input type="radio" name="geschlecht" value="männlich" checked={kunde.geschlecht === 'männlich'} onChange={handleInputChange} />
              Männlich
            </label>
            <label>
              <input type="radio" name="geschlecht" value="weiblich" checked={kunde.geschlecht === 'weiblich'} onChange={handleInputChange} />
              Weiblich
            </label>
          </div>
        </div>

        {kunde.art === 'geschäft' && (
          <div className="input-gruppe">
            <label>Firma</label>
            <input type="text" name="firma" value={kunde.firma} onChange={handleInputChange} />
          </div>
        )}

        <div className="flex-row">
          <div className="input-gruppe"><label>Vorname</label><input type="text" name="vorname" value={kunde.vorname} onChange={handleInputChange} /></div>
          <div className="input-gruppe"><label>Nachname</label><input type="text" name="nachname" value={kunde.nachname} onChange={handleInputChange} /></div>
        </div>

        <div className="flex-row adresse-wrapper">
          <div className="input-gruppe" style={{ flex: 1, position: 'relative' }}>
            <label>Straße</label>
            <input type="text" name="strasse" value={kunde.strasse} onChange={handleInputChange} autoComplete="off" />
            {showSuggestions && addressSuggestions.length > 0 && (
              <ul className="adress-vorschlaege active">
                {Array.from(new Set(addressSuggestions.map(a => a.display_name))).map((s, i) => {
                  const addr = addressSuggestions.find(a => a.display_name === s).address;
                  return (
                    <li key={i} onClick={() => handleSelectAddress(addressSuggestions.find(a => a.display_name === s))}>
                      {addr.road || ''} {addr.house_number || ''}, {addr.postcode || ''} {addr.city || addr.town || addr.village || ''}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="input-gruppe">
            <label>Hausnummer</label>
            <input type="text" name="hausnummer" value={kunde.hausnummer} onChange={handleInputChange} />
          </div>
        </div>

        <div className="flex-row">
          <div className="input-gruppe"><label>Postleitzahl</label><input type="text" name="postleitzahl" value={kunde.postleitzahl} onChange={handleInputChange} /></div>
          <div className="input-gruppe"><label>Ort</label><input type="text" name="ort" value={kunde.ort} onChange={handleInputChange} /></div>
          <div className="input-gruppe"><label>Land</label><input type="text" name="land" value={kunde.land} onChange={handleInputChange} /></div>
        </div>

        <div className="flex-row">
          <div className="input-gruppe"><label>Email</label><input type="text" name="email" value={kunde.email} onChange={handleInputChange} /></div>
          <div className="input-gruppe"><label>Mobil</label><input type="text" name="mobil" value={kunde.mobil} onChange={handleInputChange} /></div>
        </div>

        {/* Dienstleistungen */}
        <div className="dienstleistungen-bereich">
          <label>Dienstleistungen</label>
          {ausgewaehlteDienstleistungen.map((dl, i) => (
            <div className="dienstleistung-gruppe" key={i}>
              <select value={dl} onChange={(e) => handleDienstleistungChange(i, e.target.value)}>
                <option value="">Dienstleistung auswählen</option>
                {dienstleistungen.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
              <textarea placeholder="Beschreibung" value={beschreibungen[i]} onChange={(e) => handleBeschreibungChange(i, e.target.value)} />
            </div>
          ))}
          <button type="button" className="add-dienstleistung-button" onClick={handleAddDienstleistung}>Weitere hinzufügen</button>
        </div>

        {/* Datenschutz */}
        <div className="checkbox-gruppe">
          <input type="checkbox" id="datenschutzAkzeptiert" checked={datenschutzAkzeptiert} onChange={handleInputChange} />
          <label htmlFor="datenschutzAkzeptiert">Ich akzeptiere die <a href={agb} target="_blank" rel="noopener noreferrer">AGB</a>.</label>
        </div>

        {/* Submit */}
        <button className="submit-button" onClick={handleKundeErfassen} disabled={isSubmitting}>
          {isSubmitting ? 'Sende...' : 'Kontakt aufnehmen'}
        </button>
      </div>
    </div>
  );
};

export default KundeErfassen;
