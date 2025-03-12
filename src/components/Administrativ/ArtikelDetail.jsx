import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  }, [article_number]); // Hier wird die Produktanzeige bei Änderung der Artikelnummer neu geladen

  useEffect(() => {
    onKassenModusChange(true);
    return () => onKassenModusChange(false);
  }, [onKassenModusChange]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('de-CH');
  };

  const formatBoolean = (value) => (value === 1 ? 'Ja' : 'Nein');

  if (loading) return <div className="artikel-anzeige">Lade Daten...</div>;

  return (
    <div className="artikel-anzeige">
      {error && <div className="error-box">{error}</div>}

      {productDetails ? (
        <div className="artikel-detail-container">
          <div className="header-section">
            <div className="artikel-nr">{productDetails.article_number}</div>
            <div className="artikel-name">{productDetails.article_short_text}</div>
          </div>

          <div className="preis-section">
            <div>Aktueller Preis CHF</div>
            <div className="preis-wert">{parseFloat(productDetails.price).toFixed(2)}</div>
          </div>

          <div className="info-grid">
            <div className="info-column">
              <div className="info-row">
                <div className="label">Preislisten Nr.:</div>
                <div className="box">{productDetails.preislisten_nr}</div>
              </div>
              <div className="info-row">
                <div className="label">Preis Eh.:</div>
                <div className="box">1</div>
              </div>
              <div className="info-row">
                <div className="label">Preis:</div>
                <div className="box">{parseFloat(productDetails.price).toFixed(2)}</div>
              </div>
              <div className="info-row">
                <div className="label">Gültig ab:</div>
                <div className="box">{formatDate(productDetails.gueltig_ab)}</div>
              </div>
              <div className="info-row">
                <div className="label">Gültig bis:</div>
                <div className="box">{formatDate(productDetails.gueltig_bis)}</div>
              </div>
              <div className="info-row">
                <div className="label">MWST-Satz:</div>
                <div className="box">{parseFloat(productDetails.mwst_satz).toFixed(2)}%</div>
              </div>
              <div className="info-row">
                <div className="label">Rabatt Pos / Bon:</div>
                <div className="box">
                  {formatBoolean(productDetails.rabatt_pos)} / {formatBoolean(productDetails.rabatt_bon)}
                </div>
              </div>
              <div className="info-row">
                <div className="label">Preisbestätigung:</div>
                <div className="box">{formatBoolean(productDetails.preisbestaetigung)}</div>
              </div>
            </div>

            <div className="info-column">
              <div className="info-row">
                <div className="label">Artikelgruppe:</div>
                <div className="box">{productDetails.artikelgruppe}</div>
              </div>
              <div className="info-row">
                <div className="label">Hauptartikelgruppe:</div>
                <div className="box">{productDetails.hauptartikelgruppe}</div>
              </div>
              <div className="info-row">
                <div className="label">Produktgruppe:</div>
                <div className="box">{productDetails.produktgruppe}</div>
              </div>
              <div className="info-row">
                <div className="label">Hauptaktivität:</div>
                <div className="box">{productDetails.hauptaktivitaet}</div>
              </div>
              <div className="info-row">
                <div className="label">Verpackt:</div>
                <div className="box">{formatBoolean(productDetails.verpackt)}</div>
              </div>
              <div className="info-row">
                <div className="label">Seriennummer:</div>
                <div className="box">{formatBoolean(productDetails.seriennummer)}</div>
              </div>
            </div>
          </div>

          <div className="footer-grid">
            <div className="footer-box">
              <div className="footer-label">Barcode</div>
              <div>{productDetails.barcode}</div>
            </div>
            <div className="footer-box">
              <div className="footer-label">Garantie</div>
              <div>-</div>
            </div>
            <div className="footer-box">
              <div className="footer-label">Staffelpreise</div>
              <div>-</div>
            </div>
          </div>

          <div className="button-bar">
            <Link to="/kasse" className="btn btn-danger">
              Exit
            </Link>
          </div>
        </div>
      ) : (
        <p>Kein Produkt gefunden.</p>
      )}
    </div>
  );
};

export default ArtikelDetail;
