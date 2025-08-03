import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
import "./SpinWheel.scss";

const data = [
  { option: "10% Rabatt", style: { backgroundColor: "#8e44ad" } },
  { option: "Niete", style: { backgroundColor: "#c0392b" } },
  { option: "5€ Gutschein", style: { backgroundColor: "#27ae60" } },
  { option: "Niete", style: { backgroundColor: "#c0392b" } },
  { option: "20% Rabatt", style: { backgroundColor: "#f39c12" } },
  { option: "Freies Getränk", style: { backgroundColor: "#1abc9c" } },
  { option: "Niete", style: { backgroundColor: "#c0392b" } },
  { option: "Gratis Produkt", style: { backgroundColor: "#3498db" } },
  { option: "5% Rabatt", style: { backgroundColor: "#9b59b6" } },
  { option: "Niete", style: { backgroundColor: "#c0392b" } },
  { option: "15% Rabatt", style: { backgroundColor: "#e67e22" } },
];

export default function SpinWheel({ onKassenModusChange }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [alreadySpun, setAlreadySpun] = useState(false);

  useEffect(() => {
    onKassenModusChange?.(true);
    checkIfAlreadySpun();
    return () => onKassenModusChange?.(false);
  }, []);

  const checkIfAlreadySpun = async () => {
    try {
      const res = await axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/spin/check-ip");
      if (res.data.alreadySpun) {
        setAlreadySpun(true);
        setSelectedPrize(res.data.gewinn);
      }
    } catch (err) {
      console.error("Fehler beim Prüfen:", err);
    }
  };

  const saveGewinn = async (gewinn) => {
    try {
      await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/spin/save-ip", { gewinn });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler: Du hast schon einmal gedreht oder es gab ein Serverproblem.");
    }
  };
  

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
          const prize = data[prizeNumber].option;
          setMustSpin(false);
          setSelectedPrize(prize);
          setAlreadySpun(true);
          saveGewinn(prize);
        }}
      />

      <button
        className="spin-button"
        onClick={spin}
        disabled={mustSpin || alreadySpun}
      >
        {mustSpin
          ? "Dreht..."
          : alreadySpun
          ? "Du hast schon gedreht"
          : "JETZT DREHEN!"}
      </button>

      {selectedPrize && (
        <div className="prize-message">
          🎉 Du hast gewonnen: <strong>{selectedPrize}</strong> 🎉
        </div>
      )}
    </div>
  );
}
