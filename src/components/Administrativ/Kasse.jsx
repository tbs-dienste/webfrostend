import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kasse.scss'; // SCSS für Styling und Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importiere FontAwesome
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importiere das 'Sign-Out' Icon
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

const Kasse = ({ onKassenModusChange }) => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Ausgewähltes Produkt
  const [quantity, setQuantity] = useState(1); // Menge für das Produkt
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [articleNumber, setArticleNumber] = useState(''); // Artikelnummer
  const [kasseMode, setKasseMode] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false); // Zustand für Rabatte
  const [showScan, setShowScan] = useState(false); // Zustand für Artikel scannen
  const [dailyCloseCompleted, setDailyCloseCompleted] = useState(false);
  const [loading, setLoading] = useState(false); // Zustand für Ladeanimation
  const token = localStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [showCustomerCardButtons, setShowCustomerCardButtons] = useState(false); // Zustand für die Anzeige der Buttons
  const [loadingProgress, setLoadingProgress] = useState(0); // Progress der Ladeanimation
  const [totalPrice, setTotalPrice] = useState(0); // Gesamtpreis
  const navigate = useNavigate(); // Initialisiere useNavigate


  const API_BASE_URL = 'https://tbsdigitalsolutionsbackend.onrender.com/api/kasse';

  // Gescannte Produkte abrufen
  const fetchScannedProducts = async () => {
    setLoading(true); // Ladeanimation starten
    try {
      const response = await axios.get(`${API_BASE_URL}/scanned-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScannedProducts(response.data.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der gescannten Produkte:', error);
    } finally {
      setLoading(false); // Ladeanimation stoppen
    }
  };

  // Rabatte abrufen
  const fetchDiscounts = async () => {
    setLoading(true); // Ladeanimation starten
    try {
      const response = await axios.get(`${API_BASE_URL}/discounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableDiscounts(response.data.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Rabatte:', error);
    } finally {
      setLoading(false); // Ladeanimation stoppen
    }
  };
  const handleDailyClose = () => {
    setShowPopup(true);
    setPopupText('Tagesabschluss wird generiert...');
    setLoadingProgress(0); // Startwert des Ladefortschritts
    setDailyCloseCompleted(false);

    // Simuliere Ladeprozess für 15 Sekunden
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setPopupText('Tagesabschluss abgeschlossen.');
        setDailyCloseCompleted(true);
      } else {
        progress += 100 / 15; // Ladefortschritt in 15 Sekunden
        setLoadingProgress(progress);
      }
    }, 1000); // Alle 1 Sekunde den Fortschritt erhöhen
  };



  const cancelPopup = () => {
    setShowPopup(false); // Pop-up schließen
  };
  // Produkte löschen
  const clearScannedProducts = () => {
    setScannedProducts([]);
    setTotalPrice(0);
  };
  const handleSignOut = () => {
    window.location = "/kassenuebersicht";
    // Weiterleitung zur Login-Seite oder zum gewünschten Ort
  };


    const handleDailyOverview = () => {
        navigate('/receipts'); // Leitet zu /tagesuebersicht weiter
    };


  // Produkt scannen
  const scanProduct = async () => {
    if (!articleNumber) {
      setErrorMessage('Bitte geben Sie eine Artikelnummer ein.');
      return;
    }

    setLoading(true); // Ladeanimation starten
    try {
      const response = await axios.post(
        `${API_BASE_URL}/scan-product`,
        { article_number: articleNumber, quantity: 1 }, // Immer Menge 1
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Produkt erfolgreich gescannt.');
      fetchScannedProducts(); // Gescannte Produkte Liste aktualisieren
      setArticleNumber(''); // Eingabefeld für Artikelnummer zurücksetzen
    } catch (error) {
      console.error('Fehler beim Scannen des Produkts:', error);
      setErrorMessage('Produkt konnte nicht gescannt werden.');
    } finally {
      setLoading(false); // Ladeanimation stoppen
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

  // Funktion für das Klicken auf die Kundenkarte
  const handleCustomerCardClick = () => {
    setShowCustomerCardButtons(!showCustomerCardButtons); // Toggle für die Buttons
  };

  // Numerische Tastatur für Menge
  const handleNumericKeypadClick = (number) => {
    setQuantity(prev => prev === 0 ? number : prev * 10 + number);
  };

  const clearQuantity = () => setQuantity(0); // Löscht die Menge


  // Toggelt die Anzeige des Scan-Input-Feldes
  const toggleScanInput = () => {
    setShowScan(prev => !prev);
  };


  const calculateTotalPrice = () => {
    let total = 0;
    let totalDiscount = 0; // Für die Gesamtberechnung der Rabatte

    scannedProducts.forEach((product) => {
      const price = parseFloat(product.price);
      const quantity = parseInt(product.quantity, 10);

      if (!isNaN(price) && !isNaN(quantity)) {
        // Berechne Rabatt
        const discountAmount = product.discounts?.reduce((sum, discount) => {
          return sum + parseFloat(discount.amount);
        }, 0) || 0;

        const productTotal = price * quantity;
        total += productTotal;
        totalDiscount += discountAmount;

        // Abgezogenem Rabatt den Preis nach dem Rabatt berechnen
        product.finalPrice = productTotal - discountAmount;
      }
    });

    setTotalPrice(total - totalDiscount); // Gesamtpreis nach Rabatt
  };


  useEffect(() => {
    calculateTotalPrice(); // Gesamtpreis neu berechnen, wenn gescannte Produkte sich ändern
  }, [scannedProducts]);


  useEffect(() => {
    fetchScannedProducts();
    fetchDiscounts();
  }, []);

  return (
    <div className={`kasse-container ${kasseMode ? 'kasse-mode' : ''}`}>


      {/* Tagesabschluss Pop-up */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{popupText}</h2>
            {loadingProgress < 100 && (
              <div className="loading-bar">
                <div className="loading-progress" style={{ width: `${loadingProgress}%` }}></div>
              </div>
            )}
            {!loading && dailyCloseCompleted && (
              <div className="success-message">
                <h3>Tagesabschluss abgeschlossen.</h3>
              </div>
            )}
            <button onClick={cancelPopup} className="btn-cancel">Abbrechen</button>
          </div>
        </div>
      )}




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

          {/* Fehlermeldungen */}
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          {/* Dreispaltiges Layout */}
          <div className="kasse-layout">
            {/* Links: Buttons für Artikel scannen und Rabatte */}
            <div className="left-buttons">
              <button onClick={handleDailyClose}>Tagesabschluss</button>
              <button onClick={toggleScanInput}>Artikel scannen</button>
              <button onClick={toggleDiscounts}>Rabatte anzeigen</button>
              <button>Kassierer wechseln</button>
              <button>Kunden suchen</button>
              <button>Schublade öffnen</button>
              <button onClick={handleCustomerCardClick}>Kundenkarte</button>
              <button>GS-Karte</button>
              <button onClick={handleDailyOverview}>Tagesübersicht</button>
              <button onClick={handleSignOut} className="sign-out-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
              </button>
              <button>Artikel suchen</button>
              <button>Einstellungen</button>
            </div>

            {/* Mitte: Gescannte Produkte */}
            <div className="scanned-products">

              {scannedProducts.length === 0 ? (
                <p>Keine Produkte gescannt.</p>
              ) : (
                <div className="product-list">
                  {scannedProducts.map((product) => (
                    <div
                      key={product.article_number}
                      className={`product-item ${selectedProduct?.article_number === product.article_number ? 'selected' : ''}`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="product-details">
                        <span className="product-name">{product.article_short_text}</span>
                        <span className="product-quantity">
                          {product.quantity} x
                        </span>
                        <span className="product-price">
                          {parseFloat(product.price).toFixed(2)} CHF
                        </span>
                        <span className="total-price">
                          {product.finalPrice ? product.finalPrice.toFixed(2) : (parseFloat(product.price) * product.quantity).toFixed(2)} CHF
                        </span>
                      </div>

                      <div className="product-discounts">
                        {product.discounts?.length > 0 ? (
                          product.discounts.map((discount, index) => (
                            <span key={index} className="discount">
                              {discount.title} ({discount.amount} CHF)
                            </span>
                          ))
                        ) : (
                          <span className="no-discount">Kein Rabatt</span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="payment-section">
                    <h3>Gesamtkosten nach Rabatt: {totalPrice.toFixed(2)} CHF</h3>
                    <button className="btn-pay">Bezahlen</button>
                  </div>
                </div>


              )}
            </div>
            {/* Kundenkarte Buttons */}
            {showCustomerCardButtons && (
              <div className="customer-card-buttons">
                <button  className="discount-btn">50 CHF</button>
                <button className="discount-btn">30 CHF</button>
              </div>
            )}
            <div className="numeric-keypad-container">
              <input
                type="number"
                className="quantity-display"
                value={quantity}
                readOnly
              />
              <div className="keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                  <button
                    key={number}
                    onClick={() => handleNumericKeypadClick(number)}
                    className="keypad-btn"
                  >
                    {number}
                  </button>
                ))}
                <button className="keypad-btn" onClick={clearQuantity}>
                  C
                </button>
                <button
                  className="keypad-btn"
                  onClick={() => handleNumericKeypadClick(0)}
                >
                  0
                </button>
                <button className="keypad-btn" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            <div className="action-buttons">
              <button
                onClick={() => {
                  if (selectedProduct) {
                    // Aktualisiere die Menge des ausgewählten Produkts
                    const updatedProducts = scannedProducts.map((product) =>
                      product.article_number === selectedProduct.article_number
                        ? { ...product, quantity }
                        : product
                    );
                    setScannedProducts(updatedProducts);
                    setSelectedProduct(null); // Auswahl zurücksetzen
                    setQuantity(1); // Zurücksetzen der Menge
                    setSuccessMessage('Menge erfolgreich aktualisiert.');
                  } else {
                    setErrorMessage('Bitte ein Produkt auswählen, um die Menge zu ändern.');
                  }
                }}
                className="btn-confirm"
              >
                Bestätigen
              </button>
              <button
                onClick={clearScannedProducts}
                className="btn-delete"
              >
                Löschen
              </button>
            </div>


          </div>



          {/* Rabatte anzeigen */}
          {showDiscounts && availableDiscounts.map((discount) => (
            <button
              key={discount.title}
              onClick={() => addDiscount(discount.title)}
              className="discount-button"
            >
              {discount.title}
            </button>
          ))}
        </>
      )}

      {/* Artikel scannen Eingabefeld */}
      {showScan && (
        <div className="scan-input">
          <input
            type="text"
            value={articleNumber}
            onChange={(e) => setArticleNumber(e.target.value)}
            placeholder="Artikelnummer eingeben"
            className="article-input"
          />
          <button onClick={scanProduct} className="scan-button">
            <i className="fas fa-barcode"></i> Scannen
          </button>
        </div>
      )}
    </div>
  );
};

export default Kasse;
