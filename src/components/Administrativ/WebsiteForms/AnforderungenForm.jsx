import { useState } from "react";
import axios from "axios";
import "./AnforderungenForm.scss";

export default function AnforderungenForm() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (key, value) => {
    setFormData((prev) => {
      const arr = prev[key] || [];

      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/projekte", formData);
      alert("Gespeichert!");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Senden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="reqForm" onSubmit={handleSubmit}>

      <header className="reqHeader">
        <h1>Projektanforderungsdokument</h1>
      </header>

      {/* 1 PROJEKTDATEN */}
      <section className="reqSection">
        <h2>1. Projektdaten</h2>

        <input name="projektname" placeholder="Projektname" onChange={handleChange} />
        <input name="kunde" placeholder="Kunde" onChange={handleChange} />
        <input name="ansprechpartner" placeholder="Ansprechpartner" onChange={handleChange} />
        <input name="datum" type="date" onChange={handleChange} />
      </section>

      {/* 2 PROJEKTBESCHREIBUNG */}
      <section className="reqSection">
        <h2>2. Projektbeschreibung</h2>

        <textarea name="beschreibung" placeholder="Beschreibung des Projektes" onChange={handleChange} />
        <textarea name="ziel" placeholder="Ziel des Projektes" onChange={handleChange} />
      </section>

      {/* 3 ZIELGRUPPE */}
      <section className="reqSection">
        <h2>3. Zielgruppe</h2>

        <textarea name="zielgruppe" placeholder="Zielgruppe" onChange={handleChange} />
      </section>

      {/* 4 PROJEKTUMFANG */}
      <section className="reqSection">
        <h2>4. Projektumfang</h2>

        {[
          "Öffentliche Website",
          "Benutzerbereich",
          "Admin-Dashboard",
          "CRUD",
          "Sonstiges",
        ].map((item) => (
          <label key={item} className="reqCheck">
            <input
              type="checkbox"
              checked={(formData.umfang || []).includes(item)}
              onChange={() => handleCheckbox("umfang", item)}
            />
            {item}
          </label>
        ))}
      </section>

      {/* 5 SEITENSTRUKTUR */}
      <section className="reqSection">
        <h2>5. Seitenstruktur</h2>

        <input name="seite" placeholder="Seite" onChange={handleChange} />
        <input name="beschreibungSeite" placeholder="Beschreibung" onChange={handleChange} />
        <input name="status" placeholder="Status" onChange={handleChange} />
      </section>

      {/* 6 BENUTZERROLLEN */}
      <section className="reqSection">
        <h2>6. Benutzerrollen & Berechtigungen</h2>

        <textarea name="rollen" placeholder="Rollen & Berechtigungen" onChange={handleChange} />
      </section>

      {/* 7 LEISTUNGSUMFANG */}
      <section className="reqSection">
        <h2>7. Leistungsumfang</h2>

        {[
          "UI/UX Design",
          "Frontend",
          "Backend",
          "Datenbank",
          "API",
          "Testing",
          "Deployment",
        ].map((item) => (
          <label key={item} className="reqCheck">
            <input
              type="checkbox"
              checked={(formData.leistung || []).includes(item)}
              onChange={() => handleCheckbox("leistung", item)}
            />
            {item}
          </label>
        ))}
      </section>

      {/* 8 CRUD */}
      <section className="reqSection">
        <h2>8. Funktionale Anforderungen (CRUD)</h2>

        <textarea name="crud" placeholder="CRUD Anforderungen" onChange={handleChange} />
      </section>

      {/* 9 DB */}
      <section className="reqSection">
        <h2>9. Datenbankanforderungen</h2>

        <textarea name="db" placeholder="Datenbank Struktur" onChange={handleChange} />
      </section>

      {/* 10 TECHNIK */}
      <section className="reqSection">
        <h2>10. Technische Anforderungen</h2>

        <input name="frontend" placeholder="Frontend" onChange={handleChange} />
        <input name="backend" placeholder="Backend" onChange={handleChange} />
        <input name="datenbank" placeholder="Datenbank" onChange={handleChange} />
        <input name="hosting" placeholder="Hosting" onChange={handleChange} />
        <input name="apis" placeholder="APIs" onChange={handleChange} />
      </section>

      {/* 11 DESIGN */}
      <section className="reqSection">
        <h2>11. Design</h2>

        {["Modern", "Professionell", "Minimalistisch", "Individuell"].map((item) => (
          <label key={item} className="reqCheck">
            <input
              type="checkbox"
              checked={(formData.design || []).includes(item)}
              onChange={() => handleCheckbox("design", item)}
            />
            {item}
          </label>
        ))}

        <textarea name="designText" placeholder="Farben / Referenzen" onChange={handleChange} />
      </section>

      {/* 12 SICHERHEIT */}
      <section className="reqSection">
        <h2>12. Sicherheit & Datenschutz</h2>

        {[
          "SSL",
          "2FA",
          "Backups",
          "DSGVO",
          "Logging",
        ].map((item) => (
          <label key={item} className="reqCheck">
            <input
              type="checkbox"
              checked={(formData.sicherheit || []).includes(item)}
              onChange={() => handleCheckbox("sicherheit", item)}
            />
            {item}
          </label>
        ))}
      </section>

      {/* 13 INHALTE */}
      <section className="reqSection">
        <h2>13. Inhalte vom Kunden</h2>

        <textarea name="inhalte" placeholder="Logo, Texte, Bilder..." onChange={handleChange} />
      </section>

      {/* 14 PROJEKTGRENZEN */}
      <section className="reqSection">
        <h2>14. Projektgrenzen</h2>

        <textarea name="grenzen" placeholder="Nicht enthaltene Leistungen" onChange={handleChange} />
      </section>

      {/* 15 ABNAHME */}
      <section className="reqSection">
        <h2>15. Abnahme</h2>

        {[
          "Fertiggestellt",
          "Getestet",
          "Abgenommen",
        ].map((item) => (
          <label key={item} className="reqCheck">
            <input
              type="checkbox"
              checked={(formData.abnahme || []).includes(item)}
              onChange={() => handleCheckbox("abnahme", item)}
            />
            {item}
          </label>
        ))}
      </section>

      {/* 16 OFFENE PUNKTE */}
      <section className="reqSection">
        <h2>16. Offene Punkte</h2>

        <input name="thema" placeholder="Thema" onChange={handleChange} />
        <input name="verantwortlich" placeholder="Verantwortlich" onChange={handleChange} />
        <input name="termin" type="date" onChange={handleChange} />
      </section>

      {/* 17 FREIGABE */}
      <section className="reqSection">
        <h2>17. Freigabe</h2>

        <input name="kundeName" placeholder="Kunde Name" onChange={handleChange} />
        <input name="kundeFirma" placeholder="Firma" onChange={handleChange} />
        <input name="tbsName" placeholder="TBS Name" onChange={handleChange} />
        <input name="datumFreigabe" type="date" onChange={handleChange} />
      </section>

      <button type="submit" disabled={loading}>
        {loading ? "Speichert..." : "Projekt speichern"}
      </button>

    </form>
  );
}