import React, { useState } from "react";
import axios from "axios"; // Axios importieren
import "./Kassenlogin.scss"; // Verweis auf die SCSS-Datei
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importiere FontAwesome
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"; // Importiere das 'Sign-Out' Icon

const Kassenlogin = () => {
  const [username, setUsername] = useState(""); // Zustand für den Benutzernamen
  const [pin, setPin] = useState(""); // Zustand für die PIN
  const [isPinRequired, setIsPinRequired] = useState(false); // Flag, ob PIN erforderlich ist

  const handleNumericKeypadClick = (number) => {
    if (isPinRequired) {
      setPin((prevPin) => prevPin + number);
    } else {
      setUsername((prevUsername) => prevUsername + number);
    }
  };

  const clearInput = () => {
    if (isPinRequired) {
      setPin("");
    } else {
      setUsername("");
    }
  };

  const handleLogin = () => {
    if (!isPinRequired) {
      if (username) {
        localStorage.setItem("username", username); // Benutzernamen im LocalStorage speichern
        setIsPinRequired(true);
      } else {
        alert("Bitte Benutzernamen eingeben");
      }
    } else {
      if (pin) {
        const storedUsername = localStorage.getItem("username");
        const loginData = {
          username: storedUsername,
          pin: pin,
        };

        axios
          .post("https://example.com/api/login", loginData)
          .then((response) => {
            if (response.data.success) {
              alert("Login erfolgreich!");
              // Weiterleitung oder weitere Aktionen
            } else {
              alert("Benutzername oder PIN ist falsch.");
            }
          })
          .catch((error) => {
            console.error("Fehler bei der Anmeldung:", error);
            alert("Es gab einen Fehler. Versuchen Sie es später erneut.");
          });
      } else {
        alert("Bitte PIN eingeben");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {!isPinRequired ? (
          <>
            <input
              type="text"
              className="input-display"
              value={username}
              readOnly
              placeholder="Benutzername eingeben"
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
              <button className="keypad-btn" onClick={clearInput}>
                C
              </button>
              <button
                className="keypad-btn"
                onClick={() => handleNumericKeypadClick(0)}
              >
                0
              </button>
              <button className="keypad-btn" onClick={handleLogin}>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </>
        ) : (
          <>
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
              <button className="keypad-btn" onClick={clearInput}>
                C
              </button>
              <button
                className="keypad-btn"
                onClick={() => handleNumericKeypadClick(0)}
              >
                0
              </button>
              <button className="keypad-btn" onClick={handleLogin}>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Kassenlogin;
