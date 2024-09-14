import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import './WheelOfFortune.scss';

const WheelOfFortune = () => {
  const data = [
    { option: "100% Rabatt", style: { backgroundColor: "#FF6347" } },
    { option: "Verloren", style: { backgroundColor: "#A9A9A9" } }, // Grau für Verloren
    { option: "20% Rabatt", style: { backgroundColor: "#FFD700" } },
    { option: "10% Rabatt", style: { backgroundColor: "#40E0D0" } },
    { option: "Verloren", style: { backgroundColor: "#A9A9A9" } }, // Grau für Verloren
    { option: "Notentoollizenz 1 Monat", style: { backgroundColor: "#FF69B4" } },
    { option: "Verloren", style: { backgroundColor: "#A9A9A9" } }, // Grau für Verloren
    { option: "Kinotickets", style: { backgroundColor: "#9370DB" } },
    { option: "Verloren", style: { backgroundColor: "#A9A9A9" } }, // Grau für Verloren
    { option: "40% Rabatt", style: { backgroundColor: "#87CEEB" } },
  ];

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpun, setHasSpun] = useState(false); // Track if user has spun
  const [showOverlay, setShowOverlay] = useState(false); // Track if overlay should be shown

  const handleSpinClick = () => {
    if (hasSpun) return; // Prevent spinning if already spun

    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setHasSpun(true);
  };

  return (
    <div className={`wheel-container ${showOverlay ? 'blurred' : ''}`}>
      <h2 className="wheel-title">Drehe das Glücksrad!</h2>
      <div className="wheel-wrapper">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
            setShowOverlay(true); // Show overlay when spinning stops
          }}
          textColors={["#ffffff"]}
        />
      </div>
      <button onClick={handleSpinClick} className={`spin-button ${hasSpun ? 'disabled' : ''}`} disabled={hasSpun}>
        Drehen
      </button>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>{data[prizeNumber].option === "Verloren" ? "Leider verloren!" : `Herzlichen Glückwunsch! Du hast ${data[prizeNumber].option} gewonnen!`}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default WheelOfFortune;
