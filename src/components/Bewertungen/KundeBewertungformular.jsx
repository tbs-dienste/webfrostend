import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import "./KundeBewertungformular.scss";

const FIELDS = {
  arbeitsqualitaet: "Arbeitsqualität",
  tempo: "Tempo",
  freundlichkeit: "Freundlichkeit",
  zufriedenheit: "Zufriedenheit",
  kommunikation: "Kommunikation",
  zuverlaessigkeit: "Zuverlässigkeit",
  professionalitaet: "Professionalität",
};

const KundeBewertungformular = () => {
  const { kundennummer } = useParams();

  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [index, setIndex] = useState(0);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${kundennummer}/dienstleistungen`
        );

        const list = res.data.data || [];
        setDienstleistungen(list);

        setForms(
          list.map(() => {
            const obj = {};
            Object.keys(FIELDS).forEach((f) => {
              obj[f] = "";
              obj[`${f}_rating`] = 0;
            });
            obj.gesamtrating = 0;
            obj.gesamttext = "";
            return obj;
          })
        );
      } catch (err) {
        setError("Dienstleistungen konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [kundennummer]);

  if (loading) {
    return <div className="kb-loading">Bewertungen werden geladen…</div>;
  }

  if (dienstleistungen.length === 0) {
    return <div className="kb-empty">Keine Dienstleistungen gefunden.</div>;
  }

  if (done) {
    return (
      <div className="kb-success">
        <h2>Vielen Dank! 🎉</h2>
        <p>Ihre Bewertungen wurden erfolgreich übermittelt.</p>
      </div>
    );
  }

  const service = dienstleistungen[index];
  const values = forms[index];

  const updateValue = (name, value) => {
    setForms((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [name]: value };
      return copy;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    for (const f of Object.keys(FIELDS)) {
      if (!values[`${f}_rating`]) {
        return setError("Bitte alle Kategorien bewerten.");
      }
    }

    if (!values.gesamtrating || !values.gesamttext.trim()) {
      return setError("Gesamtbewertung und Kommentar sind erforderlich.");
    }

    try {
      await axios.post(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${kundennummer}`,
        {
          dienstleistung_id: service.id,
          ...values,
        }
      );

      index < dienstleistungen.length - 1
        ? setIndex(index + 1)
        : setDone(true);
    } catch (err) {
      setError("Fehler beim Speichern der Bewertung.");
    }
  };

  return (
    <main className="kb-page">
      <header className="kb-header">
        <h1>Bewertung abgeben</h1>
        <p>{service.name || service.title}</p>
      </header>

      <form className="kb-form" onSubmit={submit}>
        {Object.entries(FIELDS).map(([key, label]) => (
          <section className="kb-block" key={key}>
            <div className="kb-block-header">
              <span>{label}</span>
              <ReactStars
                count={5}
                value={values[`${key}_rating`]}
                onChange={(r) => updateValue(`${key}_rating`, r)}
                size={28}
                isHalf
                activeColor="#fbbf24"
              />
            </div>

            <textarea
              placeholder={`Ihre Meinung zu ${label}`}
              value={values[key]}
              onChange={(e) => updateValue(key, e.target.value)}
            />
          </section>
        ))}

        <section className="kb-total">
          <h3>Gesamtbewertung</h3>
          <ReactStars
            count={5}
            value={values.gesamtrating}
            onChange={(r) => updateValue("gesamtrating", r)}
            size={38}
            isHalf
            activeColor="#f97316"
          />

          <textarea
            placeholder="Ihr Gesamtfazit"
            value={values.gesamttext}
            onChange={(e) => updateValue("gesamttext", e.target.value)}
          />
        </section>

        {error && <div className="kb-error">{error}</div>}

        <button className="kb-submit">
          {index < dienstleistungen.length - 1
            ? "Nächste Dienstleistung"
            : "Bewertung absenden"}
        </button>
      </form>
    </main>
  );
};

export default KundeBewertungformular;
