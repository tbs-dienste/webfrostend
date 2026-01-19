import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateTermin.scss";
import { useNavigate } from "react-router-dom";

const CreateTermin = () => {
  const [dienstleistungen, setDienstleistungen] = useState([]);
  const navigate = useNavigate(); // ✅ Das muss oben stehen

  const [form, setForm] = useState({
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
    dienstleistung_id: "",
    datum: "",
    uhrzeit: "",
    termin_art: "online",
    strasse: "",
    plz: "",
    ort: "",
    beschreibung: ""
  });

  useEffect(() => {
    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung"
        );
        setDienstleistungen(response.data.data || response.data || []);
      } catch (error) {
        console.error("Fehler beim Laden der Dienstleistungen:", error);
      }
    };
    fetchDienstleistungen();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let min of [0, 15, 30, 45]) {
        const h = hour.toString().padStart(2, "0");
        const m = min.toString().padStart(2, "0");
        times.push(`${h}:${m}`);
      }
    }
    return times;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/beratungstermine",
        form
      );
  
      // ✅ Erfolgreich erstellt → weiterleiten
      navigate("/dankesnachricht"); // Achtung: Pfad korrekt schreiben
  
    } catch (err) {
      console.error(err);
      // Fehler sauber anzeigen
      alert(err.response?.data?.error || "Fehler beim Erstellen des Termins");
    }
  };
  

  return (
    <div className="create-termin">
      <h2 className="create-termin__title">Neuen Beratungstermin erstellen</h2>
      <form className="create-termin__form" onSubmit={handleSubmit}>
        <div className="create-termin__form-grid">
          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Vorname*
            <input
              className="create-termin__form__label__input"
              type="text"
              name="vorname"
              value={form.vorname}
              onChange={handleChange}
              required
            />
          </label>

          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Nachname*
            <input
              className="create-termin__form__label__input"
              type="text"
              name="nachname"
              value={form.nachname}
              onChange={handleChange}
              required
            />
          </label>

          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            E-Mail*
            <input
              className="create-termin__form__label__input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.07 15.07 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.48 2.53.74 3.88.74a1 1 0 011 1V20a1 1 0 01-1 1c-9.39 0-17-7.61-17-17a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.68.74 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"/>
            </svg>
            Telefon
            <input
              className="create-termin__form__label__input"
              type="tel"
              name="telefon"
              value={form.telefon}
              onChange={handleChange}
            />
          </label>

          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
            </svg>
            Dienstleistung*
            <select
              className="create-termin__form__label__select"
              name="dienstleistung_id"
              value={form.dienstleistung_id}
              onChange={handleChange}
              required
            >
              <option value="">Bitte wählen</option>
              {dienstleistungen.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </label>

          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V9h14v12zm-7-3h5v-5h-5v5zm0-7h5V8h-5v3z"/>
            </svg>
            Datum*
            <input
              className="create-termin__form__label__input"
              type="date"
              name="datum"
              value={form.datum}
              onChange={handleChange}
              required
            />
          </label>

          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M12 1a11 11 0 110 22 11 11 0 010-22zm0 2a9 9 0 100 18 9 9 0 000-18zm1 9h4v2h-6V5h2v7z"/>
            </svg>
            Uhrzeit*
            <select
              className="create-termin__form__label__select"
              name="uhrzeit"
              value={form.uhrzeit}
              onChange={handleChange}
              required
            >
              <option value="">Bitte wählen</option>
              {generateTimeOptions().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </label>

          <label className="create-termin__form__label">
            <svg className="create-termin__form__label-icon" viewBox="0 0 24 24">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
            </svg>
            Terminart*
            <select
              className="create-termin__form__label__select"
              name="termin_art"
              value={form.termin_art}
              onChange={handleChange}
            >
              <option value="online">Online</option>
              <option value="vor_ort">Vor Ort</option>
            </select>
          </label>
        </div>

        {form.termin_art === "vor_ort" && (
          <div className="create-termin__form-adresse">
            <label className="create-termin__form__label">
              Straße
              <input
                className="create-termin__form__label__input"
                type="text"
                name="strasse"
                value={form.strasse}
                onChange={handleChange}
              />
            </label>
            <label className="create-termin__form__label">
              PLZ
              <input
                className="create-termin__form__label__input"
                type="text"
                name="plz"
                value={form.plz}
                onChange={handleChange}
              />
            </label>
            <label className="create-termin__form__label">
              Ort
              <input
                className="create-termin__form__label__input"
                type="text"
                name="ort"
                value={form.ort}
                onChange={handleChange}
              />
            </label>
          </div>
        )}

        <label className="create-termin__form__label beschreibung">
          Beschreibung / Notizen
          <textarea
            className="create-termin__form__label__textarea"
            name="beschreibung"
            value={form.beschreibung}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="create-termin__form__submit-btn">
          Termin erstellen
        </button>
      </form>
    </div>
  );
};

export default CreateTermin;
