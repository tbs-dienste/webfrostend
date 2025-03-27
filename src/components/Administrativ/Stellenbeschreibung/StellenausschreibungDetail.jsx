import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; 
import "./StellenausschreibungDetail.scss";

const StellenausschreibungDetail = () => {
  const { stellenId } = useParams();
  const [stellen, setStellen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bewerbung, setBewerbung] = useState({
    vorname: "",
    name: "",
    email: "",
    mobil: "",
    geburtsdatum: "",
    plz: "",
    ort: "",
    berufserfahrung: "",
    schule: "",
    ausbildung: "",
    sprachen: "",
  });

  const [bewerbungStatus, setBewerbungStatus] = useState(null);
  const [showBewerbung, setShowBewerbung] = useState(false);

  useEffect(() => {
    axios
      .get("https://tbsdigitalsolutionsbackend.onrender.com/api/stellen/3")
      .then((response) => {
        setStellen(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);


  const handleBewerbungChange = (e) => {
    const { name, value } = e.target;
    setBewerbung((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmitBewerbung = async (e) => {
    e.preventDefault();
  
    try {
      await axios.post(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/bewerbungen/${stellenId}`,
        bewerbung,  // JSON senden statt FormData
        { headers: { "Content-Type": "application/json" } }
      );
      setBewerbungStatus("Bewerbung erfolgreich eingereicht!");
    } catch (error) {
      setBewerbungStatus("Fehler bei der Bewerbungseinreichung.");
    } finally {
      setTimeout(() => setBewerbungStatus(null), 5000);
    }
  };
  

  if (loading) return <p className="loading">Lade Stellenanzeige...</p>;
  if (error) return <p className="error">Fehler: {error}</p>;

  return (
    <div className="stellen-detail-container">
      <h2 className="title">{stellen?.bezeichnung}</h2>
      <p className="status">Status: {stellen?.status}</p>

      <table className="stellen-table">
        <tbody>
          <tr>
            <td>Vorgesetzter:</td>
            <td>{stellen.stellen.vorgesetzter}</td>
          </tr>
          <tr>
            <td>Startdatum:</td>
            <td>{new Date(stellen.stellen.start_datum).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td>Arbeitszeit:</td>
            <td>{stellen.stellen.arbeitszeit_prozent}%</td>
          </tr>
        </tbody>
      </table>

      {[
        { key: "vertretung", title: "Vertretung" },
        { key: "stellen_aufgaben", title: "Aufgaben" },
        { key: "kompetenzen", title: "Kompetenzen" },
        { key: "verantwortlichkeiten", title: "Verantwortlichkeiten" },
        { key: "anforderungen", title: "Anforderungen" },
      ].map(({ key, title }) =>
        stellen[key]?.length ? (
          <div key={key} className="stellen-section">
            <h3>{title}</h3>
            <ul>
              {stellen[key].map((item) => (
                <li key={item.id}>{item.wert}</li>
              ))}
            </ul>
          </div>
        ) : null
      )}

      <div className="bewerbung-toggle" onClick={() => setShowBewerbung(!showBewerbung)}>
        <span className="arrow">{showBewerbung ? "▲" : "▼"}</span>
        <h3>Jetzt Bewerben</h3>
      </div>

      {showBewerbung && (
        <div className="bewerbung-form-container">
          <form onSubmit={handleSubmitBewerbung}>
            {["vorname", "name", "email", "mobil", "geburtsdatum", "plz", "ort", "berufserfahrung", "schule", "ausbildung", "sprachen"].map((field) => (
              <div key={field} className="form-group">
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type={field === "geburtsdatum" ? "date" : "text"}
                  id={field}
                  name={field}
                  value={bewerbung[field]}
                  onChange={handleBewerbungChange}
                  required
                />
              </div>
            ))}

          

            <button type="submit" className="bewerben-button">Bewerben</button>
          </form>
          {bewerbungStatus && <p className="bewerbung-status">{bewerbungStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default StellenausschreibungDetail;
