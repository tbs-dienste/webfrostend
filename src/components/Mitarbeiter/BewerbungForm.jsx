import React, { useState, useEffect } from 'react';
import './BewerbungForm.scss';

function BewerbungForm() {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 13; // Mindestalter 13 Jahre
  const maxYear = currentYear - 40; // Maximales Alter 40 Jahre

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  const years = Array.from({ length: minYear - maxYear + 1 }, (_, i) => minYear - i);

  const cantons = [
    "Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden", "Glarus",
    "Zug", "Freiburg", "Solothurn", "Basel-Stadt", "Basel-Landschaft", "Schaffhausen",
    "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "St. Gallen", "Graubünden",
    "Aargau", "Thurgau", "Tessin", "Waadt", "Wallis", "Neuenburg", "Genf", "Jura"
  ];

  const [formData, setFormData] = useState({
    gender: 'frau',
    firstname: '',
    lastname: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    street: '',
    zip: '',
    city: '',
    canton: '',
    phone: '',
    email: '',
    termsAccepted: false,
    startDate: '',
    endDate: '',
    cvFile: '',
    coverLetterFile: '',
    transcriptsFile: '',
    otherDocsFile: '',
  });

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem('applicationFormData'));
    if (savedFormData) {
      setFormData(savedFormData);
    }
  }, []);

  const handleSaveForLater = () => {
    localStorage.setItem('applicationFormData', JSON.stringify(formData));
    alert("Formulardaten wurden gespeichert!");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (event, fileKey) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prevData) => ({
        ...prevData,
        [fileKey]: file.name // Storing just the file name
      }));
    } else {
      alert("Bitte nur PDF-Dateien hochladen.");
      event.target.value = null; // Reset input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem('applicationFormData');
    alert("Formular wurde erfolgreich eingereicht!");
    setFormData({
      gender: 'frau',
      firstname: '',
      lastname: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      street: '',
      zip: '',
      city: '',
      canton: '',
      phone: '',
      email: '',
      termsAccepted: false,
      startDate: '',
      endDate: '',
      cvFile: '',
      coverLetterFile: '',
      transcriptsFile: '',
      otherDocsFile: '',
    });
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <section className="section personal-info">
        <h2>Meine Daten</h2>
        <div className="form-row">
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="frau">Frau</option>
            <option value="herr">Herr</option>
          </select>
          <input
            type="text"
            name="firstname"
            placeholder="Vorname*"
            value={formData.firstname}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Nachname*"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Geburtsdatum*</label>
          <select name="birthDay" value={formData.birthDay} onChange={handleInputChange} required>
            <option value="">Tag wählen</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange} required>
            <option value="">Monat wählen</option>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select name="birthYear" value={formData.birthYear} onChange={handleInputChange} required>
            <option value="">Jahr wählen</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name="street"
          placeholder="Strasse*"
          value={formData.street}
          onChange={handleInputChange}
          required
        />
        <div className="form-row">
          <input
            type="text"
            name="zip"
            placeholder="PLZ*"
            value={formData.zip}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="Ort*"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          <select name="canton" value={formData.canton} onChange={handleInputChange} required>
            <option value="">Kanton auswählen</option>
            {cantons.map(canton => (
              <option key={canton} value={canton}>{canton}</option>
            ))}
          </select>
        </div>
        <input
          type="tel"
          name="phone"
          placeholder="Telefon*"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-Mail*"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            required
          />
          Ich akzeptiere die <a href="#">Nutzungsbedingungen*</a>
        </label>
      </section>

      <section className="section wish-dates">
        <h2>Wunschdaten</h2>
        <label>
          Von wann bis wann möchtest du schnuppern?
          <span className="tooltip">
            <span className="tooltip-icon">i</span>
            <span className="tooltip-text">Gebe ein Wunschdatum ein, wann sich eine Schnupperlehre für dich besonders gut organisieren lässt.</span>
          </span>
        </label>
        <div className="form-row">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
          <span>bis</span>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
      </section>

      <section className="section documents">
        <h2>Meine Unterlagen</h2>
        <div className="form-row">
          <label>Lebenslauf*</label>
          <input
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'cvFile')}
            id="cv-upload"
          />
          <button type="button" onClick={() => document.getElementById('cv-upload').click()}>
            Hochladen
          </button>
          {formData.cvFile && <span>{formData.cvFile}</span>}
        </div>
        <div className="form-row">
          <label>Motivationsschreiben*</label>
          <input
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'coverLetterFile')}
            id="cover-letter-upload"
          />
          <button type="button" onClick={() => document.getElementById('cover-letter-upload').click()}>
            Hochladen
          </button>
          {formData.coverLetterFile && <span>{formData.coverLetterFile}</span>}
        </div>
        <div className="form-row">
          <label>Zeugnisse*</label>
          <input
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'transcriptsFile')}
            id="transcripts-upload"
          />
          <button type="button" onClick={() => document.getElementById('transcripts-upload').click()}>
            Hochladen
          </button>
          {formData.transcriptsFile && <span>{formData.transcriptsFile}</span>}
        </div>
        <div className="form-row">
          <label>Weitere Dokumente</label>
          <input
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, 'otherDocsFile')}
            id="other-docs-upload"
          />
          <button type="button" onClick={() => document.getElementById('other-docs-upload').click()}>
            Hochladen
          </button>
          {formData.otherDocsFile && <span>{formData.otherDocsFile}</span>}
        </div>
      </section>

      <div className="form-actions">
        <button type="button" onClick={handleSaveForLater}>Später speichern</button>
        <button type="submit">Formular abschicken</button>
      </div>
    </form>
  );
}

export default BewerbungForm;
