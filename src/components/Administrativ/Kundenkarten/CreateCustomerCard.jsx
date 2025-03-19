import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Kundenkarte erstellt:', customerData);
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
          />
        </div>

        <div className="input-row">
          <div className="form-group">
            <label>PLZ</label>
            <input
              type="text"
              name="plz"
              value={customerData.plz}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ort</label>
            <input
              type="text"
              name="ort"
              value={customerData.ort}
              onChange={handleChange}
            />
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
