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
  const [response, setResponse] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [step, setStep] = useState("quantity"); // "quantity" | "article"
  const [quantityInput, setQuantityInput] = useState(""); // Neue Menge!
  const [rueckgeld, setRueckgeld] = useState(0);
  const [enteredAmount, setEnteredAmount] = useState(0);

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
  const [kundenkarte, setKundenkarte] = useState(null);

  const API_BASE_URL = 'https://tbsdigitalsolutionsbackend.onrender.com/api/kasse';


  const [salespersonName, setSalespersonName] = useState('');
  const anzahlTeile = scannedProducts.reduce((sum, product) => sum + product.quantity, 0);

  // useEffect: Berechnung des Gesamtpreises, wenn Produkte gescannt oder entfernt werden
  useEffect(() => {
    if (scannedProducts.length > 0) {
      console.log("Produkte wurden gescannt:", scannedProducts);
      calculateTotalPrice(); // Gesamtpreis neu berechnen
    }
  }, [scannedProducts]);

  // useEffect: Gesamtpreis neu berechnen, wenn sich gescannte Produkte ändern
  useEffect(() => {
    calculateTotalPrice(); // Gesamtpreis neu berechnen
  }, [scannedProducts]);

  // useEffect: Abrufen der gescannten Produkte und Rabatte beim Initialisieren
  useEffect(() => {
    fetchScannedProducts();
    fetchDiscounts();
  }, []);

  // useEffect: Dekodieren des Tokens und Setzen des Verkäufernamens
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setSalespersonName(`${decoded.vorname || "Unbekannt"} ${decoded.nachname || ""}`.trim());
      console.log("Verkäufername aus Token dekodiert:", decoded.vorname, decoded.nachname);
    }
  }, []);

  // useEffect: Kassenmodus aktivieren, wenn Token vorhanden
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setKasseMode(true); // Kassenmodus aktivieren
      onKassenModusChange(true); // Übermittelt den Modusstatus an die übergeordnete Komponente
      console.log("Kassenmodus aktiviert.");
    }
  }, []);

  // useEffect: Setzen der Kundenkarte aus der Antwort des Servers
  useEffect(() => {
    console.log("Antwort von Server:", response); // Debugging

    // Setze die Kundenkarte aus der Antwort
    if (response?.kundenkarte) {
      setKundenkarte({
        kundenkartennummer: response.kundenkarte.kundenkartennummer,
        vorname: response.kundenkarte.vorname,
        nachname: response.kundenkarte.nachname,
        plz: response.kundenkarte.plz,
        ort: response.kundenkarte.ort
      });
      console.log("Kundenkarte aus der Antwort gesetzt:", response.kundenkarte);
    } else {
      setKundenkarte(null);
      console.log("Keine gültige Kundenkarte im Response.");
    }
  }, [response]);

  // useEffect: Debugging der aktuellen Kundenkarte
  useEffect(() => {
    console.log("Aktuelle Kundenkarte:", kundenkarte); // Debugging

    // Überprüfen, ob die Kundenkarte gesetzt wurde
    if (kundenkarte) {
      console.log("Kundenkarte gefunden:", kundenkarte);
    } else {
      console.log("Kundenkarte ist null.");
    }
  }, [kundenkarte]);

  // Funktion zum Abrufen der gescannten Produkte
  const fetchScannedProducts = async () => {
    setLoading(true); // Ladeanimation starten
    try {
      const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/products/scanned-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Debugging der Antwort
      console.log("Antwort von Server:", response.data);

      // Kundenkarte direkt aus der Antwort setzen
      if (response.data.kundenkarte && response.data.kundenkarte.kundenkartennummer !== "Keine Karte") {
        setKundenkarte({
          kundenkartennummer: response.data.kundenkarte.kundenkartennummer,
          vorname: response.data.kundenkarte.vorname,
          nachname: response.data.kundenkarte.nachname,
          plz: response.data.kundenkarte.plz,
          ort: response.data.kundenkarte.ort,
        });
        console.log("Kundenkarte aus der Antwort gesetzt:", response.data.kundenkarte);
      } else {
        setKundenkarte(null); // Keine gültige Kundenkarte
        console.log("Keine gültige Kundenkarte in der Antwort gefunden.");
      }

      setScannedProducts(response.data.data); // Gescannten Produkte setzen
      console.log("Gespeicherte Produkte und Kundenkarte erfolgreich abgerufen");
    } catch (error) {
      console.error('Fehler beim Abrufen der gescannten Produkte:', error);
    } finally {
      setLoading(false); // Ladeanimation stoppen
    }
  };




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






  // Diese Funktion wird aufgerufen, wenn der Benutzer auf einen Betrag wie "50" klickt
  const handleAmountClick = (amount) => {
    setBetrag(amount.toString());
    handleConfirm(); // Direkt bestätigen
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
    setErrorMessage(""); // Fehler zurücksetzen
    setSuccessMessage(""); // Erfolgsmeldung zurücksetzen
    setIsConfirmed(false); // Bestätigung zurücksetzen

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Nicht authentifiziert.");
      return;
    }

    try {
      setLoading(true);

      // 🧮 Gesamtbetrag der Produkte berechnen
      const totalDue = scannedProducts.reduce((total, product) => {
        const quantity = product.quantity || 1;
        return total + (product.price * quantity);
      }, 0);

      const totalDueRounded = parseFloat(totalDue.toFixed(2));
      console.log("💰 Gesamtbetrag (totalDueRounded):", totalDueRounded);

      // 🧾 Betrag automatisch übernehmen, wenn ein Betrag eingegeben wird
      if (betrag) {
        // Wenn der Betrag eingegeben wird, überprüfen und als "eingegebenen Betrag" setzen
        const enteredAmount = parseFloat(betrag);
        console.log("💳 Eingegebener Betrag:", enteredAmount);

        if (enteredAmount < totalDueRounded) {
          setErrorMessage(`Der eingegebene Betrag reicht nicht aus. Es fehlen CHF ${(totalDueRounded - enteredAmount).toFixed(2)}.`);
          setLoading(false);
          return;
        }

        const change = parseFloat((enteredAmount - totalDueRounded).toFixed(2));
        console.log("💸 Rückgeld:", change);

        // Zahlung bestätigen
        setRueckgeld(change);

        setIsConfirmed(true);
        setIsPaying(false);
        setBetrag(""); // Den Betrag zurücksetzen
        setLoading(false);
        return; // Zahlung abgeschlossen, raus hier!
      }

      // ✅ ZAHLUNG BESTÄTIGEN, WENN EIN BETRAG KLICKED WIRD (Z.B. 50)
      if (isPaying) {
        if (betrag && !isNaN(parseFloat(betrag))) {
          const enteredAmount = parseFloat(betrag);
          console.log("💳 Eingegebener Betrag:", enteredAmount);

          if (enteredAmount < totalDueRounded) {
            setErrorMessage(`Der eingegebene Betrag reicht nicht aus. Es fehlen CHF ${(totalDueRounded - enteredAmount).toFixed(2)}.`);
            setLoading(false);
            return;
          }

          const change = parseFloat((enteredAmount - totalDueRounded).toFixed(2));
          console.log("💸 Rückgeld:", change);

          // Zahlung bestätigen
          setRueckgeld(change);
          setSuccessMessage(`Zahlung von CHF ${enteredAmount.toFixed(2)} erhalten. Rückgeld: CHF ${change.toFixed(2)}.`);

          setIsConfirmed(true);
          setIsPaying(false);
          setBetrag(""); // Den Betrag zurücksetzen
          setLoading(false);
          return; // Zahlung abgeschlossen, raus hier!
        }
      }

      // ✅ PREIS ÄNDERN
      if (isChangingPrice) {
        if (!selectedProducts.length) {
          setErrorMessage("Bitte wählen Sie mindestens ein Produkt aus.");
          setLoading(false);
          return;
        }

        if (!price || isNaN(parseFloat(price))) {
          setErrorMessage("Bitte geben Sie einen gültigen Preis ein.");
          setLoading(false);
          return;
        }

        const productArray = selectedProducts.map((article_number) => ({
          article_number
        }));

        const response = await axios.put(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/products/update-price",
          {
            selectedProducts: productArray,
            price: parseFloat(price)
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
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
          setPrice("");
        } else {
          setErrorMessage("Fehler beim Aktualisieren der Preise.");
        }

        setLoading(false);
        return; // Preisänderung fertig!
      }

      // ✅ MENGE ÄNDERN
      if (isChangingQuantity) {
        if (!selectedProducts.length) {
          setErrorMessage("Bitte wählen Sie mindestens ein Produkt aus.");
          setLoading(false);
          return;
        }

        if (!quantity || isNaN(parseFloat(quantity))) {
          setErrorMessage("Bitte geben Sie eine gültige Menge ein.");
          setLoading(false);
          return;
        }

        const productArray = selectedProducts.map((article_number) => ({
          article_number
        }));

        const response = await axios.put(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/products/update-quantity",
          {
            selectedProducts: productArray,
            quantity: parseFloat(quantity)
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
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
          setQuantity("");
        } else {
          setErrorMessage("Fehler beim Aktualisieren der Menge.");
        }

        setLoading(false);
        return; // Mengenänderung fertig!
      }

      // ✅ ARTIKEL SCANNEN
      if (!articleNumber) {
        setErrorMessage("Bitte geben Sie eine Artikelnummer ein.");
        setLoading(false);
        return;
      }

      if (!quantityInput || isNaN(parseFloat(quantityInput))) {
        setErrorMessage("Bitte geben Sie eine gültige Menge ein.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/products/scan",
        {
          article_number: articleNumber,
          quantity: parseFloat(quantityInput)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200 && response.data) {
        setScannedProducts(response.data);
        setSuccessMessage(
          `Artikel ${articleNumber} mit Menge ${quantityInput} erfolgreich gescannt.`
        );

        setArticleNumber("");
        setQuantityInput("");
        setStep("quantity");
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


  const goToSettings = () => {
    navigate('/drucker');
  };


  const goToKundenSuche = () => {
    navigate('/kundensuche');
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
            <button onClick={cancelPopup} className="btn btn-cancel">Abbrechen</button>
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
              <button style={{ backgroundColor: '	#FDFF00', color: 'black' }} className='btn'>Verkauf</button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button className='btn' onClick={handleDailyClose}>Tagesabschluss</button>
              <button className='btn' onClick={toggleScanInput}>Artikel scannen</button>
              <button className='btn' onClick={toggleDiscounts} disabled={selectedProducts.length === 0}>Pos. Rabatt</button>
              <button className='btn' onClick={toggleBonAbbruch}>Bon Abbruch</button>

              {/* Kunden- und Transaktionsbuttons */}
              <button className='btn' onClick={goToKundenSuche}>Kunden suchen</button>


              <button className='btn' onClick={handleCustomerCardClick}>Kundenkarte</button>

              {/* Weitere Funktionen */}
              <button className='btn'>GS-Karte</button>
              <button className='btn' onClick={toggleBonParkieren} disabled={selectedProducts.length === 0}>
                Bon Parkieren
              </button>
              <button className='btn btn-storno' onClick={addStornoCost}>
                Storno-Kosten hinzufügen
              </button>


              <button className='btn'>Artikel suchen</button>


              <button onClick={() => deleteSelectedProducts()} disabled={selectedProducts.length === 0} className='btn'>
                Pos. löschen
              </button>
              {/* Unbenutzte Buttons */}
              <button className='btn'>Anzahlung</button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button className='btn' onClick={goToProductDetails} >Artikel Detail</button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button className='btn'></button>
              <button onClick={toggleLastReciepts} className="btn sign-out-button">
                <FontAwesomeIcon icon={faPrint} />
              </button>
              <button className='btn' onClick={goToSettings}>Einstellungen</button>
              <button className='btn'>Kunden Detail</button>




              <button className='btn' onClick={handleCashierSwitch}>Kassierer wechseln</button>
              <button className='btn' onClick={handleDailyOverview}>Tagesübersicht</button>
              <button className='btn'>Schublade öffnen</button>
              <button className='btn' onClick={() => setIsChangingQuantity(true)}>Menge ändern</button>
              <button className='btn' onClick={() => setIsChangingPrice(true)}>Preis ändern</button>

              <button className='btn'>Kundenkarte</button>
              <button className='btn' onClick={handleGSKarteSaldo}>GS-Karte abfrage</button>
              {/* Abmelden und Wechseln */}
              <button onClick={handleSignOut} className="btn sign-out-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>






            </>
          )}
        </div>



        <div className="scanned-products-container">
          <div className="scanned-products">
            <div className="input-container">
              {!isPaying && !isChangingPrice && !isChangingQuantity && (
                <>
                  {step === "quantity" && (
                    <>
                      <label>Menge eingeben:</label>
                      <input
                        type="text"
                        className="quantity-display"
                        value={quantityInput}
                        onChange={(e) => setQuantityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (!quantityInput || isNaN(parseFloat(quantityInput))) {
                              setErrorMessage("Bitte eine gültige Menge eingeben.");
                              return;
                            }
                            setStep("article");
                            setErrorMessage("");
                          }
                        }}
                      />
                    </>
                  )}

                  {step === "article" && (
                    <>
                      <label>Artikelnummer eingeben:</label>
                      <input
                        type="text"
                        className="quantity-display"
                        value={articleNumber}
                        onChange={(e) => setArticleNumber(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleConfirm();
                          }
                        }}
                      />
                    </>
                  )}
                </>
              )}

              {/* Die anderen Eingaben bleiben wie sie sind */}
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
                  <label>Menge ändern:</label>
                  <input
                    type="text"
                    className="quantity-display"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </>
              )}
            </div>



            <div className="kasse-header" style={{ fontSize: '16px' }}>
              <h1 style={{ fontSize: '2rem', fontFamily: 'monospace', color: 'rgb(51, 51, 51)' }}>Quittung</h1>
              <h4 style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'rgb(192, 127, 71)' }}>VerkäuferIn {salespersonName}</h4>
              <div className="kundenkarte-info" style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'rgb(85, 85, 85)' }}>
                <p style={{ fontFamily: 'monospace', margin: '0.5rem 0' }}>{kundenkarte?.vorname} {kundenkarte?.nachname}</p>
                <p style={{ fontFamily: 'monospace', margin: '0.5rem 0' }}>{kundenkarte?.plz} {kundenkarte?.ort}</p>
              </div>
            </div>




            {scannedProducts.length === 0 ? (
              <p>Keine Produkte gescannt.</p>
            ) : (
              <div className="product-list">
                {scannedProducts.length === 0 ? (
                  <div className="empty">Noch keine Artikel gescannt.</div>
                ) : (
                  scannedProducts.map((product) => {
                    const quantity = Number(product.quantity).toFixed(2);
                    const showQuantity = parseFloat(quantity) > 1;

                    return (
                      <div
                        key={product.article_number}
                        className={`product-item ${selectedProducts.includes(product.article_number) ? 'selected' : ''}`}
                        onClick={() => toggleSelectProduct(product.article_number)}
                      >
                        <div className="product-details">

                          {/* Artikelnummer separat */}
                          <div className="product-article-number">
                            {product.article_number}
                          </div>

                          {/* Artikelnamen separat */}
                          <div className="product-name">
                            {product.article_short_text}
                          </div>

                          <div className="product-info-row">

                            {/* Menge x Preis anzeigen, wenn Menge > 1 */}
                            {showQuantity ? (
                              <span className="product-quantity-price">
                                {quantity} x {parseFloat(product.price).toFixed(2)} CHF
                              </span>
                            ) : (
                              <span className="product-price">
                                {parseFloat(product.price).toFixed(2)} CHF
                              </span>
                            )}

                            {/* Gesamtpreis */}
                            <span className="total-price">
                              {product.finalPrice
                                ? product.finalPrice.toFixed(2)
                                : (parseFloat(product.price) * product.quantity).toFixed(2)} CHF
                            </span>
                          </div>
                        </div>

                        {/* Rabatte separat */}
                        {product.discounts?.length > 0 && (
                          <div className="product-discounts">
                            {product.discounts.map((discount, index) => (
                              <span key={index} className="discount">
                                {discount.title} ({discount.amount} CHF)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>



            )}
          </div>
          {/* Total Products - Immer anzeigen, wenn nicht bezahlt */}
          {!isConfirmed && (
            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              gap: "20px"
            }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse"
              }}>
                <tbody>
                  <tr>
                    <td style={{
                      fontWeight: "bold",
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      <strong>Subtotal</strong>
                    </td>
                    <td style={{
                      fontWeight: "bold",
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      <strong>CHF</strong>
                    </td>
                    <td style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      {totalPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{
                      padding: "10px",
                      textAlign: "center",
                      borderBottom: "1px solid #ddd"
                    }}>
                      <hr />
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      fontWeight: "bold",
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      <strong>Total</strong>
                    </td>
                    <td style={{
                      fontWeight: "bold",
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      <strong>CHF</strong>
                    </td>
                    <td style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      {totalPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      fontWeight: "bold",
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      <strong>Anzahl Teile</strong>
                    </td>
                    <td style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd"
                    }}>
                      {Math.round(scannedProducts.reduce((total, product) => total + product.quantity, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}


          {/* Gegeben und Rückgeld - Nur anzeigen, wenn bezahlt */}
          {isConfirmed && (
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

              {/* Gegeben */}
              <div style={{
                flex: 1,
                backgroundColor: "yellow",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem"
              }}>
                Gegeben<br />
                CHF {enteredAmount.toFixed(2)} {/* Der eingegebene Betrag wird hier angezeigt */}
              </div>

              {/* Rückgeld */}
              <div style={{
                flex: 1,
                backgroundColor: "#b9fbc0", // hellgrün
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem"
              }}>
                Rückgeld<br />
                CHF {rueckgeld.toFixed(2)} {/* Rückgeld wird hier angezeigt */}
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
            <button className="btn discount-btn">50 CHF</button>
            <button className="btn discount-btn">30 CHF</button>
          </div>
        )}
        <div className="numeric-keypad-container">
          <div className="currency-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button className='btn' style={{ width: '100px', padding: '10px', fontSize: '14px' }}>CHF</button>
            <button className='btn' style={{ width: '32%', padding: '10px', fontSize: '14px' }}>EUR</button>
            <button className='btn' onClick={handleShowPopup} style={{ width: '32%', padding: '10px', fontSize: '14px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
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
            <button className='btn' onClick={handleDotClick}>.</button> {/* Das Komma */}
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
            <button className="btn-200" onClick={() => handleAmountClick(200)}>
              200
            </button>
            <button className="btn-other" onClick={handlePayClick}>Bezahlen</button>
            <button style={{ backgroundColor: '#48A23F', color: 'white', padding: '8px 16px', borderRadius: '8px' }} onClick={() => handleAmountClick(50)}>50</button>
            <button style={{ backgroundColor: '#007AC2', color: 'white', padding: '8px 16px', borderRadius: '8px' }} onClick={() => handleAmountClick(100)}>100</button>
            <button style={{ backgroundColor: '#FFD700', color: 'white', padding: '8px 16px', borderRadius: '8px' }} onClick={() => handleAmountClick(10)}>10</button>
            <button style={{ backgroundColor: '#DC241F', color: 'black', padding: '8px 16px', borderRadius: '8px' }} onClick={() => handleAmountClick(20)}>20</button>
            <button className="btn-2" onClick={() => handleAmountClick(2)}>2</button>
            <button className="btn-5" onClick={() => handleAmountClick(5)}>5</button>
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