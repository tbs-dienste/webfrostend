import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Kasse.scss'; // SCSS für Styling und Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importiere FontAwesome
import { faSignOutAlt, faPrint } from '@fortawesome/free-solid-svg-icons'; // Importiere das 'Sign-Out' Icon
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate
import LastReceiptViewer from './LatestReciepts';
import { jwtDecode } from "jwt-decode"; // jwt-decode importieren
import PaymentPrompt from './PaymentPrompt';

const Kasse = ({ onKassenModusChange }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showEFTPopup, setShowEFTPopup] = useState(false);

  const [betrag, setBetrag] = useState(0); // Definiere betrag und setBetrag
  const [scannedProducts, setScannedProducts] = useState([]);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Ausgewähltes Produkt
  const [quantity, setQuantity] = useState(1); // Menge für das Produkt
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isChangingQuantity, setIsChangingQuantity] = useState(false);
  const [price, setPrice] = useState("");
  const [isChangingPrice, setIsChangingPrice] = useState(false);

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

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
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













  const handleArtikelScan = (event) => {
    if (event.key === "Enter") {
      const artikelnummer = event.target.value;
      scanProduct(artikelnummer);  // Annahme: scanProduct ist bereits definiert
      setIsConfirmed(false); // Nach dem Scannen wieder zurücksetzen
      event.target.value = ""; // Eingabefeld leeren
    }
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

  const toggleBonParkieren = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Kein Token gefunden. Aktion abgebrochen.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/products/park-bon", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Bon erfolgreich geparkt:", response.data.message);

      await fetchScannedProducts(); // falls du das nach dem Parkieren brauchst

    } catch (error) {
      console.error("Fehler beim Parken des Bons:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };





  const handleShowPopup = () => {
    setShowEFTPopup(true);
  };


  const handleClosePopup = () => {
    setShowEFTPopup(false);
  };




  const handleNumericKeypadClick = (number) => {
    if (isPaying) {
      setBetrag((prev) => prev === "" ? number.toString() : prev + number);
    } else if (isConfirmed) {
      setArticleNumber((prev) => prev === "" ? number.toString() : prev + number);
    } else if (isChangingPrice) {
      setPrice((prev) => prev === "" ? number.toString() : prev + number);
    } else if (isChangingQuantity) {
      // Wenn der Wert 0 ist, einfach die Zahl setzen, sonst anhängen
      setQuantity((prev) => {
        // Um sicherzustellen, dass bei der Eingabe von Dezimalzahlen auch richtig weitergearbeitet wird
        const newValue = prev.toString() === "0" ? number.toString() : prev.toString() + number;
        return newValue;
      });
    }
  };

  const handleDotClick = () => {
    // Wenn der aktuelle Wert bereits ein Punkt enthält, nichts tun
    if (isPaying) {
      if (!betrag.includes(".")) {
        setBetrag((prev) => prev + ".");
      }
    } else if (isConfirmed) {
      if (!articleNumber.includes(".")) {
        setArticleNumber((prev) => prev + ".");
      }
    } else if (isChangingPrice) {
      if (!price.includes(".")) {
        setPrice((prev) => prev + ".");
      }
    } else if (isChangingQuantity) {
      if (!quantity.includes(".")) {
        setQuantity((prev) => prev + ".");
      }
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


  const toggleSelectProduct = (product) => {
    console.log("Produkt:", product);  // Logge das gesamte Produkt

    // Logge die Artikelnummer direkt (product ist die Artikelnummer in deinem Fall)
    console.log("article_number:", product);

    if (!product || product.trim() === "") {
      console.error("Produkt hat keine Artikel-Nummer!");
      return;
    }

    setSelectedProducts((prevSelected) => {
      const exists = prevSelected.some(p => p === product);  // Vergleiche direkt mit der Artikelnummer

      if (exists) {
        return prevSelected.filter(p => p !== product);  // Entferne die Artikelnummer, wenn sie bereits in der Liste ist
      } else {
        return [...prevSelected, product];  // Füge die Artikelnummer hinzu
      }
    });
  };

  const handleConfirm = async () => {
    setErrorMessage(""); // Reset Fehler
    setSuccessMessage(""); // Reset Erfolg
    setIsConfirmed(false); // Bestätigungsstatus zurücksetzen

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Nicht authentifiziert.");
      return;
    }

    try {
      setLoading(true);

      // 💸 ZAHLUNGSMODUS
      if (isPaying) {
        if (!betrag || isNaN(parseFloat(betrag))) {
          setErrorMessage("Bitte geben Sie einen gültigen Betrag ein.");
          return;
        }

        const totalDue = scannedProducts.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0
        );

        const enteredAmount = parseFloat(betrag);

        if (enteredAmount >= totalDue) {
          const change = enteredAmount - totalDue;

          // Du kannst hier optional noch einen API-Call machen,
          // um die Transaktion zu speichern, wenn du willst!

          if (change > 0) {
            setSuccessMessage(
              `Zahlung über ${enteredAmount.toFixed(2)} CHF abgeschlossen. Rückgeld: ${change.toFixed(2)} CHF.`
            );
          } else {
            setSuccessMessage(`Zahlung über ${totalDue.toFixed(2)} CHF abgeschlossen.`);
          }

          // Reset danach
          resetModes();
          setScannedProducts([]); // 🧹 Produkte leeren nach Bezahlung
          setBetrag(""); // Betrag zurücksetzen
        } else {
          setErrorMessage("Der Betrag ist nicht ausreichend.");
        }

        return; // Exit hier, weil Zahlung fertig!
      }

      // 💰 PREIS ÄNDERN
      if (isChangingPrice) {
        if (!selectedProducts.length) {
          setErrorMessage("Bitte wählen Sie mindestens ein Produkt aus.");
          return;
        }

        if (!price || isNaN(parseFloat(price))) {
          setErrorMessage("Bitte geben Sie einen gültigen Preis ein.");
          return;
        }

        const updates = selectedProducts.map((article_number) => ({
          article_number,
          price: parseFloat(price)
        }));

        const response = await axios.put(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/products/update-price",
          { selectedProducts: updates },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          const updatedProducts = scannedProducts.map((product) =>
            selectedProducts.includes(product.article_number)
              ? { ...product, price: parseFloat(price) }
              : product
          );

          setScannedProducts(updatedProducts);
          setSuccessMessage("Preis erfolgreich aktualisiert.");
          resetModes();
          setPrice(""); // Preisfeld zurücksetzen
        } else {
          setErrorMessage("Fehler beim Aktualisieren der Preise.");
        }

        return;
      }

      // 🔢 MENGE ÄNDERN
      if (isChangingQuantity) {
        if (!selectedProducts.length) {
          setErrorMessage("Bitte wählen Sie mindestens ein Produkt aus.");
          return;
        }

        if (!quantity || isNaN(parseFloat(quantity))) {
          setErrorMessage("Bitte geben Sie eine gültige Menge ein.");
          return;
        }

        const updates = selectedProducts.map((article_number) => ({
          article_number,
          quantity: parseFloat(quantity)
        }));

        const response = await axios.put(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/products/update-quantity",
          { selectedProducts: updates },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          const updatedProducts = scannedProducts.map((product) =>
            selectedProducts.includes(product.article_number)
              ? { ...product, quantity: parseFloat(quantity) }
              : product
          );

          setScannedProducts(updatedProducts);
          setSuccessMessage("Menge erfolgreich aktualisiert.");
          resetModes();
          setQuantity(""); // Menge zurücksetzen
        } else {
          setErrorMessage("Fehler beim Aktualisieren der Menge.");
        }

        return;
      }

      // ✅ ARTIKEL SCANNEN
      if (!articleNumber) {
        setErrorMessage("Bitte geben Sie eine Artikelnummer ein.");
        return;
      }

      const response = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/scan",
        {
          article_number: articleNumber,
          quantity: 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200 && response.data) {
        setScannedProducts(response.data);
        setSuccessMessage(`Artikel ${articleNumber} wurde erfolgreich gescannt.`);
        setArticleNumber(""); // Eingabefeld leeren
      } else {
        setErrorMessage("Produkt nicht gefunden oder Scan fehlgeschlagen.");
      }
    } catch (error) {
      console.error("Fehler:", error);
      setErrorMessage(
        error.response?.data?.error || "Ein unerwarteter Fehler ist aufgetreten."
      );
    } finally {
      setLoading(false);
    }
  };


  const resetModes = () => {
    setIsPaying(false);
    setIsChangingPrice(false);
    setIsChangingQuantity(false);
    setIsConfirmed(false);

    setBetrag("");
    setPrice("");
    setQuantity("");
    setSelectedProducts([]);
    setArticleNumber("");
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
  const goToProductDetails = () => {
    if (selectedProducts.length > 0) {
      navigate(`/artikel-detail/${selectedProducts[0]}`); // Nutze den ersten ausgewählten Artikel
    } else {
      alert('Bitte wähle zuerst ein Produkt aus!');
    }
  };


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


      {showEFTPopup && (
        <div className="popup-overlay">
          <div className="last-receipt-popup">
            <PaymentPrompt /> {/* Die PaymentPrompt-Komponente wird hier angezeigt */}
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
          {showDiscounts ? (
            <div className="discount-buttons">
              <button onClick={toggleDiscounts} className="back-button">
                Zurück
              </button>
              {/* Buttons in zwei Boxen unterteilen */}
              <div className="button-group">
                {availableDiscounts.slice(0, 2).map((discount) => (
                  <button
                    key={discount.title}
                    onClick={() => addDiscount(discount.title)}
                    className="discount-button double-width"
                  >
                    {discount.title}
                  </button>
                ))}
              </div>
              <div className="button-group">
                {availableDiscounts.slice(2, 4).map((discount) => (
                  <button
                    key={discount.title}
                    onClick={() => addDiscount(discount.title)}
                    className="discount-button double-width"
                  >
                    {discount.title}
                  </button>
                ))}
              </div>
              {availableDiscounts.slice(4).map((discount) => (
                <button
                  key={discount.title}
                  onClick={() => addDiscount(discount.title)}
                  className="discount-button"
                >
                  {discount.title}
                </button>
              ))}
            </div>
          ) : (
            <>
              <button style={{ backgroundColor: '	#FDFF00', color: 'black' }}>Verkauf</button>
              <button></button>
              <button></button>
              <button></button>
              <button onClick={handleDailyClose}>Tagesabschluss</button>
              <button onClick={toggleScanInput}>Artikel scannen</button>
              <button onClick={toggleDiscounts} disabled={selectedProducts.length === 0}>Pos. Rabatt</button>
              <button onClick={toggleBonAbbruch}>Bon Abbruch</button>

              {/* Kunden- und Transaktionsbuttons */}
              <button>Kunden suchen</button>


              <button onClick={handleCustomerCardClick}>Kundenkarte</button>

              {/* Weitere Funktionen */}
              <button>GS-Karte</button>
              <button onClick={toggleBonParkieren} disabled={selectedProducts.length === 0}>
                Bon Parkieren
              </button>
              <button onClick={addStornoCost} className="btn-storno">
                Storno-Kosten hinzufügen
              </button>


              <button>Artikel suchen</button>


              <button onClick={() => deleteSelectedProducts()} disabled={selectedProducts.length === 0}>
                Pos. löschen
              </button>
              {/* Unbenutzte Buttons */}
              <button>Anzahlung</button>
              <button></button>
              <button></button>
              <button></button>
              <button></button>
              <button></button>
              <button onClick={goToProductDetails} >Artikel Detail</button>
              <button></button>
              <button></button>
              <button></button>
              <button onClick={toggleLastReciepts} className="sign-out-button">
                <FontAwesomeIcon icon={faPrint} />
              </button>
              <button>Einstellungen</button>
              <button>Kunden Detail</button>




              <button onClick={handleCashierSwitch}>Kassierer wechseln</button>
              <button onClick={handleDailyOverview}>Tagesübersicht</button>
              <button>Schublade öffnen</button>
              <button onClick={() => setIsChangingQuantity(true)}>Menge ändern</button>
              <button onClick={() => setIsChangingPrice(true)}>Preis ändern</button>

              <button>Kundenkarte</button>
              <button onClick={handleGSKarteSaldo}>GS-Karte abfrage</button>
              {/* Abmelden und Wechseln */}
              <button onClick={handleSignOut} className="sign-out-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>






            </>
          )}
        </div>



        <div className="scanned-products-container">
          <div className="scanned-products">
            <div className="input-container">
              {isPaying && (
                <>
                  <label>Betrag eingeben:</label>
                  <input
                    type="text"
                    className="amount-input"
                    value={betrag}
                    onChange={(e) => setBetrag(e.target.value)}
                  />
                </>
              )}

              {isChangingPrice && (
                <>
                  <label>Preis ändern:</label>
                  <input
                    type="text"
                    className="quantity-display"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </>
              )}

              {isChangingQuantity && (
                <>
                  <label>Menge:</label>
                  <input
                    type="text"
                    className="quantity-display"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </>
              )}

              {!isPaying && !isChangingPrice && !isChangingQuantity && (
                <>
                  <label>Artikelnummer eingeben:</label>
                  <input
                    type="text"
                    className="quantity-display"
                    value={articleNumber}
                    onChange={(e) => setArticleNumber(e.target.value)}
                  />
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
                        <span className="product-quantity">{Number(product.quantity).toFixed(2)} x</span>
                      </div>
                      <span className="product-price">{parseFloat(product.price).toFixed(2)} CHF</span>
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
                        <span className="no-discount"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Products - Direkt unter Scanned Products */}
          <div className="total-products">
            <table>
              <tbody>
                <tr>
                  <td><strong>Subtotal</strong></td>
                  <td><strong>CHF</strong></td>
                  <td>{totalPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="2">---------------------------------------------------</td>
                </tr>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>CHF</strong></td>
                  <td>{totalPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Anzahl Teile</strong></td>
                  <td>{Math.round(scannedProducts.reduce((total, product) => total + product.quantity, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
            <button onClick={handleShowPopup} style={{ width: '32%', padding: '10px', fontSize: '14px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
              EFT
            </button>
          </div>


          <div className="keypad">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((number) => (
              <button
                key={number}
                onClick={() => handleNumericKeypadClick(number)}
                className="keypad-btn"
              >
                {number}
              </button>
            ))}
            <button onClick={handleDotClick}>.</button> {/* Das Komma */}
            <button className="keypad-btn" onClick={() => handleNumericKeypadClick(0)}>
              0
            </button>
            <button className="keypad-btn" onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>


          <div className="action-buttons">
            <button onClick={handleConfirm} className="btn-confirm" disabled={loading}>
              {loading ? "Aktualisiere..." : "Bestätigen"}
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