import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "./ServiceDetail.scss";
import Loading from "../Loading/Loading";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [editData, setEditData] = useState({});
  const [editing, setEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  // Dienstleistung laden
  useEffect(() => {
    const loadService = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setIsAdmin(decoded.userType === "admin");
        }

        const res = await axios.get(
          `https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`
        );

        const data = res.data.data || res.data;
        setService(data);
        setEditData(data);
      } catch {
        setStatus({ type: "error", text: "Dienstleistung nicht gefunden." });
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  // Änderungen im Formular
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditData({ ...editData, file: files[0] });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  // Speichern der Änderungen
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Alle Felder hinzufügen
      Object.entries(editData).forEach(([key, value]) => {
        if (key !== "file") formData.append(key, value);
      });

      // Bild hinzufügen
      if (editData.file) {
        formData.append("bild", editData.file);
      }

      const res = await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setService({ ...editData, bild: editData.file ? service.bild : service.bild });
      setEditing(false);
      setStatus({ type: "success", text: res.data.message || "Erfolgreich gespeichert." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err.response?.data?.error || "Speichern fehlgeschlagen." });
    }
  };

  // Löschen
  const handleDelete = async () => {
    if (!window.confirm("Dienstleistung wirklich löschen?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dienstleistungen");
    } catch {
      setStatus({ type: "error", text: "Löschen fehlgeschlagen." });
    }
  };

  if (loading) return <Loading />;
  if (!service) return <p>Dienstleistung konnte nicht geladen werden.</p>;

  return (
    <main className="service-detail">
      {/* HERO */}
      <section className="service-hero">
        <div className="hero-content">
          <h1>{service.title}</h1>
          <span className="price">{service.preis} CHF</span>
        </div>
      </section>

      {/* CONTENT */}
      <section className="service-content">
        {service.bild && (
          <div className="image-wrapper">
            <img src={`data:image/png;base64,${service.bild}`} alt={service.title} />
          </div>
        )}

        {status.text && <div className={`status ${status.type}`}>{status.text}</div>}

        {editing ? (
          <div className="edit-card">
            <input
              name="title"
              value={editData.title}
              onChange={handleChange}
              placeholder="Titel"
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              placeholder="Beschreibung"
            />
            <input
              name="preis"
              type="number"
              value={editData.preis}
              onChange={handleChange}
              placeholder="Preis"
            />

            {/* Farbpicker */}
            <label>Farbe wählen:</label>
            <input
              type="color"
              name="farbe"
              value={editData.farbe || "#000000"}
              onChange={handleChange}
            />

            {/* Status */}
            <select name="status" value={editData.status} onChange={handleChange}>
              <option value="entwurf">Entwurf</option>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>

            {/* Bild */}
            <input type="file" accept="image/*" onChange={handleChange} />

            <div className="actions">
              <button className="save" onClick={handleSave}>
                Speichern
              </button>
              <button className="cancel" onClick={() => setEditing(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="description">{service.description}</p>

            {isAdmin && (
              <div className="admin-actions">
                <button onClick={() => setEditing(true)}>
                  <FaEdit /> Bearbeiten
                </button>
                <button className="danger" onClick={handleDelete}>
                  <FaTrash /> Löschen
                </button>
              </div>
            )}
          </>
        )}

        <Link to="/dienstleistungen" className="back-link">
          <FaArrowLeft /> Zurück zu Dienstleistungen
        </Link>
      </section>
    </main>
  );
};

export default ServiceDetail;
