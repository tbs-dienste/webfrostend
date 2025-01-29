import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Kassenlogin.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Kassenlogin = ({ onKassenModusChange }) => {
  const [pin, setPin] = useState("");
  const [kasseMode, setKasseMode] = useState(false);

  useEffect(() => {
    // Token aus dem localStorage löschen, wenn Login angezeigt wird
    localStorage.removeItem("token");

    const token = localStorage.getItem("token");
    if (token) {
      setKasseMode(true);
      onKassenModusChange(true);
    }
  }, [onKassenModusChange]);

  const handleNumericKeypadClick = (number) => {
    setPin((prevPin) => prevPin + number);
  };

  const clearInput = () => {
    setPin("");
  };

  const handleLogin = () => {
    if (pin) {
      // Sende die PIN an den Server, um den Mitarbeiter zu ermitteln
      axios
        .post("https://tbsdigitalsolutionsbackend.onrender.com/api/kassenlogin/login", { pin })
        .then((response) => {
          if (response.data.success) {
            // Nur das Token speichern
            localStorage.setItem("token", response.data.token);
            setKasseMode(true);
            onKassenModusChange(true);
            alert("Login erfolgreich!");
            // Vollbildmodus aktivieren
            document.documentElement.requestFullscreen();
          } else {
            alert("PIN ist falsch.");
          }
        })
        .catch((error) => {
          console.error("Fehler bei der Anmeldung:", error);
          alert("Es gab einen Fehler. Versuchen Sie es später erneut.");
        });
    } else {
      alert("Bitte PIN eingeben");
    }
  };

  return (
    !kasseMode ? (
      <div className="kasse-prompt">
        <h2>Willst du den Kassenmodus starten?</h2>
        <div className="buttons">
          <button onClick={() => setKasseMode(true)} className="btn-yes">
            <i className="fas fa-check"></i> Ja
          </button>
          <button onClick={() => setKasseMode(false)} className="btn-no">
            <i className="fas fa-times"></i> Nein
          </button>
        </div>
      </div>
    ) : (
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <input
            type="password"
            className="input-display"
            value={pin}
            readOnly
            placeholder="PIN eingeben"
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
            <button className="keypad-btn" onClick={clearInput}>C</button>
            <button className="keypad-btn" onClick={() => handleNumericKeypadClick(0)}>0</button>
            <button className="keypad-btn" onClick={handleLogin}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Kassenlogin;
