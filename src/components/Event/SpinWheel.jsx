import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./SpinWheel.scss";

const prizes = [
  { label: "10% Rabatt", color: "#8e44ad" },
  { label: "Niete 😢", color: "#c0392b" },
  { label: "5€ Gutschein", color: "#27ae60" },
  { label: "Niete 😢", color: "#c0392b" },
  { label: "20% Rabatt", color: "#f39c12" },
  { label: "Freies Getränk", color: "#1abc9c" },
  { label: "Niete 😢", color: "#c0392b" },
  { label: "Gratis Produkt", color: "#3498db" },
  { label: "Exklusiver Zugang", color: "#9b59b6" },
  { label: "Niete 😢", color: "#c0392b" },
];

const numberOfPrizes = prizes.length;
const segmentAngle = 360 / numberOfPrizes;

export default function SpinWheel({ setFullscreenMode, fullscreenMode }) {
  const [spinning, setSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Aktiviere automatisch Fullscreen, wenn SpinWheel geladen wird
    setFullscreenMode(true);
    return () => setFullscreenMode(false); // Bei Verlassen automatisch Fullscreen wieder rausnehmen
  }, [setFullscreenMode]);

  const spin = () => {
    if (spinning) return;

    const prizeIndex = Math.floor(Math.random() * numberOfPrizes);
    const randomOffset = Math.random() * segmentAngle;
    const totalRotation = 360 * 6 + (360 - (prizeIndex * segmentAngle) - randomOffset);

    setRotation(totalRotation);
    setSpinning(true);

    setTimeout(() => {
      setSelectedPrize(prizes[prizeIndex].label);
      setSpinning(false);
    }, 5000);
  };

  const exitFullscreen = () => {
    setFullscreenMode(false);
  };

  return (
    <div className="spin-wheel">
      {/* Exit Button nur wenn im Fullscreen */}
      {fullscreenMode && (
        <button onClick={exitFullscreen} className="exit-button">
          ×
        </button>
      )}

      <div className="wheel-container">
        <motion.div
          className="wheel"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: "easeOut" }}
        >
          <svg viewBox="0 0 100 100" className="wheel-svg">
            {prizes.map((prize, index) => (
              <g key={index} transform={`rotate(${index * segmentAngle} 50 50)`}>
                <path
                  d="M50 50 L50 0 A50 50 0 0 1 97.55 15.45 Z"
                  fill={prize.color}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
                <text
                  x="75"
                  y="52"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="4"
                  fill="#fff"
                  transform={`rotate(${segmentAngle / 2} 75 52)`}
                >
                  {prize.label}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
        <div className="pointer">🔻</div>
      </div>

      <button onClick={spin} disabled={spinning} className="spin-button">
        {spinning ? "Dreht..." : "DREHEN!"}
      </button>

      {selectedPrize && !spinning && (
        <div className="prize-message">
          🎉 {selectedPrize} 🎉
        </div>
      )}
    </div>
  );
}
