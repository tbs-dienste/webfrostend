import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ArtikelDetail.scss';

const ArtikelDetail = () => {
  const { article_number } = useParams(); // Hole die article_number aus der URL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  const apiUrl = 'https://tbsdigitalsolutionsbackend.onrender.com/api/kasse/'; // API-URL

  const fetchProductDetail = async () => {
    try {
      const response = await axios.get(`${apiUrl}/${article_number}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Falls Auth nötig
        },
      });

      setSelectedProduct(response.data.data); // Setze das Produkt
      setError('');
    } catch (err) {
      console.error('Fehler beim Abrufen des Produkts:', err);
      setError(err.response?.data?.error || 'Fehler beim Abrufen des Produkts');
    }
  };

  useEffect(() => {
    if (article_number) {
      fetchProductDetail();
    }
  }, [article_number]);

  return (
    <div className="artikel-anzeige">
      {error && <div className="error">{error}</div>}

      {selectedProduct ? (
        <div className="produkt-item">
          <div className="produkt-info">
            <span>Artikel-Nr. {selectedProduct.article_number}</span>
            <span>Artikelbezeichnung: {selectedProduct.article_short_text}</span>
            <h2>Aktueller Preis CHF {selectedProduct.price}</h2>
            <span>Preislisten Nr. {selectedProduct.preislisten_nr}</span>
            <span>Gültig ab: {new Date(selectedProduct.gueltig_ab).toLocaleDateString()}</span>
            <span>Gültig bis: {new Date(selectedProduct.gueltig_bis).toLocaleDateString()}</span>
            <span>MWST. %satz {selectedProduct.mwst_satz}</span>
            <span>Rabatt Pos / Bon: {selectedProduct.rabatt_pos} / {selectedProduct.rabatt_bon}</span>
            <span>Preisbestätigung: {selectedProduct.preisbestaetigung === 1 ? 'Ja' : 'Nein'}</span>
            <span>Barcode: {selectedProduct.barcode}</span>
            <span>Beschreibung: {selectedProduct.description}</span>
            <span>Kategorie: {selectedProduct.category}</span>
            <span>Hersteller: {selectedProduct.manufacturer}</span>
            <span>Verpackt: {selectedProduct.verpackt === 1 ? 'Ja' : 'Nein'}</span>
            <span>Seriennummer: {selectedProduct.seriennummer === 1 ? 'Ja' : 'Nein'}</span>
            <span>Aktueller Bestand: {selectedProduct.current_stock}</span>
            <span>Minimaler Bestand: {selectedProduct.min_stock}</span>
            <span>Bestellpunkt: {selectedProduct.reorder_point}</span>
            <span>Maximaler Bestand: {selectedProduct.max_stock}</span>
          </div>
        </div>
      ) : (
        <p>Kein Produkt gefunden.</p>
      )}
    </div>
  );
};

export default ArtikelDetail;
