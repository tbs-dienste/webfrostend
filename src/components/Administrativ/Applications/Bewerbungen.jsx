import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEye, FaClipboardList } from "react-icons/fa";
import "./Bewerbungen.scss";
import axios from "axios";

const Bewerbungen = () => {
  const [bewerbungen, setBewerbungen] = useState([]);

  useEffect(() => {
    axios.get("/api/bewerbungen").then((response) => {
      setBewerbungen(response.data.data);
    });
  }, []);

  return (
    <div className="bewerbungen-container">
      {bewerbungen.map((bewerbung) => (
        <div className="bewerbung-box" key={bewerbung.id}>
          <div className="bewerbung-header">
            <h2>Bewerbung von {bewerbung.vorname} {bewerbung.name}</h2>
            <span className={`status ${bewerbung.is_viewed ? 'gelesen' : 'ungelesen'}`}>
              {bewerbung.is_viewed ? "Gelesen" : "Ungelesen"}
            </span>
          </div>
          <div className="bewerbung-info">
            <p className="bewerbung-detail"><FaUser className="icon" /> Name: {bewerbung.vorname} {bewerbung.name}</p>
            <p className="bewerbung-detail"><FaEnvelope className="icon" /> Email: {bewerbung.email}</p>
            <p className="bewerbung-detail"><FaPhone className="icon" /> Mobil: {bewerbung.mobil}</p>
            <p className="bewerbung-detail"><FaCalendarAlt className="icon" /> Geburtsdatum: {bewerbung.geburtsdatum}</p>
            <p className="bewerbung-detail"><FaClipboardList className="icon" /> Berufserfahrung: {bewerbung.berufserfahrung}</p>
            <p className="bewerbung-detail"><FaClipboardList className="icon" /> Schule: {bewerbung.schule}</p>
            <p className="bewerbung-detail"><FaClipboardList className="icon" /> Ausbildung: {bewerbung.ausbildung}</p>
            <p className="bewerbung-detail"><FaClipboardList className="icon" /> Sprachen: {bewerbung.sprachen}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bewerbungen;
