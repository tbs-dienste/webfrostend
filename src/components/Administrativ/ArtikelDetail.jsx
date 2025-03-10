import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ArtikelDetail.scss';

const ArtikelDetail = () => {
  const { article_number } = useParams();  // Abrufen der 'article_number' aus der URL
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = 'https://tbsdigitalsolutionsbackend.onrender.com/api/kasse';  // Dein API-Endpoint

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      console.log(`Fetching product with article number: ${article_number}`);  // Ausgabe der Artikelnummer
      const response = await axios.get(`${apiUrl}/${article_number}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('API Response:', response.data);  // Ausgabe der gesamten API-Antwort

      if (response.data && response.data.data) {
        setProductDetails(response.data.data);
        setError('');
      } else {
        setError('Produkt nicht gefunden');
      }
    } catch (err) {
      console.error('Fehler beim Abrufen des Produkts:', err);
      setError(err.response?.data?.error || 'Fehler beim Abrufen des Produkts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (article_number) {
      fetchProductDetail();  // API-Abfrage nur, wenn 'article_number' vorhanden ist
    }
  }, [article_number]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('de-CH');
  };

  const formatBoolean = (value) => (value === 1 ? 'Ja' : 'Nein');

  if (loading) return <div className="artikel-anzeige">Lade Daten...</div>;

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('de-CH', { style: 'currency', currency: 'CHF' });
  };

  return (
    <div className="artikel-anzeige">
      {error && <div className="error">{error}</div>}

      {productDetails ? (
        <div className="produkt-item">
          <div className="produkt-info">
            <div className="left-column">
              <span><strong>Artikel-Nr.</strong> <span className="box-value">{productDetails.article_number}</span></span>
              <span><strong>Artikelbezeichnung</strong> <span className="box-value">{productDetails.article_short_text}</span></span>
              <h2 className='detail'>Aktueller Preis <span className="box-value">{formatCurrency(productDetails.price)}</span></h2>

              <span><strong>Preislisten Nr.</strong> <span className="box-value">{productDetails.preislisten_nr}</span></span>
              <span><strong>Gültig ab</strong> <span className="box-value">{formatDate(productDetails.gueltig_ab)}</span></span>
              <span><strong>Gültig bis</strong> <span className="box-value">{formatDate(productDetails.gueltig_bis)}</span></span>
            </div>

            <div className="right-column">
              <span><strong>MWST-Satz</strong> <span className="box-value">{parseFloat(productDetails.mwst_satz).toFixed(2)}%</span></span>
              <span><strong>Rabatt Pos / Bon</strong> <span className="box-value">{formatBoolean(productDetails.rabatt_pos)}</span> / <span className="box-value">{formatBoolean(productDetails.rabatt_bon)}</span></span>
              <span><strong>Preisbestätigung</strong> <span className="box-value">{formatBoolean(productDetails.preisbestaetigung)}</span></span>

              <span><strong>Barcode</strong> <span className="box-value">{productDetails.barcode}</span></span>
              <span><strong>Beschreibung</strong> <span className="box-value">{productDetails.description}</span></span>
            </div>
          </div>

          <div className="produkt-info">
            <div className="left-column">
              <span><strong>Aktueller Bestand</strong> <span className="box-value">{productDetails.current_stock}</span></span>
              <span><strong>Minimaler Bestand</strong> <span className="box-value">{productDetails.min_stock}</span></span>
              <span><strong>Maximaler Bestand</strong> <span className="box-value">{productDetails.max_stock}</span></span>
            </div>

            <div className="right-column">
              <span><strong>Hersteller</strong> <span className="box-value">{productDetails.manufacturer}</span></span>
              <span><strong>Kategorie</strong> <span className="box-value">{productDetails.category}</span></span>
              <span><strong>Artikelgruppe</strong> <span className="box-value">{productDetails.artikelgruppe}</span></span>
              <span><strong>Artikelgruppen-Nummer</strong> <span className="box-value">{productDetails.artikelgruppe_nummer}</span></span>
              <span><strong>Hauptartikelgruppe</strong> <span className="box-value">{productDetails.hauptartikelgruppe}</span></span>
              <span><strong>Hauptartikelnummer</strong> <span className="box-value">{productDetails.hauptartikelnummer}</span></span>
              <span><strong>Produktgruppe</strong> <span className="box-value">{productDetails.produktgruppe}</span></span>
              <span><strong>Produktgruppen-Nummer</strong> <span className="box-value">{productDetails.produktgruppe_nummer}</span></span>
              <span><strong>Hauptaktivität</strong> <span className="box-value">{productDetails.hauptaktivitaet}</span></span>

              <span><strong>Verpackt</strong> <span className="box-value">{formatBoolean(productDetails.verpackt)}</span></span>
              <span><strong>Seriennummer</strong> <span className="box-value">{formatBoolean(productDetails.seriennummer)}</span></span>
            </div>
          </div>
        </div>
      ) : (
        <p>Kein Produkt gefunden.</p>
      )}
    </div>
  );
};

export default ArtikelDetail;
