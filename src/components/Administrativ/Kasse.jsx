import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kasse.scss'; // SCSS für Styling und Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importiere FontAwesome
import { faSignOutAlt, faPrint } from '@fortawesome/free-solid-svg-icons'; // Importiere das 'Sign-Out' Icon
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate
import LastReceiptViewer from './LatestReciepts';
import { jwtDecode } from "jwt-decode"; // jwt-decode importieren

const Kasse = ({ onKassenModusChange }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [betrag, setBetrag] = useState(0); // Definiere betrag und setBetrag
  const [scannedProducts, setScannedProducts] = useState([]);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Ausgewähltes Produkt
  const [quantity, setQuantity] = useState(1); // Menge für das Produkt
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isChangingQuantity, setIsChangingQuantity] = useState(false);

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
  const anzahlTeile = scannedProducts.reduce((sum, product) => sum + product.quantity, 0);




  useEffect(() => {
    if (scannedProducts.length > 0) {
      calculateTotalPrice(); // Gesamtpreis neu berechnen, wenn Produkte hinzugefügt oder entfernt werden
    }
  }, [scannedProducts]);


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

  const handlePayClick = () => {
    setIsPaying(true);

    // Berechnung des Gesamtbetrags basierend auf den gescannten Produkten
    let totalAmount = 0;
    scannedProducts.forEach(product => {
      const price = parseFloat(product.price);
      const productQuantity = parseInt(product.quantity, 10);
      if (!isNaN(price) && !isNaN(productQuantity)) {
        totalAmount += price * productQuantity; // Gesamtbetrag berechnen
      }
    });

    setBetrag(totalAmount.toFixed(2)); // Gesamtbetrag anzeigen
    setQuantity(scannedProducts.reduce((total, product) => total + product.quantity, 0)); // Gesamtmenge setzen
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
  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;

    // Überprüfen, ob der Wert eine gültige Zahl ist, die einen Punkt und bis zu zwei Dezimalstellen enthält
    if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
      setQuantity(inputValue);
    }
  };


  const handleDotClick = () => {
    setQuantity(prev => {
      // Wenn der Punkt bereits vorhanden ist, wird er nicht mehr hinzugefügt
      if (prev.toString().includes('.')) {
        return prev;
      }
      // Falls kein Punkt vorhanden ist, wird der Punkt am Ende angehängt
      return `${prev}.`;
    });
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


  const handleNumericKeypadClick = (number, isForAmount = false) => {
    if (isForAmount) {
      // Wenn es für den Betrag ist, aktualisiere den Betrag
      setBetrag((prev) => prev === 0 ? number : prev * 10 + number);
    } else {
      // Wenn es für die Menge ist, aktualisiere die Menge
      setQuantity((prev) => prev === 0 ? number : prev * 10 + number);
    }
  };


  // Für die Betragseingabe
  const handleBetragChange = (e) => {
    const inputValue = e.target.value;

    // Überprüfen, ob der Wert eine gültige Zahl ist, die einen Punkt und bis zu zwei Dezimalstellen enthält
    if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
      // Setze den Betrag als Zahl (und nicht als Text)
      setBetrag(parseFloat(inputValue) || 0);
    }
  };


  const handleConfirm = async () => {
    if (!selectedProduct) {
      if (!articleNumber) {
        setIsConfirmed(true); // Artikelnummer-Eingabefeld anzeigen
        return;
      }

      try {
        setLoading(true);

        // Anfrage an die API mit Axios
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/products/${articleNumber}`);

        if (response.status === 200 && response.data) {
          setScannedProducts((prev) => [...prev, response.data]); // Produkt zur Liste hinzufügen
          setSelectedProduct(response.data);
          setArticleNumber(""); // Eingabefeld leeren
          setIsConfirmed(false);
        } else {
          alert("Artikel nicht gefunden!"); // Falls Artikel nicht existiert
        }
      } catch (error) {
        console.error("Fehler beim Abrufen des Artikels:", error);
        alert("Fehler beim Abrufen des Artikels!");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Falls ein Produkt bereits ausgewählt wurde, aktualisiere nur die Menge
    const updatedProducts = scannedProducts.map((product) =>
      product.article_number === selectedProduct.article_number
        ? { ...product, quantity }
        : product
    );

    setScannedProducts(updatedProducts);
    setSelectedProduct(null);
    setQuantity(1);
    setSuccessMessage("Menge erfolgreich aktualisiert.");
    setErrorMessage("");
  };




  const handleArtikelScan = (event) => {
    if (event.key === "Enter") {
      const artikelnummer = event.target.value;
      scanProduct(artikelnummer);  // Annahme: scanProduct ist bereits definiert
      setIsConfirmed(false); // Nach dem Scannen wieder zurücksetzen
      event.target.value = ""; // Eingabefeld leeren
    }
  };

  const toggleSelectProduct = (articleNumber) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(articleNumber)
        ? prevSelected.filter((num) => num !== articleNumber)
        : [...prevSelected, articleNumber]
    );
  };

  const deleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) return; // Keine Auswahl, nichts zu tun

    const token = localStorage.getItem("token"); // Token aus dem localStorage holen

    if (!token) {
      console.error("Kein Token gefunden!");
      setErrorMessage("Nicht authentifiziert.");
      return;
    }

    try {
      const response = await axios.delete(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/delete-scanned",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer Token im Header hinzufügen
          },
          data: { selectedProducts }, // Daten im Body als "data"
        }
      );

      // Falls erfolgreich, entferne die gelöschten Produkte aus dem State
      setScannedProducts((prevProducts) =>
        prevProducts.filter((product) => !selectedProducts.includes(product.article_number))
      );

      setSelectedProducts([]); // Zurücksetzen der Auswahl
      setSuccessMessage(response.data.message); // Erfolgsmeldung anzeigen
    } catch (error) {
      console.error("Fehler beim Löschen der Produkte:", error);
      setErrorMessage(error.response?.data?.error || "Fehler beim Löschen.");
    }
  };

  const toggleBonAbbruch = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Kein Token gefunden. Aktion abgebrochen.");
      return;
    }

    try {
      const response = await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/products/cancel", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Transaktion abgebrochen:", response.data.message);

      // Nach dem Abbruch sofort die gescannten Produkte neu abrufen
      await fetchScannedProducts();

    } catch (error) {
      console.error("Fehler beim Abbrechen der Transaktion:", error.response?.data || error.message);
    }
  };




  const updatePrice = async (articleNumber, price) => {
    if (!articleNumber || price === undefined) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Kein Token gefunden!");
      setErrorMessage("Nicht authentifiziert.");
      return;
    }

    try {
      await axios.put(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/update-price",
        { article_number: articleNumber, price },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Erfolg, jetzt State aktualisieren
      setScannedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.article_number === articleNumber ? { ...product, price } : product
        )
      );
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Preises:", error);
      setErrorMessage(error.response?.data?.error || "Fehler beim Ändern des Preises.");
    }
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
          <button onClick={toggleBonAbbruch}>Bon Abbruch</button>

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
          <button>Preis ändern</button>
          <button></button>
          <button></button>
          <button></button>
          <button onClick={() => setIsChangingQuantity(true)}>Menge ändern</button>
          <button
            onClick={() => deleteSelectedProducts()} // Ruft die Funktion zum Löschen auf
            disabled={selectedProducts.length === 0} // Button ist deaktiviert, wenn keine Produkte ausgewählt sind
          >
            Pos. löschen
          </button>

          <button></button>
          <button></button>
          <button></button>

          <button></button>
          <button></button>
          <button></button>


        </div>

        <div className="scanned-products">
          <div>
            {isPaying ? (
              <>
                <label>Betrag eingeben:</label>
                <input
                  type="text"
                  className="amount-input"
                  value={betrag}
                  onChange={handleBetragChange}
                />
              </>
            ) : (
              <>
                {isConfirmed ? (
                  <>
                    <label>Artikelnummer eingeben:</label>
                    <input
                      type="text"
                      className="article-number-input"
                      autoFocus
                      onKeyDown={handleArtikelScan} // Automatisches Scannen nach Eingabe
                    />
                  </>
                ) : (
                  <>
                    <label>Menge:</label>
                    <div className="number">
                      <input
                        type="text"
                        className="quantity-display"
                        value={quantity}
                        readOnly
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="kasse-header">
            <h1>Quittung</h1>
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
                  className={`product-item ${selectedProducts.includes(product.article_number) ? 'selected' : ''}`}
                  onClick={() => toggleSelectProduct(product.article_number)}
                >
                  <div className="product-details">
                    <span className="product-name">{product.article_number}</span>
                    <span className="product-article_number">{product.article_short_text}</span>
                    <div className="quantity-controls">
                      <span className="product-quantity">
                        {product.quantity} x
                      </span>
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

             
            </div>
          )}
        </div>

        <div className="total-products">
          <table>
            <tbody>
              <tr>
                <td><strong>Subtotal</strong></td>
                <td>CHF {totalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="2">---------------------------------------------------</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td>CHF {totalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Anzahl Teile</strong></td>
                <td>{scannedProducts.reduce((total, product) => total + product.quantity, 0)}</td>
              </tr>
            </tbody>
          </table>
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
          <div className="currency-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button style={{ width: '100px', padding: '10px', fontSize: '14px' }}>CHF</button>
            <button style={{ width: '32%', padding: '10px', fontSize: '14px' }}>EUR</button>
            <button style={{ width: '32%', padding: '10px', fontSize: '14px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
              EFT
            </button>
          </div>


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
            <button onClick={handleDotClick}>.</button>
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

          <div className="action-buttons">
            <button onClick={handleConfirm} className="btn-confirm">
              Bestätigen
            </button>

            <button onClick={clearScannedProducts} className="btn-delete">
              Löschen
            </button>
            <button className="btn-200">200</button>
            <button className="btn-other" onClick={handlePayClick}>Bezahlen</button>
            <button style={{ backgroundColor: '#48A23F', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>50</button>
            <button style={{ backgroundColor: '#007AC2', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>100</button>
            <button style={{ backgroundColor: '#FFD700', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>10</button>
            <button style={{ backgroundColor: '#DC241F', color: 'black', padding: '8px 16px', borderRadius: '8px' }}>20</button>
            <button className="btn-2">2</button>
            <button className="btn-5">5</button>
          </div>
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