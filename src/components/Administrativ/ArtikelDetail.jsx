import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ArtikelDetail.scss';

const ArtikelDetail = ({ onKassenModusChange }) => {
  const { article_number } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = 'https://tbsdigitalsolutionsbackend.onrender.com/api/kasse';

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      console.log(`Fetching product with article number: ${article_number}`);
      const response = await axios.get(`${apiUrl}/${article_number}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('API Response:', response.data);

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
      fetchProductDetail();
    }
  }, [article_number]);

  useEffect(() => {

    onKassenModusChange(true);
    return () => {
      onKassenModusChange(false);
    };
  }, [onKassenModusChange]);


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
          <div className="product-details-container">
            <div className="product-details-left">
              <table className="product-details-table">
                <tbody>
                  <tr>
                    <td><strong>Artikel-Nr.</strong></td>
                    <td>{productDetails.article_number}</td>
                  </tr>
                  <tr>
                    <td><strong>Artikelbezeichnung</strong></td>
                    <td>{productDetails.article_short_text}</td>
                  </tr>
                  <tr>
                    <td><strong>Aktueller Preis</strong></td>
                    <td>{formatCurrency(productDetails.price)}</td>
                  </tr>
                  <tr>
                    <td><strong>Preislisten Nr.</strong></td>
                    <td>{productDetails.preislisten_nr}</td>
                  </tr>
                  <tr>
                    <td><strong>Gültig ab</strong></td>
                    <td>{formatDate(productDetails.gueltig_ab)}</td>
                  </tr>
                  <tr>
                    <td><strong>Gültig bis</strong></td>
                    <td>{formatDate(productDetails.gueltig_bis)}</td>
                  </tr>
                  <tr>
                    <td><strong>MWST-Satz</strong></td>
                    <td>{parseFloat(productDetails.mwst_satz).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td><strong>Rabatt Pos / Bon</strong></td>
                    <td>{formatBoolean(productDetails.rabatt_pos)} / {formatBoolean(productDetails.rabatt_bon)}</td>
                  </tr>
                  <tr>
                    <td><strong>Preisbestätigung</strong></td>
                    <td>{formatBoolean(productDetails.preisbestaetigung)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="product-details-right">
              <table className="product-details-table">
                <tbody>
                  <tr>
                    <td><strong>Barcode</strong></td>
                    <td>{productDetails.barcode}</td>
                  </tr>
                  <tr>
                    <td><strong>Beschreibung</strong></td>
                    <td>{productDetails.description}</td>
                  </tr>
                  <tr>
                    <td><strong>Aktueller Bestand</strong></td>
                    <td>{productDetails.current_stock}</td>
                  </tr>
                  <tr>
                    <td><strong>Minimaler Bestand</strong></td>
                    <td>{productDetails.min_stock}</td>
                  </tr>
                  <tr>
                    <td><strong>Maximaler Bestand</strong></td>
                    <td>{productDetails.max_stock}</td>
                  </tr>
                  <tr>
                    <td><strong>Hersteller</strong></td>
                    <td>{productDetails.manufacturer}</td>
                  </tr>
                  <tr>
                    <td><strong>Kategorie</strong></td>
                    <td>{productDetails.category}</td>
                  </tr>
                  <tr>
                    <td><strong>Artikelgruppe</strong></td>
                    <td>{productDetails.artikelgruppe}</td>
                  </tr>
                  <tr>
                    <td><strong>Artikelgruppen-Nummer</strong></td>
                    <td>{productDetails.artikelgruppe_nummer}</td>
                  </tr>
                  <tr>
                    <td><strong>Hauptartikelgruppe</strong></td>
                    <td>{productDetails.hauptartikelgruppe}</td>
                  </tr>
                  <tr>
                    <td><strong>Hauptartikelnummer</strong></td>
                    <td>{productDetails.hauptartikelnummer}</td>
                  </tr>
                  <tr>
                    <td><strong>Produktgruppe</strong></td>
                    <td>{productDetails.produktgruppe}</td>
                  </tr>
                  <tr>
                    <td><strong>Produktgruppen-Nummer</strong></td>
                    <td>{productDetails.produktgruppe_nummer}</td>
                  </tr>
                  <tr>
                    <td><strong>Hauptaktivität</strong></td>
                    <td>{productDetails.hauptaktivitaet}</td>
                  </tr>
                  <tr>
                    <td><strong>Verpackt</strong></td>
                    <td>{formatBoolean(productDetails.verpackt)}</td>
                  </tr>
                  <tr>
                    <td><strong>Seriennummer</strong></td>
                    <td>{formatBoolean(productDetails.seriennummer)}</td>
                  </tr>
                </tbody>
              </table>
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
