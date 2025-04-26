import React, { useState } from "react";
import axios from "axios";
import { FaBarcode, FaBoxOpen, FaTags, FaIndustry, FaCubes, FaDollarSign, FaGift } from "react-icons/fa";
import "./CreateProductForm.scss";

const CreateProductForm = () => {
  const [formData, setFormData] = useState({
    article_short_text: "",
    description: "",
    manufacturer: "",
    category: "",
    min_stock: "",
    max_stock: "",
    reorder_point: "",
    price: "",
    is_voucher: false,
    artikelgruppe: "",
    hauptartikelgruppe: "",
    produktgruppe: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };

      if (name === "min_stock" || name === "max_stock") {
        const minStock = parseInt(updatedForm.min_stock, 10);
        const maxStock = parseInt(updatedForm.max_stock, 10);

        if (!isNaN(minStock) && !isNaN(maxStock) && maxStock > minStock) {
          updatedForm.reorder_point = Math.ceil((minStock + maxStock) / 2);
        } else {
          updatedForm.reorder_point = "";
        }
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const requiredFields = [
      "article_short_text",
      "description",
      "manufacturer",
      "category",
      "min_stock",
      "reorder_point",
      "max_stock",
      "price",
      "is_voucher"
    ];

    for (let field of requiredFields) {
      if (formData[field] === "" || formData[field] === null) {
        setError("Bitte alle Pflichtfelder ausfüllen.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess("✅ Produkt erfolgreich erstellt!");
      setFormData({
        article_short_text: "",
        description: "",
        manufacturer: "",
        category: "",
        min_stock: "",
        reorder_point: "",
        max_stock: "",
        price: "",
        is_voucher: false,
        artikelgruppe: "",
        hauptartikelgruppe: "",
        produktgruppe: ""
      });
    } catch (err) {
      console.error(err);
      setError("❌ Fehler beim Erstellen des Produkts.");
    }
  };

  return (
    <div className="product-form-wrapper">
      <h2>🛒 Neues Produkt erstellen</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-field">
          <label><FaBoxOpen /> Artikel Kurztext*</label>
          <input type="text" name="article_short_text" value={formData.article_short_text} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label><FaTags /> Beschreibung*</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label><FaIndustry /> Hersteller*</label>
          <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label><FaCubes /> Kategorie*</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
        </div>

        <div className="form-inline">
          <div className="form-field">
            <label>📦 Mindestbestand*</label>
            <input type="number" name="min_stock" value={formData.min_stock} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>📦 Maximalbestand*</label>
            <input type="number" name="max_stock" value={formData.max_stock} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>📈 Meldebestand (auto)</label>
            <input type="number" name="reorder_point" value={formData.reorder_point} readOnly />
          </div>
        </div>

        <div className="form-field">
          <label><FaDollarSign /> Preis (CHF)*</label>
          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />
        </div>

        <div className="form-field checkbox-field">
          <label><FaGift /> Gutscheinartikel?</label>
          <input type="checkbox" name="is_voucher" checked={formData.is_voucher} onChange={handleChange} />
        </div>

        {/* Zusätzliche Gruppen */}
        <div className="form-field">
          <label>Artikelgruppe</label>
          <input type="text" name="artikelgruppe" value={formData.artikelgruppe} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>Hauptartikelgruppe</label>
          <input type="text" name="hauptartikelgruppe" value={formData.hauptartikelgruppe} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>Produktgruppe</label>
          <input type="text" name="produktgruppe" value={formData.produktgruppe} onChange={handleChange} />
        </div>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <button type="submit" className="submit-btn">Produkt erstellen</button>
      </form>
    </div>
  );
};

export default CreateProductForm;
