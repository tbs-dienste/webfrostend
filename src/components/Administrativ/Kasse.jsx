import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kasse.scss'; // SCSS für Styling und Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importiere FontAwesome
import { faSignOutAlt, faPrint } from '@fortawesome/free-solid-svg-icons'; // Importiere das 'Sign-Out' Icon
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate
import LastReceiptViewer from './LatestReciepts';
import { jwtDecode } from "jwt-decode"; // jwt-decode importieren

const Kasse = ({ onKassenModusChange }) => {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Ausgewähltes Produkt
  const [quantity, setQuantity] = useState(1); // Menge für das Produkt
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [articleNumber, setArticleNumber] = useState(''); // Artikelnummer
  const [kasseMode, setKasseMode] = useState(true);
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
  const [scanInput, setScanInput] = useState('');
  const navigate = useNavigate(); // Initialisiere useNavigate
  const [lastReceipt, setLastReceipt] = useState(null);
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  const [showLastReceipt, setShowLastReceipt] = useState(false); // Zustand, um die Quittung anzuzeigen
  const [kundeNummer, setKundeNummer] = useState(generateRandomNumber());


  const [salespersonName, setSalespersonName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setSalespersonName(`${decoded.vorname || "Unbekannt"} ${decoded.nachname || ""}`.trim());
    }
  }, []);

  useEffect(() => {
    // Überprüfen, ob der Token vorhanden ist
    const token = localStorage.getItem("token");
    if (token) {
      // Falls der Token vorhanden ist, wird der Kassenmodus automatisch aktiviert
      setKasseMode(true); // Kassenmodus aktivieren
      onKassenModusChange(true); // Übermittelt den Modusstatus an die übergeordnete Komponente
    }
  }, []);
  


  const toggleLastReciepts = async () => {
    await fetchLastReceipt(); // Holt die letzte Quittung
    setShowLastReceipt(true); // Stellt sicher, dass sie angezeigt wird
  };




  const API_BASE_URL = 'https://tbsdigitalsolutionsbackend.onrender.com/api/kasse';

  // Gescannte Produkte abrufen
  const fetchScannedProducts = async () => {
    setLoading(true); // Ladeanimation starten
    try {
      const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/products/scanned-products`, {
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
  

  const addStornoCost = () => {
    const stornoProduct = {
      article_number: '260163219953', // Artikelnummer für das Storno-Produkt
      quantity: 1,  // Menge für das Storno
    };
    // Das Storno-Produkt wird zu den gescannten Produkten hinzugefügt
    setScannedProducts((prev) => [...prev, stornoProduct]);
    setSuccessMessage('Storno-Kosten hinzugefügt.');
  };



  const handleDailyOverview = () => {
    navigate('/receipts'); // Leitet zu /tagesuebersicht weiter
  };

  const handleSignOut = () => {
   
    navigate("/kassenuebersicht");
  };

  const handleGSKarteSaldo = () => {
   
  
    // Weiterleitung zur Login-Seite
    navigate("/gs-karte");
  };
  
  
  
  

  const scanProduct = async () => {
    if (!articleNumber) {
      setErrorMessage('Bitte geben Sie eine Artikelnummer ein.');
      return;
    }

    setLoading(true); // Ladeanimation starten
    try {
      const response = await axios.post(
        `https://tbsdigitalsolutionsbackend.onrender.com/api/products/scan`,
        { article_number: articleNumber, quantity: 1 }, // Immer Menge 1
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const scannedProduct = response.data.data; // Das gescannte Produkt

      // Überprüfen, ob das Produkt bereits gescannt wurde
      const existingProduct = scannedProducts.find(
        (product) => product.article_number === scannedProduct.article_number
      );

      if (existingProduct) {
        // Wenn das Produkt bereits vorhanden ist, Menge um 1 erhöhen
        const updatedProducts = scannedProducts.map((product) =>
          product.article_number === existingProduct.article_number
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
        setScannedProducts(updatedProducts);
      } else {
        // Wenn das Produkt noch nicht vorhanden ist, füge es mit Menge 1 hinzu
        setScannedProducts((prev) => [
          ...prev,
          { ...scannedProduct, quantity: 1 },
        ]);
      }

      setSuccessMessage('Produkt erfolgreich gescannt.');
      setArticleNumber(''); // Eingabefeld für Artikelnummer zurücksetzen
    } catch (error) {
      console.error('Fehler beim Scannen des Produkts:', error);
      setErrorMessage('Produkt konnte nicht gescannt werden.');
    } finally {
      setLoading(false); // Ladeanimation stoppen
    }
  };

  const fetchLastReceipt = async () => {
    try {
      const token = localStorage.getItem("token"); // Token aus localStorage holen
      if (!token) {
        console.error("Kein Token vorhanden!");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/latest-receipt`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token im Header mitgeben
        },
      });

      setLastReceipt(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der letzten Quittung:", error);
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

  

  const handleScan = (event) => {
    setScanInput(event.target.value);
    setKundeNummer(generateRandomNumber()); // Neue Nummer setzen

  };

  const toggleDiscounts = () => {
    setShowDiscounts(!showDiscounts);
  };
  const handleCashierSwitch = () => {
    // Token aus dem localStorage entfernen
    localStorage.removeItem("token");
  
    // Navigieren zur gewünschten Seite, z.B. zum Login
    navigate("/kassenlogin");
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

  // Funktion zum Ändern der Menge für ein Produkt
  const handleQuantityChange = (product, action) => {
    const updatedProducts = scannedProducts.map((item) => {
      if (item.article_number === product.article_number) {
        let newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
        newQuantity = newQuantity < 1 ? 1 : newQuantity; // Sicherstellen, dass die Menge nicht unter 1 geht
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setScannedProducts(updatedProducts);
    calculateTotalPrice(); // Gesamtpreis neu berechnen
  };


  // Toggelt die Anzeige des Scan-Input-Feldes
  const toggleScanInput = () => {
    setShowScan(prev => !prev);
  };

  // Toggelt die Anzeige des Scan-Input-Feldes
  const toggleBonCancel = () => {
    alert('Abbruch')
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

  function generateRandomNumber() {
    return Math.floor(100000000 + Math.random() * 900000000); // 9-stellige Nummer
  }


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

      {showLastReceipt && lastReceipt && (
        <div className="popup-overlay">
          <div className="last-receipt-popup">
            <LastReceiptViewer /> {/* Quittung wird hier als PDF angezeigt */}
            <button onClick={() => setShowLastReceipt(false)}>Schließen</button>
          </div>
        </div>
      )}









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
          <button onClick={toggleBonCancel}>Bon Abbruch</button>
          <button>Kassierer wechseln</button>
          <button>Kunden suchen</button>
          <button onClick={toggleLastReciepts} className="sign-out-button">
            <FontAwesomeIcon icon={faPrint} />
          </button>
          <button>Schublade öffnen</button>
          <button onClick={handleCustomerCardClick}>Kundenkarte</button>
          <button>GS-Karte</button>
          <button>Bon Parkieren</button>
          <button onClick={handleDailyOverview}>Tagesübersicht</button>
          <button onClick={addStornoCost} className="btn-storno">Storno-Kosten hinzufügen</button>
          <button onClick={handleSignOut} className="sign-out-button">
            <FontAwesomeIcon icon={faSignOutAlt} /> 
          </button>
          <button>Artikel suchen</button>
          <button>Einstellungen</button>
          <button onClick={handleCashierSwitch}>Kassierer wechseln</button>
          <button onClick={handleGSKarteSaldo}>GS-Karte abfrage</button>

          
        </div>

        <div className="scanned-products">
        <div className="kasse-header">
          <h4>Verkäufer {salespersonName}</h4>
          <h4>Kunde {kundeNummer}</h4>
        </div>

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
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(product, 'decrease')}
                      >
                        -
                      </button>
                      <span className="product-quantity">
                        {product.quantity} x
                      </span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(product, 'increase')}
                      >
                        +
                      </button>
                    </div>
                    <span className="product-price">
                      {parseFloat(product.price).toFixed(2)} CHF
                    </span>
                    <span className="total-price">
                      {product.finalPrice
                        ? product.finalPrice.toFixed(2)
                        : (parseFloat(product.price) * product.quantity).toFixed(2)} CHF
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


        {/* Bedingte Anzeige der Quittung */}
        {showLastReceipt && (
          <div className="last-receipt-popup">
            <LastReceiptViewer /> {/* Quittung wird hier angezeigt */}
            <button onClick={toggleLastReciepts}>Schließen</button>
          </div>
        )}

        {/* Kundenkarte Buttons */}
        {showCustomerCardButtons && (
          <div className="customer-card-buttons">
            <button className="discount-btn">50 CHF</button>
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



      {/* Gemeinsames Eingabefeld für Artikel- und Bonnummer */}
      {showScan && (
        <div className="scan-input">
          <input
            type="text"
            value={scanInput}
            onChange={handleScan}
            placeholder="Artikelnummer eingeben"
          />

          <button onClick={handleScan} className="scan-button">
            <i className="fas fa-barcode"></i> Scannen
          </button>
        </div>
      )}

    </div>
  );
};

export default Kasse;
