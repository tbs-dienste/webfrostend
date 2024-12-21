import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kasse.scss'; // SCSS für Styling und Icons

const Kasse = ({ onKassenModusChange }) => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Ausgewähltes Produkt
  const [articleNumber, setArticleNumber] = useState(''); // Artikelnummer für das Scannen
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [kasseMode, setKasseMode] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false); // Zustand, ob Rabatte angezeigt werden
  const token = localStorage.getItem("token");

  const API_BASE_URL = 'https://tbsdigitalsolutionsbackend.onrender.com/api/kasse';

  // Gescannte Produkte abrufen
  const fetchScannedProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scanned-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScannedProducts(response.data.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der gescannten Produkte:', error);
    }
  };

  // Rabatte abrufen
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/discounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableDiscounts(response.data.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Rabatte:', error);
    }
  };

  // Produkt scannen
  const scanProduct = async () => {
    if (!articleNumber) {
      setErrorMessage('Bitte geben Sie eine Artikelnummer ein.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/scan-product`,
        { article_number: articleNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Produkt erfolgreich gescannt.');
      fetchScannedProducts(); // Liste aktualisieren
      setArticleNumber(''); // Eingabefeld zurücksetzen
    } catch (error) {
      console.error('Fehler beim Scannen des Produkts:', error);
      setErrorMessage('Produkt konnte nicht gescannt werden.');
    }
  };

  // Rabatt hinzufügen
  const addDiscount = async (discountTitle) => {
    if (!selectedProduct) {
      setErrorMessage('Bitte zuerst ein Produkt auswählen.');
      return;
    }

    if (selectedProduct.discounts?.length > 0) {
      setErrorMessage('Es kann nur ein Rabatt pro Produkt hinzugefügt werden.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/add-discount`,
        {
          article_number: selectedProduct.article_number,
          discount_title: discountTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Rabatt erfolgreich hinzugefügt.');
      fetchScannedProducts();
      setSelectedProduct(null); // Auswahl zurücksetzen
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Rabatts:', error);
      setErrorMessage('Rabatt konnte nicht hinzugefügt werden.');
    }
  };

  // Produkt löschen
  const deleteScannedProduct = async (articleNumber) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${articleNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Produkt erfolgreich entfernt.');
      fetchScannedProducts();
      if (selectedProduct?.article_number === articleNumber) {
        setSelectedProduct(null); // Auswahl zurücksetzen, falls gelöscht
      }
    } catch (error) {
      console.error('Fehler beim Entfernen des Produkts:', error);
      setErrorMessage('Produkt konnte nicht entfernt werden.');
    }
  };

  // Zahlung abschließen
  const pay = async () => {
    if (!paymentMethod) {
      setErrorMessage('Bitte eine Zahlungsmethode wählen.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/pay`,
        { payment_method: paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Zahlung erfolgreich abgeschlossen.');
      fetchScannedProducts(); // Liste zurücksetzen
    } catch (error) {
      console.error('Fehler beim Abschließen der Zahlung:', error);
      setErrorMessage('Zahlung konnte nicht abgeschlossen werden.');
    }
  };

 // Kassenmodus starten/beenden
 const startKasseMode = () => {
  setKasseMode(true);
  onKassenModusChange(true); // Übermittelt den Modusstatus an App.js
};

const cancelKasseMode = () => {
  setKasseMode(false);
  onKassenModusChange(false);
};


  const toggleDiscounts = () => {
    setShowDiscounts(!showDiscounts);
  };

  useEffect(() => {
    fetchScannedProducts();
    fetchDiscounts();
  }, []);

  return (
    <div className={`kasse-container ${kasseMode ? 'kasse-mode' : ''}`}>
      {!kasseMode ? (
        <div className="kasse-prompt">
          <h2>Willst du den Kassenmodus starten?</h2>
          <div className="buttons">
            <button onClick={startKasseMode} className="btn-yes">
              <i className="fas fa-check"></i> Ja
            </button>
            <button onClick={cancelKasseMode} className="btn-no">
              <i className="fas fa-times"></i> Nein
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1>Kasse</h1>

          {/* Fehlermeldungen */}
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          {/* Produkt scannen */}
          <div className="scan-product">
            <h2>Produkt scannen</h2>
            <input
              type="text"
              value={articleNumber}
              onChange={(e) => setArticleNumber(e.target.value)}
              placeholder="Artikelnummer eingeben"
            />
            <button onClick={scanProduct}>
              <i className="fas fa-barcode"></i> Scannen
            </button>
          </div>

          {/* Gescannte Produkte */}
          <div className="scanned-products">
            <h2>Gescannte Produkte</h2>
            {scannedProducts.length === 0 ? (
              <p>Keine Produkte gescannt.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Artikelnummer</th>
                    <th>Name</th>
                    <th>Preis (€)</th>
                    <th>Rabatte</th>
                  </tr>
                </thead>
                <tbody>
                  {scannedProducts.map((product) => (
                    <tr
                      key={product.article_number}
                      onClick={() => setSelectedProduct(product)} // Produkt auswählen
                      className={selectedProduct?.article_number === product.article_number ? 'selected' : ''}
                    >
                      <td>{product.article_number}</td>
                      <td>{product.article_short_text}</td>
                      <td>{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</td>
                      <td>
                        {product.discounts?.length
                          ? product.discounts.map((discount) => discount.title).join(', ')
                          : 'Keine'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Rabatte */}
          <div className="available-discounts">
            <button onClick={toggleDiscounts} className="toggle-discounts">
              {showDiscounts ? 'Rabatte' : 'Rabatt'}
            </button>
            {showDiscounts && availableDiscounts.map((discount) => (
              <button
                key={discount.title}
                onClick={() => addDiscount(discount.title)}
                className="discount-button"
              >
                {discount.title}
              </button>
            ))}
          </div>

          {/* Zahlung */}
          <div className="pay">
            <h2>Zahlung abschließen</h2>
            <select onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">Zahlungsmethode wählen</option>
              <option value="bar">Bar</option>
              <option value="karte">Karte</option>
            </select>
            <button onClick={pay}>
              <i className="fas fa-credit-card"></i> Bezahlen
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Kasse;
