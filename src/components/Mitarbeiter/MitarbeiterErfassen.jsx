import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MitarbeiterErfassen.scss";

const MitarbeiterErfassen = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    geschlecht: "m",
    vorname: "",
    nachname: "",
    adresse: "",
    postleitzahl: "",
    ort: "",
    land: "",
    email: "",
    mobil: "",
    benutzername: "",
    passwort: "",
    iban: "",
    geburtstagdatum: "",
    verfügbarkeit: "vollzeit",
    teilzeit_prozent: "",
    fähigkeiten: "",
    dienstleistung_ids: [],
    foto: null
  });

  useEffect(() => {
    axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung")
      .then(res => setServices(res.data.data || res.data))
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const toggleDienstleistung = id => {
    setFormData(prev => ({
      ...prev,
      dienstleistung_ids: prev.dienstleistung_ids.includes(id)
        ? prev.dienstleistung_ids.filter(d => d !== id)
        : [...prev.dienstleistung_ids, id]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "dienstleistung_ids") {
          value.forEach(id => data.append("dienstleistung_ids[]", id));
        } else if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      const token = localStorage.getItem("token");

      const res = await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter", data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: "success", text: res.data.message });

      setFormData({
        geschlecht: "m",
        vorname: "",
        nachname: "",
        adresse: "",
        postleitzahl: "",
        ort: "",
        land: "",
        email: "",
        mobil: "",
        benutzername: "",
        passwort: "",
        iban: "",
        geburtstagdatum: "",
        verfügbarkeit: "vollzeit",
        teilzeit_prozent: "",
        fähigkeiten: "",
        dienstleistung_ids: [],
        foto: null
      });

    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Fehler beim Erstellen"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mitarbeiter-form-container">
      <h2>Mitarbeiter erstellen</h2>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        {/* 👤 PERSON */}
        <input name="vorname" placeholder="Vorname" value={formData.vorname} onChange={handleChange} required />
        <input name="nachname" placeholder="Nachname" value={formData.nachname} onChange={handleChange} required />

        <select name="geschlecht" value={formData.geschlecht} onChange={handleChange}>
          <option value="m">Männlich</option>
          <option value="w">Weiblich</option>
          <option value="d">Divers</option>
        </select>

        {/* 🏠 ADRESSE */}
        <input name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} />
        <input name="postleitzahl" placeholder="PLZ" value={formData.postleitzahl} onChange={handleChange} />
        <input name="ort" placeholder="Ort" value={formData.ort} onChange={handleChange} />
        <input name="land" placeholder="Land" value={formData.land} onChange={handleChange} />

        {/* 📞 KONTAKT */}
        <input name="email" type="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} required />
        <input name="mobil" placeholder="Mobilnummer" value={formData.mobil} onChange={handleChange} />

        {/* 🔐 LOGIN */}
        <input name="benutzername" placeholder="Benutzername" value={formData.benutzername} onChange={handleChange} required />
        <input name="passwort" type="password" placeholder="Passwort" value={formData.passwort} onChange={handleChange} required />

        {/* 💳 FINANZEN */}
        <input name="iban" placeholder="IBAN" value={formData.iban} onChange={handleChange} />

        {/* 🎂 GEBURTSTAG */}
        <input name="geburtstagdatum" type="date" value={formData.geburtstagdatum} onChange={handleChange} />

        {/* 🕒 ARBEITSZEIT */}
        <select name="verfügbarkeit" value={formData.verfügbarkeit} onChange={handleChange}>
          <option value="vollzeit">Vollzeit</option>
          <option value="teilzeit">Teilzeit</option>
          <option value="flexibel">Flexibel</option>
        </select>

        {formData.verfügbarkeit === "teilzeit" && (
          <input
            name="teilzeit_prozent"
            type="number"
            placeholder="Teilzeit %"
            value={formData.teilzeit_prozent}
            onChange={handleChange}
          />
        )}

        {/* 🧠 FÄHIGKEITEN */}
        <textarea
          name="fähigkeiten"
          placeholder="Fähigkeiten"
          value={formData.fähigkeiten}
          onChange={handleChange}
        />

        {/* 🧾 DIENSTLEISTUNGEN */}
        <h4>Dienstleistungen</h4>
        {services.map(s => (
          <label key={s.id} className="checkbox">
            <input
              type="checkbox"
              checked={formData.dienstleistung_ids.includes(s.id)}
              onChange={() => toggleDienstleistung(s.id)}
            />
            {s.title}
          </label>
        ))}

        {/* 🖼️ FOTO */}
        <input type="file" name="foto" accept="image/*" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Speichern..." : "Mitarbeiter erstellen"}
        </button>

      </form>
    </div>
  );
};

export default MitarbeiterErfassen;
