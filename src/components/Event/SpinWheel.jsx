import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import "./SpinWheel.scss";

const data = [
  { option: "10% Rabatt", style: { backgroundColor: "#8e44ad" } },
  { option: "Niete 😢", style: { backgroundColor: "#c0392b" } },
  { option: "5€ Gutschein", style: { backgroundColor: "#27ae60" } },
  { option: "Niete 😢", style: { backgroundColor: "#c0392b" } },
  { option: "20% Rabatt", style: { backgroundColor: "#f39c12" } },
  { option: "Freies Getränk", style: { backgroundColor: "#1abc9c" } },
  { option: "Niete 😢", style: { backgroundColor: "#c0392b" } },
  { option: "Gratis Produkt", style: { backgroundColor: "#3498db" } },
  { option: "5% Rabatt", style: { backgroundColor: "#9b59b6" } },
  { option: "Niete 😢", style: { backgroundColor: "#c0392b" } },
  { option: "15% Rabatt", style: { backgroundColor: "#e67e22" } },
];

export default function SpinWheel({ onKassenModusChange }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);

  useEffect(() => {
    onKassenModusChange?.(true);
    return () => onKassenModusChange?.(false);
  }, [onKassenModusChange]);

  const spin = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setSelectedPrize(null);
    setMustSpin(true);
  };

  return (
    <div className="spin-wrapper">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderColor={"#ddd"}
        outerBorderWidth={6}
        innerRadius={15}
        radiusLineColor={"#eee"}
        radiusLineWidth={2}
        textDistance={65}
        fontSize={14}
        onStopSpinning={() => {
          setMustSpin(false);
          setSelectedPrize(data[prizeNumber].option);
        }}
      />

      <button className="spin-button" onClick={spin} disabled={mustSpin}>
        {mustSpin ? "Dreht..." : "JETZT DREHEN!"}
      </button>

      {selectedPrize && (
        <div className="prize-message">🎉 Du hast gewonnen: <strong>{selectedPrize}</strong> 🎉</div>
      )}
    </div>
  );
}
