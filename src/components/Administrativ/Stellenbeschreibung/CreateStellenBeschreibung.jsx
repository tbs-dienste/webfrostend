import React, { useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa'; // Icons für Buttons
import './CreateStellenBeschreibung.scss';

const CreateStellenBeschreibung = () => {
  const [formData, setFormData] = useState({
    bezeichnung: '',
    vorgesetzter: '',
    startDatum: '',
    arbeitszeitProzent: '',
    teilzeitOption: '',
    vertretung: [''],
    aufgaben: [''],
    kompetenzen: [''],
    verantwortlichkeiten: [''],
    anforderungen: [''],
    status: 'Entwurf',
  });

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[type]];
    
    // Wenn index angegeben ist, aktualisiere den Wert des Array-Elements
    if (index !== null) {
      updatedArray[index] = value;
    } else {
      // Wenn kein index angegeben ist, wird das Wert direkt im Objekt geändert
      setFormData({
        ...formData,
        [name]: value,
      });
      return;
    }

    setFormData({
      ...formData,
      [type]: updatedArray,
    });
  };

  const handleAddField = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], ''],
    });
  };

  const handleRemoveField = (index, type) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [type]: updatedArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ausgabe der Formulardaten in der Konsole
    console.log("Formulardaten:", formData);

    try {
      const response = await fetch('/api/job-posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Stellenanzeige erfolgreich erstellt!');
      } else {
        alert(result.error || 'Fehler beim Erstellen der Stellenanzeige.');
      }
    } catch (error) {
      alert('Es ist ein Fehler aufgetreten: ' + error.message);
    }
  };

  return (
    <div className="job-posting-container">
      <h2 className="job-posting-title">Stellenanzeige erstellen</h2>
      <form onSubmit={handleSubmit} className="job-posting-form">
        <div className="form-field">
          <label>Titel</label>
          <input
            type="text"
            name="bezeichnung"
            value={formData.bezeichnung}
            onChange={(e) => handleChange(e, null, 'bezeichnung')}
            required
          />
        </div>

        <div className="form-field">
          <label>Vorgesetzter</label>
          <input
            type="text"
            name="vorgesetzter"
            value={formData.vorgesetzter}
            onChange={(e) => handleChange(e, null, 'vorgesetzter')}
            required
          />
        </div>

        <div className="form-field">
          <label>Startdatum</label>
          <input
            type="date"
            name="startDatum"
            value={formData.startDatum}
            onChange={(e) => handleChange(e, null, 'startDatum')}
            required
          />
        </div>

        <div className="form-field">
          <label>Arbeitszeitanteil (%)</label>
          <input
            type="number"
            name="arbeitszeitProzent"
            value={formData.arbeitszeitProzent}
            onChange={(e) => handleChange(e, null, 'arbeitszeitProzent')}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-field">
          <label>Teilzeitoption</label>
          <input
            type="text"
            name="teilzeitOption"
            value={formData.teilzeitOption}
            onChange={(e) => handleChange(e, null, 'teilzeitOption')}
          />
        </div>

        <div className="form-field">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => handleChange(e, null, 'status')}
          >
            <option value="Entwurf">Entwurf</option>
            <option value="Veröffentlicht">Veröffentlicht</option>
            <option value="Geschlossen">Geschlossen</option>
          </select>
        </div>

        {/* Dynamische Felder für Vertretung */}
        <div className="dynamic-fields">
          <label>Vertretung</label>
          {formData.vertretung.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'vertretung')}
                placeholder="Vertretung hinzufügen"
              />
              {formData.vertretung.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'vertretung')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('vertretung')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Aufgaben */}
        <div className="dynamic-fields">
          <label>Aufgaben</label>
          {formData.aufgaben.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'aufgaben')}
                placeholder="Aufgabe hinzufügen"
              />
              {formData.aufgaben.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'aufgaben')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('aufgaben')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Kompetenzen */}
        <div className="dynamic-fields">
          <label>Fähigkeiten</label>
          {formData.kompetenzen.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'kompetenzen')}
                placeholder="Fähigkeit hinzufügen"
              />
              {formData.kompetenzen.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'kompetenzen')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('kompetenzen')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Verantwortlichkeiten */}
        <div className="dynamic-fields">
          <label>Verantwortlichkeiten</label>
          {formData.verantwortlichkeiten.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'verantwortlichkeiten')}
                placeholder="Verantwortlichkeit hinzufügen"
              />
              {formData.verantwortlichkeiten.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'verantwortlichkeiten')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('verantwortlichkeiten')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Anforderungen */}
        <div className="dynamic-fields">
          <label>Anforderungen</label>
          {formData.anforderungen.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'anforderungen')}
                placeholder="Anforderung hinzufügen"
              />
              {formData.anforderungen.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'anforderungen')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('anforderungen')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Stellenanzeige erstellen
        </button>
      </form>
    </div>
  );
};

export default CreateStellenBeschreibung;
