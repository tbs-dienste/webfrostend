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
      const response = await axios.get(`${apiUrl}/${article_number}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.data) {
        setProductDetails(response.data.data);
        setError('');
      } else {
        setError('Produkt nicht gefunden');
      }
    } catch (err) {
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
    return () => onKassenModusChange(false);
  }, [onKassenModusChange]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('de-CH');
  };

  const formatBoolean = (value) => (value === 1 ? 'Ja' : 'Nein');
  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString('de-CH', { style: 'currency', currency: 'CHF' });

  if (loading) return <div className="artikel-anzeige">Lade Daten...</div>;

  return (
    <div className="artikel-anzeige">
      {error && <div className="error-box">{error}</div>}

      {productDetails ? (
        <div className="artikel-detail-container">
          {/* Kopfbereich */}
          <div className="header-section">
            <div>
              <span className="label">Artikel-Nr.:</span> {productDetails.article_number}
            </div>
            <div className="artikel-name">{productDetails.article_short_text}</div>
          </div>

          {/* Preisbereich */}
          <div className="preis-section">
            <span>Aktueller Preis CHF</span>
            <span className="preis-wert">{parseFloat(productDetails.price).toFixed(2)}</span>
          </div>

          {/* Info-Container */}
          <div className="info-grid">
            {/* Linke Seite */}
            <div className="info-column">
              <div className="info-row">
                <span className="label">Preislisten Nr.:</span>
                <div className="box">{productDetails.preislisten_nr}</div>
              </div>
              <div className="info-row">
                <span className="label">Preis Eh.:</span>
                <div className="box">1</div>
              </div>
              <div className="info-row">
                <span className="label">Preis:</span>
                <div className="box">{parseFloat(productDetails.price).toFixed(2)}</div>
              </div>
              <div className="info-row">
                <span className="label">Gültig ab:</span>
                <div className="box">{formatDate(productDetails.gueltig_ab)}</div>
              </div>
              <div className="info-row">
                <span className="label">Gültig bis:</span>
                <div className="box">{formatDate(productDetails.gueltig_bis)}</div>
              </div>
              <div className="info-row">
                <span className="label">MWST-Satz:</span>
                <div className="box">{parseFloat(productDetails.mwst_satz).toFixed(2)}%</div>
              </div>
              <div className="info-row">
                <span className="label">Rabatt Pos / Bon:</span>
                <div className="box">{formatBoolean(productDetails.rabatt_pos)} / {formatBoolean(productDetails.rabatt_bon)}</div>
              </div>
              <div className="info-row">
                <span className="label">Preisbestätigung:</span>
                <div className="box">{formatBoolean(productDetails.preisbestaetigung)}</div>
              </div>
            </div>

            {/* Rechte Seite */}
            <div className="info-column">
              <div className="info-row">
                <span className="label">Artikelgruppe:</span>
                <div className="box">{productDetails.artikelgruppe}</div>
              </div>
              <div className="info-row">
                <span className="label">Hauptartikelgruppe:</span>
                <div className="box">{productDetails.hauptartikelgruppe}</div>
              </div>
              <div className="info-row">
                <span className="label">Produktgruppe:</span>
                <div className="box">{productDetails.produktgruppe}</div>
              </div>
              <div className="info-row">
                <span className="label">Hauptaktivität:</span>
                <div className="box">{productDetails.hauptaktivitaet}</div>
              </div>
              <div className="info-row">
                <span className="label">Verpackt:</span>
                <div className="box">{formatBoolean(productDetails.verpackt)}</div>
              </div>
              <div className="info-row">
                <span className="label">Seriennummer:</span>
                <div className="box">{formatBoolean(productDetails.seriennummer)}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-grid">
            <div className="footer-box">
              <span>Barcode</span>
              <div>{productDetails.barcode}</div>
            </div>
            <div className="footer-box">
              <span>Garantie</span>
              <div>-</div>
            </div>
            <div className="footer-box">
              <span>Staffelpreise</span>
              <div>-</div>
            </div>
          </div>

          <div className="button-bar">
            <button>x</button>
            <button>x</button>
            <button>x</button>
            <button>x</button>
            <button className="btn-übernehmen">Übernehmen</button>
          </div>
        </div>
      ) : (
        <p>Kein Produkt gefunden.</p>
      )}
    </div>
  );
};

export default ArtikelDetail;
