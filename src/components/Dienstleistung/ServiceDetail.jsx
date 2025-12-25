import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "./ServiceDetail.scss";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [editData, setEditData] = useState({});
  const [editing, setEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

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

        setService(res.data.data);
        setEditData(res.data.data);
      } catch {
        setStatus({ type: "error", text: "Dienstleistung nicht gefunden." });
      }
    };

    loadService();
  }, [id]);

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

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

  if (!service) return null;

  return (
    <main className="service-detail">
      <section className="service-hero">
        <div className="hero-content">
          <h1>{service.title}</h1>
          <span className="price">{service.preis} CHF / Stunde</span>
        </div>
      </section>

      <section className="service-content">
        {service.img && (
          <div className="image-wrapper">
            <img src={service.img} alt={service.title} />
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
              name="img"
              value={editData.img}
              onChange={handleChange}
              placeholder="Bild URL"
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
