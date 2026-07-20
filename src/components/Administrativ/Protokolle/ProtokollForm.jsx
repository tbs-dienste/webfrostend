import { useState } from "react";
import axios from "axios";
import "./ProtokollForm.scss";

// =========================
// LIST EDITOR (SIMPLE LISTS)
// =========================
function ListEditor({ title, items, setItems }) {
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrUpdate = () => {
    if (!input.trim()) return;

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = input;
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, input]);
    }

    setInput("");
  };

  return (
    <div className="block">
      <h3>{title}</h3>

      <div className="row">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="button" onClick={handleAddOrUpdate}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {items.map((item, i) => (
        <div className="item" key={i}>
          <span>{item}</span>

          <button
            type="button"
            onClick={() => {
              setInput(item);
              setEditIndex(i);
            }}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// =========================
// TASK TABLE EDITOR (AUFGABEN)
// =========================
function TaskTable({ tasks, setTasks }) {
  const [text, setText] = useState("");
  const [mitarbeiterId, setMitarbeiterId] = useState("");
  const [faelligBis, setFaelligBis] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const reset = () => {
    setText("");
    setMitarbeiterId("");
    setFaelligBis("");
    setEditIndex(null);
  };

  const handleAddOrUpdate = () => {
    if (!text.trim()) return;

    const newTask = {
      text,
      mitarbeiterId,
      faelligBis,
    };

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = newTask;
      setTasks(updated);
    } else {
      setTasks([...tasks, newTask]);
    }

    reset();
  };

  return (
    <div className="block">
      <h3>Aufgaben</h3>

      <div className="row">
        <input placeholder="Aufgabe" value={text} onChange={(e) => setText(e.target.value)} />
        <input placeholder="Mitarbeiter ID" value={mitarbeiterId} onChange={(e) => setMitarbeiterId(e.target.value)} />
        <input type="date" value={faelligBis} onChange={(e) => setFaelligBis(e.target.value)} />

        <button type="button" onClick={handleAddOrUpdate}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <div className="table">
        {tasks.map((t, i) => (
          <div className="item" key={i}>
            <div>
              <strong>{t.text}</strong>
              <div>{t.mitarbeiterId} | {t.faelligBis}</div>
            </div>

            <div className="row">
              <button
                type="button"
                onClick={() => {
                  setText(t.text);
                  setMitarbeiterId(t.mitarbeiterId);
                  setFaelligBis(t.faelligBis);
                  setEditIndex(i);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================
// MAIN
// =========================
export default function ProtokollForm() {
  const [form, setForm] = useState({
    kundenId: "",
    projekt: "",
    ortOrFormat: "",
    teilnehmer: "",
    datum: "",
    uhrzeit: "",
    mitarbeiterId: "",
  });

  const [grund, setGrund] = useState([]);
  const [besprochenePunkte, setBesprochenePunkte] = useState([]);
  const [ergebnisse, setErgebnisse] = useState([]);
  const [offenePunkte, setOffenePunkte] = useState([]);
  const [naechsteSchritte, setNaechsteSchritte] = useState([]);
  const [aufgaben, setAufgaben] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        ...form,
        grund,
        besprochenePunkte,
        Ergebnisse: ergebnisse,
        offenepunkte: offenePunkte,
        naechsteschritte: naechsteSchritte,
        aufgaben,
      };

      const res = await axios.post("/api/protokoll/create", payload);
      setMessage(res.data.message);

      setForm({
        kundenId: "",
        projekt: "",
        ortOrFormat: "",
        teilnehmer: "",
        datum: "",
        uhrzeit: "",
        mitarbeiterId: "",
      });

      setGrund([]);
      setBesprochenePunkte([]);
      setErgebnisse([]);
      setOffenePunkte([]);
      setNaechsteSchritte([]);
      setAufgaben([]);
    } catch (err) {
      setMessage(err?.response?.data?.error || "Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Protokoll erstellen</h1>

        <div className="grid">
          <input name="kundenId" placeholder="Kunden ID" onChange={handleChange} value={form.kundenId} />
          <input name="projekt" placeholder="Projekt" onChange={handleChange} value={form.projekt} />
          <input name="ortOrFormat" placeholder="Ort / Format" onChange={handleChange} value={form.ortOrFormat} />
          <input name="teilnehmer" placeholder="Teilnehmer" onChange={handleChange} value={form.teilnehmer} />
          <input type="date" name="datum" onChange={handleChange} value={form.datum} />
          <input name="uhrzeit" placeholder="Uhrzeit" onChange={handleChange} value={form.uhrzeit} />
          <input name="mitarbeiterId" placeholder="Mitarbeiter ID" onChange={handleChange} value={form.mitarbeiterId} />
        </div>

        <ListEditor title="Grund" items={grund} setItems={setGrund} />
        <ListEditor title="Besprochene Punkte" items={besprochenePunkte} setItems={setBesprochenePunkte} />
        <ListEditor title="Ergebnisse" items={ergebnisse} setItems={setErgebnisse} />
        <ListEditor title="Offene Punkte" items={offenePunkte} setItems={setOffenePunkte} />
        <ListEditor title="Nächste Schritte" items={naechsteSchritte} setItems={setNaechsteSchritte} />

        <TaskTable tasks={aufgaben} setTasks={setAufgaben} />

        <button type="submit" disabled={loading}>
          {loading ? "Speichern..." : "Speichern"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
