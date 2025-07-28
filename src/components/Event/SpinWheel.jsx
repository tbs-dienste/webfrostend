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
  { label: "5% Rabatt", color: "#9b59b6" },
  { label: "Niete 😢", color: "#c0392b" },
  { label: "15% Rabatt", color: "#e67e22" },
];

const numberOfPrizes = prizes.length;
const segmentAngle = 360 / numberOfPrizes;

export default function SpinWheel({ onKassenModusChange }) {
  const [spinning, setSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    onKassenModusChange?.(true);
    return () => onKassenModusChange?.(false);
  }, [onKassenModusChange]);

  const spin = () => {
    if (spinning) return;

    const prizeIndex = Math.floor(Math.random() * numberOfPrizes);
    const randomOffset = Math.random() * segmentAngle;
    const fastRotations = 360 * 5;
    const slowRotation = 360 - prizeIndex * segmentAngle - randomOffset;

    setSelectedPrize(null);
    setSpinning(true);
    setRotation((prev) => prev + fastRotations + slowRotation);

    setTimeout(() => {
      setSelectedPrize(prizes[prizeIndex].label);
      setSpinning(false);
    }, 5000);
  };

  return (
    <div className="spin-wheel">
      <div className="wheel-container">
        <motion.div
          className="wheel"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.33, 1, 0.68, 1] }}
        >
          <svg viewBox="0 0 100 100" className="wheel-svg">
            {prizes.map((prize, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              const largeArc = segmentAngle > 180 ? 1 : 0;

              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

              return (
                <g key={index}>
                  <path
                    d={`M50 50 L${x1} ${y1} A50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={prize.color}
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                  <text
                    x="50"
                    y="20"
                    transform={`rotate(${startAngle + segmentAngle / 2} 50 50)`}
                    textAnchor="middle"
                    fontSize="4"
                    fill="#fff"
                    fontWeight="bold"
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
        <div className="pointer">▼</div>
      </div>

      <button onClick={spin} disabled={spinning} className="spin-button">
        {spinning ? "Dreht..." : "DREHEN!"}
      </button>

      {selectedPrize && !spinning && (
        <div className="prize-message">🎉 {selectedPrize} 🎉</div>
      )}
    </div>
  );
}
