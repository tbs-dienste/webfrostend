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

        setService(res.data || res.data.data); // Backend liefert entweder res.data oder res.data.data
        setEditData(res.data || res.data.data);
      } catch {
        setStatus({ type: "error", text: "Dienstleistung nicht gefunden." });
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  // Änderungen im Formular
  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  // Speichern der Änderungen
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung/${id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setService(editData);
      setEditing(false);
      setStatus({ type: "success", text: "Erfolgreich gespeichert." });
    } catch {
      setStatus({ type: "error", text: "Speichern fehlgeschlagen." });
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
          <span className="price">{service.preis} €</span>
        </div>
      </section>

      {/* CONTENT */}
      <section className="service-content">
        {service.bild && (
          <div className="image-wrapper">
            <img
              src={`data:image/png;base64,${service.bild}`}
              alt={service.title}
            />
          </div>
        )}

        {status.text && (
          <div className={`status ${status.type}`}>{status.text}</div>
        )}

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
            <input
              name="farbe"
              value={editData.farbe || ""}
              onChange={handleChange}
              placeholder="Farbe"
            />

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
