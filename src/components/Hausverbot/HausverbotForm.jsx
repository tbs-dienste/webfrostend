import React, { useState } from 'react';
import axios from 'axios';
import './HausverbotForm.scss';

const HausverbotForm = () => {
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    anschrift: '',
    plz: '',
    ort: '',
    geburtsdatum: '',
    grund: '',
    bemerkung: '',
    geschaeft: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');

  const gruende = [
    'Diebstahl',
    'Hausfriedensbruch',
    'Belästigung',
    'Unangemessenes Verhalten',
    'Sachbeschädigung',
    'Sonstiges'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePreviewText = () => {
    const {
      vorname, nachname, anschrift, plz, ort,
      geburtsdatum, grund, bemerkung, geschaeft
    } = formData;
  
    const datum = new Date().toLocaleDateString('de-DE');
  
    return `
  ${geschaeft}
  ${datum}
  
  Hausverbotserteilung
  
  Hiermit wird für die nachfolgend genannte Person mit sofortiger Wirkung ein Hausverbot für das Geschäft "${geschaeft}" ausgesprochen:
  
  Name: ${vorname} ${nachname}
  Anschrift: ${anschrift}, ${plz} ${ort}
  Geburtsdatum: ${geburtsdatum}
  
  Grund des Hausverbots:
  ${grund}
  ${bemerkung ? `Zusätzliche Bemerkung: ${bemerkung}` : ''}
  
  Dieses Hausverbot dient dem Schutz der Sicherheit und Ordnung in unseren Geschäftsräumen. Wir bitten Sie, das Hausverbot zu respektieren und sich künftig nicht mehr auf dem Gelände oder in den Räumlichkeiten von "${geschaeft}" aufzuhalten.
  
  Ein Verstoß gegen dieses Hausverbot stellt eine Ordnungswidrigkeit bzw. eine Straftat nach § 123 Strafgesetzbuch (Hausfriedensbruch) dar und kann strafrechtlich verfolgt werden. Wir behalten uns daher vor, bei Zuwiderhandlung rechtliche Schritte einzuleiten.
  
  Wir bitten Sie, diese Entscheidung zu beachten und danken für Ihr Verständnis.
  
  Mit freundlichen Grüßen,
  
  ${geschaeft}
    `.trim();
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    setResponseText('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/hausverbot', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponseText(response.data.hausverbotstext || 'Hausverbot wurde erfolgreich erstellt.');
      setShowModal(false); // Modal schließen
    } catch (error) {
      setResponseText('Fehler beim Erstellen des Hausverbots.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hausverbot-form-container">
      <h2>Hausverbot erstellen</h2>
      <form className="hausverbot-form" onSubmit={(e) => e.preventDefault()}>
        {/* Formfelder */}
        <div className="form-group"><label>Vorname</label><input name="vorname" value={formData.vorname} onChange={handleChange} required /></div>
        <div className="form-group"><label>Nachname</label><input name="nachname" value={formData.nachname} onChange={handleChange} required /></div>
        <div className="form-group"><label>Anschrift</label><input name="anschrift" value={formData.anschrift} onChange={handleChange} required /></div>
        <div className="form-group-row">
          <div className="form-group"><label>PLZ</label><input name="plz" value={formData.plz} onChange={handleChange} required /></div>
          <div className="form-group"><label>Ort</label><input name="ort" value={formData.ort} onChange={handleChange} required /></div>
        </div>
        <div className="form-group"><label>Geburtsdatum</label><input type="date" name="geburtsdatum" value={formData.geburtsdatum} onChange={handleChange} required /></div>
        <div className="form-group"><label>Grund</label>
          <select name="grund" value={formData.grund} onChange={handleChange} required>
            <option value="">Bitte auswählen</option>
            {gruende.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Bemerkung</label><textarea name="bemerkung" value={formData.bemerkung} onChange={handleChange} /></div>
        <div className="form-group"><label>Geschäft</label><input name="geschaeft" value={formData.geschaeft} onChange={handleChange} required /></div>

        {/* Vorschau-Button */}
        <button type="button" onClick={() => setShowModal(true)}>
          Briefvorschau anzeigen
        </button>
      </form>

      {/* Ausgabe nach Submission */}
      {responseText && (
        <div className="response-box">
          <h3>Rückmeldung</h3>
          <pre>{responseText}</pre>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Briefvorschau</h3>
            <pre className="brief-preview">{generatePreviewText()}</pre>
            <div className="modal-actions">
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Wird gesendet...' : 'Hausverbot speichern'}
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HausverbotForm;
