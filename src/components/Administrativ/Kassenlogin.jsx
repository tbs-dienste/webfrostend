import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Kassenlogin.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Kassenlogin = ({ onKassenModusChange }) => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleNumericKeypadClick = (number) => {
    setPin((prevPin) => prevPin + number);
  };

  const clearInput = () => {
    setPin("");
  };

  const handleLogin = async () => {
    if (!pin) {
      alert("Bitte PIN eingeben.");
      return;
    }

    try {
      const response = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/kassenlogin/login",
        { pin }
      );

      console.log("Antwort vom Server:", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        onKassenModusChange(true);

        navigate("/kassenlogin");

        setTimeout(() => window.location.reload(), 100);
      } else {
        alert("PIN ist falsch oder keine Berechtigung.");
      }
    } catch (error) {
      console.error("Fehler bei der Anmeldung:", error);
      alert("Fehler beim Login. Versuchen Sie es später erneut.");
    }
  };

  useEffect(() => {
    // Überprüfen, ob der Token vorhanden ist
    const token = localStorage.getItem("token");
    if (token) {
      // Falls der Token vorhanden ist, wird der Kassenmodus automatisch aktiviert
      onKassenModusChange(true); // Übermittelt den Modusstatus an die übergeordnete Komponente
      navigate("/kasse");
    }
  }, [onKassenModusChange, navigate]);

  return (
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
            <button key={number} onClick={() => handleNumericKeypadClick(number)} className="keypad-btn">
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
  );
};

export default Kassenlogin;
