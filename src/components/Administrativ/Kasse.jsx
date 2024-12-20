import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Kasse = () => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Ausgewähltes Produkt
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  useEffect(() => {
    fetchScannedProducts();
    fetchDiscounts();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Kasse</h1>

      {/* Fehlermeldungen */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {/* Gescannte Produkte */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Gescannte Produkte</h2>
        {scannedProducts.length === 0 ? (
          <p>Keine Produkte gescannt.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Artikelnummer
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Name
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Preis (€)
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                  Rabatte
                </th>
              </tr>
            </thead>
            <tbody>
              {scannedProducts.map((product) => (
                <tr
                  key={product.article_number}
                  onClick={() => setSelectedProduct(product)} // Produkt auswählen
                  style={{
                    backgroundColor:
                      selectedProduct?.article_number ===
                      product.article_number
                        ? '#f0f8ff'
                        : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {product.article_number}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {product.article_short_text}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {typeof product.price === 'number'
                      ? product.price.toFixed(2)
                      : '0.00'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
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
      <div style={{ marginBottom: '20px' }}>
        <h2>Rabatte hinzufügen</h2>
        {selectedProduct ? (
          <div>
            <p>
              Ausgewähltes Produkt:{' '}
              <strong>{selectedProduct.article_short_text}</strong>
            </p>
            {availableDiscounts.map((discount) => (
              <button
                key={discount.title}
                onClick={() => addDiscount(discount.title)}
                style={{
                  margin: '5px',
                  padding: '10px',
                  backgroundColor: '#add8e6',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                {discount.title}
              </button>
            ))}
          </div>
        ) : (
          <p>Wählen Sie ein Produkt, um einen Rabatt hinzuzufügen.</p>
        )}
      </div>

      {/* Zahlung */}
      <div>
        <h2>Zahlung abschließen</h2>
        <select
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        >
          <option value="">Zahlungsmethode wählen</option>
          <option value="bar">Bar</option>
          <option value="karte">Karte</option>
        </select>
        <button
          onClick={pay}
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Bezahlen
        </button>
      </div>
    </div>
  );
};

export default Kasse;
