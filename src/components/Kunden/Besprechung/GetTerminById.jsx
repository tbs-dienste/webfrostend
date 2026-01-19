import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, 
  FaMapMarkerAlt, FaClipboard, FaCheck, FaTimes 
} from "react-icons/fa";
import "./GetTerminById.scss";

const GetTerminById = () => {
  const { id } = useParams();
  const [termin, setTermin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [popup, setPopup] = useState(null); // "accept" | "reject" | null

  const token = localStorage.getItem("token");

  const getMitarbeiterId = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded.userId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchTermin = async () => {
      try {
        const res = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/beratungstermine/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTermin(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Fehler beim Laden des Termins");
      } finally {
        setLoading(false);
      }
    };
    fetchTermin();
  }, [id, token]);

  const handleAccept = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/beratungstermine/${id}/accept`,
        {}, // kein mitarbeiter_id mehr nötig
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTermin(prev => ({ ...prev, status: "accepted" }));
      setPopup(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Fehler beim Annehmen des Termins");
    } finally {
      setUpdating(false);
    }
  };
  

  const handleReject = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/beratungstermine/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTermin(prev => ({ ...prev, status: "rejected" }));
      setPopup(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Fehler beim Ablehnen des Termins");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="termin-card__status">Lade Termin…</div>;
  if (error) return <div className="termin-card__status termin-card__error">{error}</div>;
  if (!termin) return <div className="termin-card__status">Kein Termin gefunden.</div>;

  return (
    <div className="termin-card">
      <div className="termin-card__header">
        <h2>Beratungstermin #{termin.id}</h2>
        <span className={`termin-card__status-tag ${termin.status}`}>{termin.status.toUpperCase()}</span>
      </div>

      <div className="termin-card__body">
        <div className="termin-card__field"><FaUser /> <strong>Name:</strong> {termin.vorname} {termin.nachname}</div>
        <div className="termin-card__field"><FaEnvelope /> <strong>E-Mail:</strong> {termin.email}</div>
        <div className="termin-card__field"><FaPhone /> <strong>Telefon:</strong> {termin.telefon || "Keine Angabe"}</div>
        <div className="termin-card__field"><FaClipboard /> <strong>Dienstleistung:</strong> {termin.dienstleistung_name}</div>
        <div className="termin-card__field"><FaCalendarAlt /> <strong>Datum:</strong> {termin.datum}</div>
        <div className="termin-card__field"><FaClock /> <strong>Uhrzeit:</strong> {termin.uhrzeit} - {termin.endzeit}</div>
        <div className="termin-card__field"><FaUser /> <strong>Mitarbeiter:</strong> {termin.mitarbeiter_vorname ? `${termin.mitarbeiter_vorname} ${termin.mitarbeiter_nachname}` : "Noch nicht zugewiesen"}</div>
        <div className="termin-card__field"><FaClipboard /> <strong>Terminart:</strong> {termin.termin_art === "vor_ort" ? "Vor Ort" : "Online"}</div>
        {termin.termin_art === "vor_ort" && (
          <div className="termin-card__field"><FaMapMarkerAlt /> <strong>Adresse:</strong> {termin.strasse}, {termin.plz} {termin.ort}</div>
        )}
        {termin.beschreibung && <div className="termin-card__field"><FaClipboard /> <strong>Beschreibung:</strong> {termin.beschreibung}</div>}
      </div>

      {termin.status === "pending" && (
        <div className="termin-card__actions">
          <button className="termin-card__btn accept" onClick={() => setPopup("accept")} disabled={updating}>
            <FaCheck /> Annehmen
          </button>
          <button className="termin-card__btn reject" onClick={() => setPopup("reject")} disabled={updating}>
            <FaTimes /> Ablehnen
          </button>
        </div>
      )}

      {popup && (
        <div className="termin-card__overlay">
          <div className="termin-card__popup">
            <h3>{popup === "accept" ? "Termin annehmen?" : "Termin ablehnen?"}</h3>
            <p>Sind Sie sicher, dass Sie diese Aktion durchführen möchten?</p>
            <div className="termin-card__popup-actions">
              <button onClick={popup === "accept" ? handleAccept : handleReject} disabled={updating}>
                Ja
              </button>
              <button onClick={() => setPopup(null)} disabled={updating}>Nein</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetTerminById;
