import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GutscheinDetail.scss"; // SCSS für professionelles Styling

const GutscheinDetail = ({ id }) => {
  const [gutschein, setGutschein] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGutschein = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/gutscheine/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGutschein(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Fehler beim Abrufen des Gutscheins:", err);
        setError(err.response?.data?.message || "Fehler beim Laden.");
      } finally {
        setLoading(false);
      }
    };

    fetchGutschein();
  }, [id]);

  if (loading) return <p className="loading">Lade Gutschein...</p>;
  if (error) return <p className="error">Fehler: {error}</p>;

  return (
    <div className="gutschein-detail">
      <h2>Gutschein Details</h2>
      <p>
        <strong>ID:</strong> {gutschein.id}
      </p>
      <p>
        <strong>Guthaben:</strong> {gutschein.guthaben} €
      </p>
      <p>
        <strong>Gültig bis:</strong> {gutschein.gueltigBis}
      </p>
      <p>
        <strong>Gutscheincode:</strong> {gutschein.gutscheincode}
      </p>
      <p>
        <strong>Rabatt:</strong> {gutschein.gutscheinrabatt * 100} %
      </p>
      <p>
        <strong>Aktiviert:</strong> {gutschein.gutscheinaktiviert ? "Ja" : "Nein"}
      </p>
    </div>
  );
};

export default GutscheinDetail;
