import { useState, useEffect, useRef } from "react";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
import "./SpinWheel.scss";

export const data = [
  { option: "Europapark Ticket", style: { backgroundColor: "#e84393" }, enabled: true, expensive: true },
  { option: "VIP Europapark Paket", style: { backgroundColor: "#d35400" }, enabled: true, expensive: true },
  { option: "Luxus-Wochenende", style: { backgroundColor: "#2c3e50" }, enabled: true, expensive: true },
  { option: "Apple iPhone", style: { backgroundColor: "#f1c40f" }, enabled: true, expensive: true },
  { option: "Helikopterflug Erlebnis", style: { backgroundColor: "#16a085" }, enabled: true, expensive: true },
  { option: "10% Rabatt", style: { backgroundColor: "#8e44ad" }, enabled: true },
  { option: "5€ Gutschein", style: { backgroundColor: "#27ae60" }, enabled: true },
  { option: "20% Rabatt", style: { backgroundColor: "#f39c12" }, enabled: true },
  { option: "Freies Getränk", style: { backgroundColor: "#1abc9c" }, enabled: true },
  { option: "Gratis Produkt", style: { backgroundColor: "#3498db" }, enabled: true },
  { option: "5% Rabatt", style: { backgroundColor: "#9b59b6" }, enabled: true },
  { option: "15% Rabatt", style: { backgroundColor: "#e67e22" }, enabled: true },
  { option: "Niete", style: { backgroundColor: "#c0392b" }, enabled: true },
];

export default function SpinWheel({ onKassenModusChange }) {
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [alreadySpun, setAlreadySpun] = useState(false);
  const [email, setEmail] = useState("");
  const [emailPopup, setEmailPopup] = useState(true);
  const spinningRef = useRef(false);

  useEffect(() => {
    onKassenModusChange?.(true);
    checkIfAlreadySpun();
    return () => onKassenModusChange?.(false);
  }, []);

  const checkIfAlreadySpun = async () => {
    try {
      const res = await axios.get("/api/spin/check-ip");
      if (res.data.alreadySpun) {
        setAlreadySpun(true);
        setSelectedPrize(res.data.gewinn || "Leider verloren");
        setEmailPopup(false);
      }
    } catch (err) {
      console.error("Fehler beim Prüfen:", err);
    }
  };

  const saveGewinn = async (gewinn) => {
    try {
      await axios.post("/api/spin/save-ip", { gewinn, email });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern. Versuche es später erneut.");
    }
  };

  const spin = () => {
    if (!email) {
      alert("Bitte zuerst deine E-Mail eingeben!");
      return;
    }

    setEmailPopup(false);
    setSelectedPrize(null);
    spinningRef.current = true;

    let index = 0;
    let slowCounter = 0;
    const expensiveIndexes = data.map((d,i) => d.expensive ? i : -1).filter(i => i >= 0);

    // finale "echte" Gewinn-Preise auswählen
    const enabledIndexes = data.map((d,i) => d.enabled && !d.expensive ? i : -1).filter(i => i >= 0);
    const finalPrizeIndex = enabledIndexes[Math.floor(Math.random() * enabledIndexes.length)];

    const interval = setInterval(() => {
      if (!spinningRef.current) return clearInterval(interval);

      // langsame Phase für teure Preise
      if (expensiveIndexes.includes(index) && slowCounter < 4) {
        slowCounter++;
        setPrizeNumber(index);
        // zusätzliche Verzögerung
        setTimeout(()=>{}, 200);
      }

      setPrizeNumber(index);
      index = (index + 1) % data.length;

      // Stop wenn finalPrize erreicht & langsame Phasen vorbei
      if (index === finalPrizeIndex && slowCounter >= 4) {
        clearInterval(interval);
        spinningRef.current = false;
        setSelectedPrize(data[finalPrizeIndex].option);
        setAlreadySpun(true);
        saveGewinn(data[finalPrizeIndex].option);
      }
    }, 100);
  };

  return (
    <div className="spin-wrapper">
      {emailPopup && !alreadySpun && (
        <div className="email-popup">
          <h2>Deine E-Mail eingeben</h2>
          <input
            type="email"
            placeholder="E-Mail Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => { if(email) setEmailPopup(false); }}>Bestätigen</button>
        </div>
      )}

      <Wheel
        mustStartSpinning={spinningRef.current}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderColor={"#ddd"}
        outerBorderWidth={6}
        innerRadius={15}
        radiusLineColor={"#eee"}
        radiusLineWidth={2}
        textDistance={65}
        fontSize={14}
        onStopSpinning={() => {}}
      />

      <button
        className="spin-button"
        onClick={spin}
        disabled={spinningRef.current || alreadySpun || emailPopup}
      >
        {spinningRef.current
          ? "Dreht..."
          : alreadySpun
          ? "Du hast schon gedreht"
          : "JETZT DREHEN!"}
      </button>

      {selectedPrize && (
        <div className="prize-message">
          🎉 {selectedPrize} 🎉
        </div>
      )}
    </div>
  );
}
