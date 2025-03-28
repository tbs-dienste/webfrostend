import React, { useEffect, useState } from "react";
import { FaBuilding, FaUsers, FaEye, FaClipboardList } from "react-icons/fa";
import "./AllBewerbungen.scss";
import axios from "axios";

const AllBewerbungen = () => {
  const [bewerbungen, setBewerbungen] = useState([]);

  useEffect(() => {
    // Holen des Bearer Tokens aus dem localStorage
    const token = localStorage.getItem("token");

    // Überprüfen, ob das Token vorhanden ist
    if (token) {
        axios
        .get("https://tbsdigitalsolutionsbackend.onrender.com/api/bewerbungen", {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer Token im Header
          },
        })
        .then((response) => {
          setBewerbungen(response.data.data);
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen der Bewerbungen:", error);
        });
      
    } else {
      console.error("Kein Token gefunden!");
    }
  }, []);

  return (
    <div className="bewerbungen-container">
      {bewerbungen.map((bewerbung) => (
        <div className="bewerbung-box" key={bewerbung.bewerbung_id}>
          <div className="bewerbung-header">
            <h2>{bewerbung.bezeichnung}</h2>
            <span className={`status ${bewerbung.status}`}>{bewerbung.status}</span>
          </div>
          <div className="bewerbung-info">
            <p className="bewerbung-detail"><FaBuilding className="icon" /> Abteilung: {bewerbung.abteilung}</p>
            <p className="bewerbung-detail"><FaClipboardList className="icon" /> Bewerbungen: {bewerbung.bewerbungen_count}</p>
            <p className="bewerbung-detail"><FaEye className="icon" /> Ungelesene: {bewerbung.ungelesene_bewerbungen}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllBewerbungen;
