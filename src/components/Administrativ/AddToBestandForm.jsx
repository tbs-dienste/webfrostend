import { useState, useEffect } from "react";
import axios from "axios";
import { FaBoxOpen, FaPlusCircle } from "react-icons/fa";
import "./AddToBestandForm.scss";

function AddToBestandForm({ onKassenModusChange }) {
  const [articleNumber, setArticleNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    onKassenModusChange?.(true);
    return () => onKassenModusChange?.(false);
  }, [onKassenModusChange]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/add-to-bestand",
        {
          article_number: articleNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setMessage(response.data.message);
      setArticleNumber("");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unbekannter Fehler beim Aktualisieren des Bestands.");
      }
    }
  };
  
  

  return (
    <div className="add-stock-container">
      <div className="add-stock-card">
        <h2><FaBoxOpen /> Bestand erhöhen</h2>
        <form onSubmit={handleAdd}>
          <div className="input-group">
            <label htmlFor="articleNumber">Artikelnummer</label>
            <input
              id="articleNumber"
              type="text"
              value={articleNumber}
              onChange={(e) => setArticleNumber(e.target.value)}
              placeholder="z. B. 12345678"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            <FaPlusCircle /> +1 zum Bestand
          </button>
        </form>
        {message && <p className="feedback success">{message}</p>}
        {error && <p className="feedback error">{error}</p>}
      </div>
    </div>
  );
}

export default AddToBestandForm;
