import React, { useState } from 'react';
import axios from 'axios';
import './CreateCustomerCard.scss';

const CreateCustomerCard = () => {
  const [customerData, setCustomerData] = useState({
    vorname: '',
    nachname: '',
    telefonnummer: '',
    mobil: '',
    adresse: '',
    plz: '',
    ort: '',
    geburtsdatum: '',
    email: '',
  });

  const [orte, setOrte] = useState([]);
  const [loadingOrte, setLoadingOrte] = useState(false);
  const [loadingAdresse, setLoadingAdresse] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'plz' && value.length >= 4) {
      fetchOrteByPlz(value);
    }
  };

  const handleAdresseBlur = async () => {
    if (!customerData.adresse) return;

    setLoadingAdresse(true);
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          street: customerData.adresse,
          country: 'Switzerland',
          format: 'json',
          addressdetails: 1,
        },
      });

      if (response.data && response.data.length > 0) {
        const firstResult = response.data[0];
        const { postcode, city, town, village } = firstResult.address;

        setCustomerData((prev) => ({
          ...prev,
          plz: postcode || prev.plz,
          ort: city || town || village || prev.ort,
        }));

        if (postcode) {
          await fetchOrteByPlz(postcode);
        }
      } else {
        console.warn('Keine Adressdaten gefunden.');
      }
    } catch (error) {
      console.error('Fehler bei der Adressabfrage:', error);
    } finally {
      setLoadingAdresse(false);
    }
  };

  const fetchOrteByPlz = async (plz) => {
    setLoadingOrte(true);
    try {
      const response = await axios.get(`https://api.zippopotam.us/ch/${plz}`);
      const ortNamen = response.data.places.map((place) => place['place name']);
      setOrte(ortNamen);
    } catch (error) {
      console.error('Fehler beim Abrufen der Orte:', error);
      setOrte([]);
    } finally {
      setLoadingOrte(false);
    }
  };

  const handleOrtSelect = (ort) => {
    setCustomerData((prev) => ({
      ...prev,
      ort: ort,
    }));
    setOrte([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token'); // 👈 falls du den Token dort gespeichert hast
  
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/kundenkarten',
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Antwort vom Server:', response.data);
  
      // Reset nach erfolgreicher Speicherung
      setCustomerData({
        vorname: '',
        nachname: '',
        telefonnummer: '',
        mobil: '',
        adresse: '',
        plz: '',
        ort: '',
        geburtsdatum: '',
        email: '',
      });
      setOrte([]);
      alert('Kundenkarte erfolgreich erstellt.');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Erstellen der Kundenkarte.');
    }
  };
  

  return (
    <>
      <h1 className="headline">Neue Kundenkarte erstellen</h1>

      <form className="customer-card-form" onSubmit={handleSubmit}>
        <div className="input-row">
          <div className="form-group">
            <label>Vorname</label>
            <input
              type="text"
              name="vorname"
              value={customerData.vorname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nachname</label>
            <input
              type="text"
              name="nachname"
              value={customerData.nachname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-row">
          <div className="form-group">
            <label>Telefonnummer</label>
            <input
              type="text"
              name="telefonnummer"
              value={customerData.telefonnummer}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mobil</label>
            <input
              type="text"
              name="mobil"
              value={customerData.mobil}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Adresse</label>
          <input
            type="text"
            name="adresse"
            value={customerData.adresse}
            onChange={handleChange}
            onBlur={handleAdresseBlur}
            placeholder="Adresse eingeben (z.B. Musterstrasse 1)"
          />
          {loadingAdresse && <p>Suche PLZ und Ort...</p>}
        </div>

        <div className="input-row">
          <div className="form-group plz-group">
            <label>PLZ</label>
            <input
              type="text"
              name="plz"
              value={customerData.plz}
              onChange={handleChange}
            />
          </div>

          <div className="form-group ort-group">
            <label>Ort</label>
            <input
              type="text"
              name="ort"
              value={customerData.ort}
              onChange={handleChange}
              disabled
            />

            {loadingOrte && <p>Lade Orte...</p>}
            {orte.length > 0 && (
              <ul className="ort-dropdown">
                {orte.map((ort, index) => (
                  <li key={index} onClick={() => handleOrtSelect(ort)}>
                    {ort}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="input-row">
          <div className="form-group">
            <label>Geburtsdatum</label>
            <input
              type="date"
              name="geburtsdatum"
              value={customerData.geburtsdatum}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>E-Mail</label>
            <input
              type="email"
              name="email"
              value={customerData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="save-button">
          Kundenkarte speichern
        </button>
      </form>
    </>
  );
};

export default CreateCustomerCard;
