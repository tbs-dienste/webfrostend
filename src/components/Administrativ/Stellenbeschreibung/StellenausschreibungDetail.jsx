import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // useParams importieren
import "./StellenausschreibungDetail.scss";

const StellenausschreibungDetail = () => {
  const { stellenId } = useParams(); // Stellen-ID aus der URL extrahieren
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
      .get(`https://tbsdigitalsolutionsbackend.onrender.com/api/stellen/${stellenId}`) // API-Call mit Stellen-ID
      .then((response) => {
        setStellen(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [stellenId]);

  const handleBewerbungChange = (e) => {
    const { name, value } = e.target;
    setBewerbung({ ...bewerbung, [name]: value });
  };

  const handleFileChange = (e) => {
    setBewerbung({ ...bewerbung, lebenslauf: e.target.files[0] });
  };

  const handleSubmitBewerbung = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", bewerbung.name);
    formData.append("email", bewerbung.email);
    formData.append("lebenslauf", bewerbung.lebenslauf);
    formData.append("vorname", bewerbung.vorname);
    formData.append("mobil", bewerbung.mobil);
    formData.append("geburtsdatum", bewerbung.geburtsdatum);
    formData.append("plz", bewerbung.plz);
    formData.append("ort", bewerbung.ort);
    formData.append("berufserfahrung", bewerbung.berufserfahrung);
    formData.append("schule", bewerbung.schule);
    formData.append("ausbildung", bewerbung.ausbildung);
    formData.append("sprachen", bewerbung.sprachen);

    try {
      const response = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/bewerbung",
        formData
      );
      setBewerbungStatus("Bewerbung erfolgreich eingereicht!");
      setTimeout(() => setBewerbungStatus(null), 5000); // Status nach 5 Sekunden zurücksetzen
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Fehler bei der Bewerbungseinreichung.";
      setBewerbungStatus(errorMessage);
      setTimeout(() => setBewerbungStatus(null), 5000); // Status nach 5 Sekunden zurücksetzen
    }
  };


  const toggleBewerbung = () => {
    setShowBewerbung(!showBewerbung);
  };

  if (loading) return <p className="loading">Lade Stellenanzeige...</p>;
  if (error) return <p className="error">Fehler: {error}</p>;

  return (
    <div className="stellen-detail-container">
      <h2 className="title">{stellen.stellen.bezeichnung}</h2>
      <p className="status">Status: {stellen.stellen.status}</p>

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
        { key: "stellen_aufgaben", title: "Aufgaben" }, // Korrektur hier
        { key: "kompetenzen", title: "Kompetenzen" },
        { key: "verantwortlichkeiten", title: "Verantwortlichkeiten" },
        { key: "anforderungen", title: "Anforderungen" },
      ].map(({ key, title }) => (
        <div key={key} className="stellen-section">
          <h3>{title}</h3>
          <table className="stellen-table">
            <tbody>
              {stellen[key]?.map((item) => (
                <tr key={item.id}>
                  <td>{item.wert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}


      {/* Bewerbungsformular mit ausklappbarem Pfeil */}
      <div className="bewerbung-toggle" onClick={toggleBewerbung}>
        <span className="arrow">{showBewerbung ? "▲" : "▼"}</span>
        <h3>Jetzt Bewerben</h3>
      </div>

      {showBewerbung && (
        <div className="bewerbung-form-container">
          <form onSubmit={handleSubmitBewerbung}>
            <div className="form-group">
              <label htmlFor="vorname">Vorname:</label>
              <input
                type="text"
                id="vorname"
                name="vorname"
                value={bewerbung.vorname}
                onChange={handleBewerbungChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={bewerbung.name}
                onChange={handleBewerbungChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-Mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={bewerbung.email}
                onChange={handleBewerbungChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobil">Mobilnummer:</label>
              <input
                type="tel"
                id="mobil"
                name="mobil"
                value={bewerbung.mobil}
                onChange={handleBewerbungChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="geburtsdatum">Geburtsdatum:</label>
              <input
                type="date"
                id="geburtsdatum"
                name="geburtsdatum"
                value={bewerbung.geburtsdatum}
                onChange={handleBewerbungChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="plz">PLZ:</label>
              <input
                type="text"
                id="plz"
                name="plz"
                value={bewerbung.plz}
                onChange={handleBewerbungChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ort">Ort:</label>
              <input
                type="text"
                id="ort"
                name="ort"
                value={bewerbung.ort}
                onChange={handleBewerbungChange}
                required
              />
            </div>

            {/* Berufserfahrung */}
            <div className="form-group">
              <label htmlFor="berufserfahrung">Berufserfahrung:</label>
              <textarea
                id="berufserfahrung"
                name="berufserfahrung"
                value={bewerbung.berufserfahrung}
                onChange={handleBewerbungChange}
                required
              />
            </div>

            {/* Schule unter Berufserfahrung */}
            <div className="form-group">
              <label htmlFor="schule">Schule:</label>
              <input
                type="text"
                id="schule"
                name="schule"
                value={bewerbung.schule}
                onChange={handleBewerbungChange}
                required
              />
            </div>

            {/* Ausbildung */}
            <div className="form-group">
              <label htmlFor="ausbildung">Ausbildung:</label>
              <textarea
                id="ausbildung"
                name="ausbildung"
                value={bewerbung.ausbildung}
                onChange={handleBewerbungChange}
                required
              />
            </div>

            {/* Sprachkenntnisse */}
            <div className="form-group">
              <label htmlFor="sprachen">Sprachkenntnisse:</label>
              <input
                type="text"
                id="sprachen"
                name="sprachen"
                value={bewerbung.sprachen}
                onChange={handleBewerbungChange}
                required
              />
            </div>

            <button type="submit" className="bewerben-button">
              Bewerben
            </button>
          </form>
          {bewerbungStatus && <p className="bewerbung-status">{bewerbungStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default StellenausschreibungDetail;
