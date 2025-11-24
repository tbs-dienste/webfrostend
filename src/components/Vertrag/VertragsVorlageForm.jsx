import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./VertragsVorlageForm.scss";

const VARIABLES = ["{{vorname}}", "{{nachname}}", "{{firma}}", "{{adresse}}", "{{plz}}", "{{ort}}"];

const VertragsVorlageForm = () => {
  const [titel, setTitel] = useState("");
  const [einstieg, setEinstieg] = useState("");
  const [dienstleistungId, setDienstleistungId] = useState("");
  const [abschnitte, setAbschnitte] = useState([{ untertitel: "", text: [""] }]);
  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [message, setMessage] = useState("");

  const titelRef = useRef(null);
  const einstiegRef = useRef(null);
  const abschnittRefs = useRef([]);
  const [activeField, setActiveField] = useState({ type: null, index: null, paraIndex: null, position: 0 });

  useEffect(() => {
    axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung")
      .then(res => setDienstleistungen(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const handleCursor = (type, index = null, paraIndex = null) => (e) => {
    setActiveField({ type, index, paraIndex, position: e.target.selectionStart });
  };

  const insertVariable = (variable) => {
    const pos = activeField.position || 0;
    if (activeField.type === "titel") {
      const newText = titel.slice(0, pos) + variable + titel.slice(pos);
      setTitel(newText);
      setTimeout(() => {
        titelRef.current.focus();
        titelRef.current.selectionStart = titelRef.current.selectionEnd = pos + variable.length;
      }, 0);
    } else if (activeField.type === "einstieg") {
      const newText = einstieg.slice(0, pos) + variable + einstieg.slice(pos);
      setEinstieg(newText);
      setTimeout(() => {
        einstiegRef.current.focus();
        einstiegRef.current.selectionStart = einstiegRef.current.selectionEnd = pos + variable.length;
      }, 0);
    } else if (activeField.type === "abschnitt") {
      const { index, paraIndex } = activeField;
      const currentText = abschnitte[index].text[paraIndex];
      const newText = currentText.slice(0, pos) + variable + currentText.slice(pos);
      handleParagraphChange(index, paraIndex, newText);
      setTimeout(() => {
        const ref = abschnittRefs.current[`${index}-${paraIndex}`];
        if (ref) {
          ref.focus();
          ref.selectionStart = ref.selectionEnd = pos + variable.length;
        }
      }, 0);
    }
  };

  const handleAbschnittChange = (index, field, value) => {
    const newAbschnitte = [...abschnitte];
    newAbschnitte[index][field] = value;
    setAbschnitte(newAbschnitte);
  };

  const handleParagraphChange = (absIndex, paraIndex, value) => {
    const newAbschnitte = [...abschnitte];
    newAbschnitte[absIndex].text[paraIndex] = value;
    setAbschnitte(newAbschnitte);
  };

  const addAbschnitt = () => setAbschnitte([...abschnitte, { untertitel: "", text: [""] }]);
  const removeAbschnitt = (index) => abschnitte.length > 1 && setAbschnitte(abschnitte.filter((_, i) => i !== index));
  const addParagraph = (index) => {
    const newAbschnitte = [...abschnitte];
    newAbschnitte[index].text.push("");
    setAbschnitte(newAbschnitte);
  };
  const removeParagraph = (absIndex, paraIndex) => {
    const newAbschnitte = [...abschnitte];
    if (newAbschnitte[absIndex].text.length > 1) {
      newAbschnitte[absIndex].text.splice(paraIndex, 1);
      setAbschnitte(newAbschnitte);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titel || !dienstleistungId) {
      setMessage("Titel und Dienstleistung müssen ausgefüllt sein.");
      return;
    }
    try {
      // Abschnitte & Paragraphen passend für createVertragsvorlage
      const payload = {
        titel,
        einstieg,
        dienstleistung_id: dienstleistungId,
        abschnitte: abschnitte.map(a => ({
          untertitel: a.untertitel,
          text: a.text
        }))
      };

      const res = await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/vertrag/vorlagen", payload);
      setMessage(res.data.message);

      setTitel("");
      setEinstieg("");
      setDienstleistungId("");
      setAbschnitte([{ untertitel: "", text: [""] }]);
      abschnittRefs.current = [];
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Fehler beim Erstellen der Vorlage.");
    }
  };

  return (
    <div className="vertrag-form-container">
      <h2>Neue Vertragsvorlage erstellen</h2>
      {message && <div className="message">{message}</div>}

      <div className="variable-buttons">
        {VARIABLES.map(v => (
          <button key={v} type="button" onClick={() => insertVariable(v)} className="variable-btn">{v}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titel der Vorlage</label>
          <input
            type="text"
            placeholder="z.B. Vertrag mit {{vorname}} {{nachname}}"
            value={titel}
            ref={titelRef}
            onChange={(e) => setTitel(e.target.value)}
            onClick={handleCursor("titel")}
            onKeyUp={handleCursor("titel")}
            onFocus={handleCursor("titel")}
          />
        </div>

        <div className="form-group">
          <label>Einstiegstext</label>
          <textarea
            placeholder="Hier kommt der Einleitungstext hin..."
            value={einstieg}
            ref={einstiegRef}
            onChange={(e) => setEinstieg(e.target.value)}
            onClick={handleCursor("einstieg")}
            onKeyUp={handleCursor("einstieg")}
            onFocus={handleCursor("einstieg")}
          />
        </div>

        <div className="form-group">
          <label>Dienstleistung</label>
          <select value={dienstleistungId} onChange={(e) => setDienstleistungId(e.target.value)}>
            <option value="">Bitte auswählen</option>
            {dienstleistungen.map(d => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>
        </div>

        <h3>Abschnitte</h3>
        {abschnitte.map((abschnitt, index) => (
          <div key={index} className="abschnitt">
            <div className="form-group">
              <label>Untertitel</label>
              <input
                type="text"
                value={abschnitt.untertitel}
                onChange={(e) => handleAbschnittChange(index, "untertitel", e.target.value)}
              />
            </div>

            {abschnitt.text.map((para, pIndex) => (
              <div key={pIndex} className="form-group paragraph">
                <label>Paragraph {pIndex + 1}</label>
                <textarea
                  value={para}
                  ref={el => abschnittRefs.current[`${index}-${pIndex}`] = el}
                  onChange={(e) => handleParagraphChange(index, pIndex, e.target.value)}
                  onClick={handleCursor("abschnitt", index, pIndex)}
                  onKeyUp={handleCursor("abschnitt", index, pIndex)}
                  onFocus={handleCursor("abschnitt", index, pIndex)}
                />
                <button type="button" className="remove-btn" onClick={() => removeParagraph(index, pIndex)}>Löschen</button>
              </div>
            ))}

            <button type="button" className="add-btn" onClick={() => addParagraph(index)}>Neuen Paragraphen hinzufügen</button>
            <button type="button" className="remove-btn" onClick={() => removeAbschnitt(index)}>Abschnitt löschen</button>
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addAbschnitt}>Neuen Abschnitt hinzufügen</button>
        <button type="submit" className="submit-btn">Vorlage speichern</button>
      </form>
    </div>
  );
};

export default VertragsVorlageForm;
