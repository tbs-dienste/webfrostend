import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MitarbeiterErfassen.scss";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaGlobe, FaBirthdayCake, FaBuilding } from "react-icons/fa";
import { MdHome, MdLocationOn } from "react-icons/md";

const MitarbeiterErfassen = () => {
  const [formData, setFormData] = useState({
    geschlecht: "m",
    vorname: "",
    nachname: "",
    adresse: "",
    postleitzahl: "",
    ort: "",
    email: "",
    mobil: "",
    benutzername: "",
    passwort: "",
    iban: "",
    land: "",
    geburtstagdatum: "",
    verfügbarkeit: "vollzeit",
    teilzeit_prozent: "",
    fähigkeiten: "",
    dienstleistung_ids: [],
    foto: null,
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    // Dienstleistungen abrufen
    axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung")
      .then(res => {
        if (Array.isArray(res.data)) {
          setServices(res.data);
        } else if (Array.isArray(res.data.data)) {
          setServices(res.data.data);
        } else {
          setServices([]);
        }
      })
      .catch(err => {
        console.error(err);
        setServices([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setFotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      for (let key in formData) {
        if (key === "dienstleistung_ids") {
          formData.dienstleistung_ids.forEach(id => data.append("dienstleistung_ids[]", id));
        } else {
          data.append(key, formData[key]);
        }
      }

      const token = localStorage.getItem("token"); 
      const res = await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: "success", text: res.data.message });
      setFormData({
        geschlecht: "m",
        vorname: "",
        nachname: "",
        adresse: "",
        postleitzahl: "",
        ort: "",
        email: "",
        mobil: "",
        benutzername: "",
        passwort: "",
        iban: "",
        land: "",
        geburtstagdatum: "",
        verfügbarkeit: "vollzeit",
        teilzeit_prozent: "",
        fähigkeiten: "",
        dienstleistung_ids: [],
        foto: null,
      });
      setFotoPreview(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.error || "Fehler beim Erstellen" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mitarbeiter-form-container">
      <h2>Mitarbeiter erstellen</h2>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <form className="mitarbeiter-form" onSubmit={handleSubmit}>
        <div className="input-group"><FaUser /><input type="text" name="vorname" placeholder="Vorname" value={formData.vorname} onChange={handleChange} required /></div>
        <div className="input-group"><FaUser /><input type="text" name="nachname" placeholder="Nachname" value={formData.nachname} onChange={handleChange} required /></div>
        <div className="input-group"><MdHome /><input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} /></div>
        <div className="input-group"><MdLocationOn /><input type="text" name="postleitzahl" placeholder="PLZ" value={formData.postleitzahl} onChange={handleChange} /></div>
        <div className="input-group"><MdLocationOn /><input type="text" name="ort" placeholder="Ort" value={formData.ort} onChange={handleChange} /></div>
        <div className="input-group"><FaEnvelope /><input type="email" name="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} required /></div>
        <div className="input-group"><FaPhone /><input type="text" name="mobil" placeholder="Mobil" value={formData.mobil} onChange={handleChange} /></div>
        <div className="input-group"><FaIdCard /><input type="text" name="benutzername" placeholder="Benutzername" value={formData.benutzername} onChange={handleChange} required /></div>
        <div className="input-group"><FaLock /><input type="password" name="passwort" placeholder="Passwort" value={formData.passwort} onChange={handleChange} required /></div>
        <div className="input-group"><FaGlobe /><input type="text" name="iban" placeholder="IBAN" value={formData.iban} onChange={handleChange} /></div>
        <div className="input-group"><FaGlobe /><input type="text" name="land" placeholder="Land" value={formData.land} onChange={handleChange} /></div>
        <div className="input-group"><FaBirthdayCake /><input type="date" name="geburtstagdatum" value={formData.geburtstagdatum} onChange={handleChange} /></div>

        <div className="input-group">
          <label>Geschlecht:</label>
          <select name="geschlecht" value={formData.geschlecht} onChange={handleChange}>
            <option value="m">Männlich</option>
            <option value="w">Weiblich</option>
            <option value="d">Divers</option>
          </select>
        </div>

        <div className="input-group">
          <label>Verfügbarkeit:</label>
          <select name="verfügbarkeit" value={formData.verfügbarkeit} onChange={handleChange}>
            <option value="vollzeit">Vollzeit</option>
            <option value="teilzeit">Teilzeit</option>
            <option value="flexibel">Flexibel</option>
          </select>
        </div>

        {formData.verfügbarkeit === "teilzeit" && (
          <div className="input-group">
            <input type="number" name="teilzeit_prozent" placeholder="Teilzeit %" value={formData.teilzeit_prozent} onChange={handleChange} min={0} max={100} />
          </div>
        )}

        <div className="input-group"><FaBuilding /><textarea name="fähigkeiten" placeholder="Fähigkeiten" value={formData.fähigkeiten} onChange={handleChange} /></div>

        <div className="input-group dienstleistungen-checkboxes">
  <label>Dienstleistungen:</label>
  {services.map(s => (
    <div key={s.id} className="checkbox-item">
      <input
        type="checkbox"
        id={`dienst-${s.id}`}
        value={s.id}
        checked={formData.dienstleistung_ids.includes(s.id.toString())}
        onChange={(e) => {
          let newIds = [...formData.dienstleistung_ids];
          if (e.target.checked) {
            newIds.push(e.target.value);
          } else {
            newIds = newIds.filter(id => id !== e.target.value);
          }
          setFormData({ ...formData, dienstleistung_ids: newIds });
        }}
      />
      <label htmlFor={`dienst-${s.id}`} className={!s.aktiv ? "inactive" : ""}>
        {s.title} 
      </label>
    </div>
  ))}
</div>




        <div className="input-group">
          <label>Foto hochladen:</label>
          <input type="file" name="foto" accept="image/*" onChange={handleChange} />
          {fotoPreview && <div className="foto-preview"><img src={fotoPreview} alt="Vorschau" /></div>}
        </div>

        <button type="submit" disabled={loading}>{loading ? "Erstelle..." : "Mitarbeiter erstellen"}</button>
      </form>
    </div>
  );
};

export default MitarbeiterErfassen;
