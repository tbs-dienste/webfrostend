import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BewerbungForm.scss';

const BewerbungForm = () => {
  const [formData, setFormData] = useState({
    vorname: '',
    name: '',
    geburtstag: '',
    adresse: '',
    plz: '',
    ort: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    languages: '',
    interests: '',
    motivation: '',
    position: '',
    serviceId: ''
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung');
        setServices(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/bewerbungen', formData);
      alert(`Bewerbung erfolgreich gesendet! ID: ${response.data.id}`);
      setFormData({
        vorname: '',
        name: '',
        geburtstag: '',
        adresse: '',
        plz: '',
        ort: '',
        email: '',
        phone: '',
        experience: '',
        skills: '',
        languages: '',
        interests: '',
        motivation: '',
        position: '',
        serviceId: ''
      });
    } catch (error) {
      console.error('Error creating application:', error);
      alert('Fehler beim Senden der Bewerbung.');
    }
  };

  return (
    <div className="application-form-container">
      <h2>Bewerbungsformular</h2>
      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-group">
          <label htmlFor="vorname">Vorname</label>
          <input
            type="text"
            name="vorname"
            id="vorname"
            value={formData.vorname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Nachname</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="geburtstag">Geburtstag</label>
          <input
            type="date"
            name="geburtstag"
            id="geburtstag"
            value={formData.geburtstag}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="adresse">Adresse</label>
          <input
            type="text"
            name="adresse"
            id="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="plz">PLZ</label>
          <input
            type="text"
            name="plz"
            id="plz"
            value={formData.plz}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ort">Ort</label>
          <input
            type="text"
            name="ort"
            id="ort"
            value={formData.ort}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefonnummer</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="experience">Berufserfahrung</label>
          <input
            type="text"
            name="experience"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="skills">Fähigkeiten</label>
          <input
            type="text"
            name="skills"
            id="skills"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="languages">Sprachen</label>
          <input
            type="text"
            name="languages"
            id="languages"
            value={formData.languages}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="interests">Interessen</label>
          <input
            type="text"
            name="interests"
            id="interests"
            value={formData.interests}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="motivation">Motivationsschreiben</label>
          <textarea
            name="motivation"
            id="motivation"
            value={formData.motivation}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            name="position"
            id="position"
            value={formData.position}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="serviceId">Dienstleistung</label>
          <select
            name="serviceId"
            id="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">Bitte wählen</option>
            {!loading &&
              services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Bewerbung senden
        </button>
      </form>
    </div>
  );
};

export default BewerbungForm;
