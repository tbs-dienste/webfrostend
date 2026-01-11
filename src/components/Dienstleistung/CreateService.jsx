import React, { useState } from "react";
import axios from "axios";
import "./CreateService.scss";

const CreateService = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preis, setPreis] = useState("");
  const [farbe, setFarbe] = useState("");
  const [status, setStatus] = useState("entwurf");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Datei auswählen & Vorschau erzeugen
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl("");
    }
  };

  // Formular absenden
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Kein Token gefunden. Bitte anmelden.");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("preis", preis);
      formData.append("farbe", farbe);
      formData.append("status", status);
      if (file) formData.append("file", file);

      await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("✅ Dienstleistung erfolgreich erstellt!");
      setTitle("");
      setDescription("");
      setPreis("");
      setFarbe("");
      setStatus("entwurf");
      setFile(null);
      setPreviewUrl("");

      setTimeout(() => window.location.href = "/dienstleistungen", 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("❌ Fehler beim Erstellen der Dienstleistung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h1>Dienstleistung erstellen</h1>
      <form className="create-service-form" onSubmit={handleSubmit}>
        <label>
          <span>Titel</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel eingeben"
            required
          />
        </label>

        <label>
          <span>Beschreibung</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung der Dienstleistung"
            required
          />
        </label>

        <label>
          <span>Preis (€)</span>
          <input
            type="number"
            value={preis}
            onChange={(e) => setPreis(e.target.value)}
            placeholder="z.B. 99.99"
            min="0"
            required
          />
        </label>

        <label>
          <span>Farbe (optional)</span>
          <input
            type="text"
            value={farbe}
            onChange={(e) => setFarbe(e.target.value)}
            placeholder="z.B. #004aad"
          />
        </label>

        <label>
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="entwurf">Entwurf</option>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>
        </label>

        <label>
          <span>Bild hochladen</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>

        {previewUrl && (
          <div className="preview-container">
            <p>📷 Vorschau:</p>
            <img src={previewUrl} alt="Vorschau" />
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Wird erstellt..." : "Dienstleistung erstellen"}
          </button>
        </div>

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default CreateService;
