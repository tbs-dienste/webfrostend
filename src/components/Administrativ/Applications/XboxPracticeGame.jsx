import React, { useEffect, useState } from "react";
import "./XboxPracticeGame.scss";

const XboxPracticeGame = () => {
  const [score, setScore] = useState(0);
  const [currentCombo, setCurrentCombo] = useState([]);
  const [message, setMessage] = useState("Drücke die richtige Taste!");

  const buttonNames = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT"];

  const generateCombo = () => {
    const comboLength = Math.floor(Math.random() * 3) + 1;
    const combo = [];
    while (combo.length < comboLength) {
      const randBtn = buttonNames[Math.floor(Math.random() * buttonNames.length)];
      if (!combo.includes(randBtn)) combo.push(randBtn);
    }
    setCurrentCombo(combo);
    setMessage(`Drücke: ${combo.join(" + ")}`);
  };

  const checkCombo = (gp) => {
    const pressedButtons = [];
    gp.buttons.forEach((btn, idx) => {
      if (btn.pressed) pressedButtons.push(buttonNames[idx]);
    });

    if (currentCombo.every((b) => pressedButtons.includes(b)) && currentCombo.length > 0) {
      setScore((prev) => prev + 1);
      setMessage("✅ Richtig! Punkte +1");
      generateCombo();
    }
  };

  const handleGamepad = () => {
    const gamepads = navigator.getGamepads();
    if (!gamepads) return;
    const gp = gamepads[0];
    if (!gp) return;
    checkCombo(gp);
  };

  useEffect(() => {
    generateCombo();
    const interval = setInterval(handleGamepad, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="game-container">
      <h1 className="game-title">Xbox Controller Übung</h1>
      <p className="game-message">{message}</p>
      <p className="game-score">Score: {score}</p>
      <div className="combo-container">
        {currentCombo.map((btn, i) => (
          <div key={i} className="combo-button">
            {btn}
          </div>
        ))}
      </div>
    </div>
  );
};

export default XboxPracticeGame;
