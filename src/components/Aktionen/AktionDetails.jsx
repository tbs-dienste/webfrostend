import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import './AktionDetails.scss';

const AktionDetailsNeu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aktion, setAktion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formInput, setFormInput] = useState({
    titel: '',
    details: '',
    rabattProzent: '',
    startDatum: '',
    endDatum: '',
  });
  const [formErrorMsg, setFormErrorMsg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAktion = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/aktionen/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        setAktion(data);
        setFormInput({
          titel: data.name,
          details: data.beschreibung,
          rabattProzent: (data.rabatt * 100).toFixed(0),
          startDatum: data.start_datum.slice(0, 10),
          endDatum: data.end_datum.slice(0, 10),
        });
      } catch {
        setErrorMsg('Aktion konnte nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };
    fetchAktion();
  }, [id]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('de-DE');

  const handleLoeschen = async () => {
    if (!window.confirm('Willst du diese Aktion wirklich löschen?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/aktionen/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/aktionen');
    } catch {
      setDeleteErrorMsg('Fehler beim Löschen der Aktion.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSpeichern = async () => {
    setFormErrorMsg(null);

    const { titel, details, rabattProzent, startDatum, endDatum } = formInput;

    if (!titel || !details || rabattProzent === '' || !startDatum || !endDatum) {
      setFormErrorMsg('Alle Felder sind erforderlich.');
      return;
    }

    const rabattDezimal = parseFloat(rabattProzent) / 100;
    if (isNaN(rabattDezimal) || rabattDezimal <= 0 || rabattDezimal >= 1) {
      setFormErrorMsg('Rabatt muss eine Zahl zwischen 1 und 99 sein.');
      return;
    }

    if (new Date(startDatum) > new Date(endDatum)) {
      setFormErrorMsg('Startdatum darf nicht nach dem Enddatum liegen.');
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://tbsdigitalsolutionsbackend.onrender.com/api/aktionen/${id}`, {
        name: titel,
        beschreibung: details,
        rabatt: rabattProzent,
        startDatum,
        endDatum
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAktion({
        ...aktion,
        name: titel,
        beschreibung: details,
        rabatt: rabattDezimal,
        start_datum: startDatum,
        end_datum: endDatum,
      });

      setIsEditing(false);
    } catch {
      setFormErrorMsg('Fehler beim Aktualisieren der Aktion.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="aktionneu-container">Lade...</div>;
  if (errorMsg) return <div className="aktionneu-container error-message">{errorMsg}</div>;
  if (!aktion) return <div className="aktionneu-container">Keine Aktion gefunden.</div>;

  return (
    <div className="aktionneu-container">
      {isEditing ? (
        <>
          <h2 className="aktionneu-title">Aktion bearbeiten</h2>
          <div className="aktionneu-fieldgroup">
            <label htmlFor="titel">Titel</label>
            <input
              id="titel"
              name="titel"
              type="text"
              value={formInput.titel}
              onChange={handleInputChange}
              disabled={isSaving}
              placeholder="Aktionstitel eingeben"
            />
          </div>

          <div className="aktionneu-fieldgroup">
            <label htmlFor="details">Beschreibung</label>
            <textarea
              id="details"
              name="details"
              value={formInput.details}
              onChange={handleInputChange}
              disabled={isSaving}
              placeholder="Beschreibung der Aktion"
            />
          </div>

          <div className="aktionneu-fieldgroup">
            <label htmlFor="rabattProzent">Rabatt (%)</label>
            <input
              id="rabattProzent"
              name="rabattProzent"
              type="number"
              min="1"
              max="99"
              value={formInput.rabattProzent}
              onChange={handleInputChange}
              disabled={isSaving}
              placeholder="z.B. 20"
            />
          </div>

          <div className="aktionneu-fieldgroup">
            <label htmlFor="startDatum">Startdatum</label>
            <input
              id="startDatum"
              name="startDatum"
              type="date"
              value={formInput.startDatum}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>

          <div className="aktionneu-fieldgroup">
            <label htmlFor="endDatum">Enddatum</label>
            <input
              id="endDatum"
              name="endDatum"
              type="date"
              value={formInput.endDatum}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>

          {formErrorMsg && <p className="aktionneu-error">{formErrorMsg}</p>}

          <div className="aktionneu-actions">
            <button
              className="aktionneu-button-save"
              onClick={handleSpeichern}
              disabled={isSaving}
            >
              {isSaving ? 'Speichert...' : 'Speichern'}
            </button>
            <button
              className="aktionneu-button-abbrechen"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Abbrechen
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="aktionneu-title">{aktion.name}</h2>
          <div className="aktionneu-rabatt">
            <span>{(aktion.rabatt * 100).toFixed(0)} %</span>
          </div>
          <p className="aktionneu-description">{aktion.beschreibung}</p>
          <div className="aktionneu-dates">
            <Calendar size={20} />
            <span>
              Gültig von <strong>{formatDate(aktion.start_datum)}</strong> bis <strong>{formatDate(aktion.end_datum)}</strong>
            </span>
          </div>

          {deleteErrorMsg && <p className="aktionneu-error">{deleteErrorMsg}</p>}

          <div className="aktionneu-actions">
            <button
              className="aktionneu-button-edit"
              onClick={() => setIsEditing(true)}
            >
              Aktion bearbeiten
            </button>
            <button
              className="aktionneu-button-delete"
              onClick={handleLoeschen}
            >
              Aktion löschen
            </button>
          </div>
        </>
      )}

      <Link to="/aktionen" className="aktionneu-link-back">← Zurück zur Aktionsübersicht</Link>
    </div>
  );
};

export default AktionDetailsNeu;
