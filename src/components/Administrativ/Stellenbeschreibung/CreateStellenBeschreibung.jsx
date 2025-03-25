import React, { useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa'; // Icons für Buttons
import './CreateStellenBeschreibung.scss';

const CreateStellenBeschreibung = () => {
  const [formData, setFormData] = useState({
    title: '',
    supervisor: '',
    startDate: '',
    workingHoursPercentage: '',
    partTimeOption: '',
    substitute: [''],
    tasks: [''],
    skills: [''],
    responsibilities: [''],
    requirements: [''],
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
            name="title"
            value={formData.title}
            onChange={(e) => handleChange(e, null, 'title')}
            required
          />
        </div>

        <div className="form-field">
          <label>Vorgesetzter</label>
          <input
            type="text"
            name="supervisor"
            value={formData.supervisor}
            onChange={(e) => handleChange(e, null, 'supervisor')}
            required
          />
        </div>

        <div className="form-field">
          <label>Startdatum</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => handleChange(e, null, 'startDate')}
            required
          />
        </div>

        <div className="form-field">
          <label>Arbeitszeitanteil (%)</label>
          <input
            type="number"
            name="workingHoursPercentage"
            value={formData.workingHoursPercentage}
            onChange={(e) => handleChange(e, null, 'workingHoursPercentage')}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-field">
          <label>Teilzeitoption</label>
          <input
            type="text"
            name="partTimeOption"
            value={formData.partTimeOption}
            onChange={(e) => handleChange(e, null, 'partTimeOption')}
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

        {/* Dynamische Felder für Substitute */}
        <div className="dynamic-fields">
          <label>Vertretung</label>
          {formData.substitute.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'substitute')}
                placeholder="Vertretung hinzufügen"
              />
              {formData.substitute.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'substitute')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('substitute')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Tasks */}
        <div className="dynamic-fields">
          <label>Aufgaben</label>
          {formData.tasks.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'tasks')}
                placeholder="Aufgabe hinzufügen"
              />
              {formData.tasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'tasks')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('tasks')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Skills */}
        <div className="dynamic-fields">
          <label>Fähigkeiten</label>
          {formData.skills.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'skills')}
                placeholder="Fähigkeit hinzufügen"
              />
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'skills')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('skills')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Responsibilities */}
        <div className="dynamic-fields">
          <label>Verantwortlichkeiten</label>
          {formData.responsibilities.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'responsibilities')}
                placeholder="Verantwortlichkeit hinzufügen"
              />
              {formData.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'responsibilities')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('responsibilities')}
            className="add-btn"
          >
            <FaPlus /> Hinzufügen
          </button>
        </div>

        {/* Dynamische Felder für Requirements */}
        <div className="dynamic-fields">
          <label>Anforderungen</label>
          {formData.requirements.map((item, index) => (
            <div key={index} className="dynamic-field">
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, 'requirements')}
                placeholder="Anforderung hinzufügen"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(index, 'requirements')}
                  className="remove-btn"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('requirements')}
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
