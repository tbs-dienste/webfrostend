import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
import "./SpinWheel.scss";

export const data = [
  { option: "Europapark Ticket", style: { backgroundColor: "#e84393" }, canWin: false, expensive: true },
  { option: "VIP Europapark Paket", style: { backgroundColor: "#d35400" }, canWin: false, expensive: true },
  { option: "Luxus-Wochenende", style: { backgroundColor: "#2c3e50" }, canWin: false, expensive: true },
  { option: "Apple iPhone", style: { backgroundColor: "#f1c40f" }, canWin: false, expensive: true },
  { option: "Helikopterflug Erlebnis", style: { backgroundColor: "#16a085" }, canWin: false, expensive: true },
  { option: "10% Rabatt", style: { backgroundColor: "#8e44ad" }, canWin: true },
  { option: "5€ Gutschein", style: { backgroundColor: "#27ae60" }, canWin: true },
  { option: "20% Rabatt", style: { backgroundColor: "#f39c12" }, canWin: true },
  { option: "Freies Getränk", style: { backgroundColor: "#1abc9c" }, canWin: true },
  { option: "Gratis Produkt", style: { backgroundColor: "#3498db" }, canWin: true },
  { option: "5% Rabatt", style: { backgroundColor: "#9b59b6" }, canWin: true },
  { option: "15% Rabatt", style: { backgroundColor: "#e67e22" }, canWin: true },
  { option: "Niete", style: { backgroundColor: "#c0392b" }, canWin: true },
];

export default function SpinWheel({ onKassenModusChange }) {
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [mustStartSpinning, setMustStartSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [alreadySpun, setAlreadySpun] = useState(false);
  const [email, setEmail] = useState("");
  const [emailPopup, setEmailPopup] = useState(true);

  useEffect(() => {
    onKassenModusChange?.(true);
    checkIfAlreadySpun();
    return () => onKassenModusChange?.(false);
  }, []);

  const checkIfAlreadySpun = async () => {
    try {
      const res = await axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/spin/check-ip");
      if (!res.data.allowed) {
        setAlreadySpun(true);
        setSelectedPrize(res.data.gewinn || "Leider verloren");
        setEmailPopup(false);
      }
    } catch (err) {
      console.error("Fehler beim Prüfen:", err.response?.data || err);
    }
  };

  const saveGewinn = async (gewinn) => {
    try {
      const res = await axios.post("https://tbsdigitalsolutionsbackend.onrender.com/api/spin/save-ip", { gewinn, email });
      if (!res.data.success) alert(res.data.error || "Fehler beim Speichern.");
    } catch (err) {
      console.error("Fehler beim Speichern:", err.response?.data || err);
      alert(err.response?.data?.error || "Fehler beim Speichern. Versuche es später erneut.");
    }
  };

  const spin = () => {
    if (!email) {
      alert("Bitte zuerst deine E-Mail eingeben!");
      return;
    }

    // nur gewinnbare Preise auswählen
    const winIndexes = data.map((d,i) => d.canWin ? i : -1).filter(i => i >= 0);
    const finalPrizeIndex = winIndexes[Math.floor(Math.random() * winIndexes.length)];

    setSelectedPrize(null);
    setMustStartSpinning(true);
    setPrizeNumber(finalPrizeIndex); // Wheel dreht automatisch dorthin

    // Gewinn nach Animation anzeigen (Wheel hat onStopSpinning Callback)
  };

  const onStopSpinning = () => {
    const finalPrize = data[prizeNumber].option;
    setSelectedPrize(finalPrize);
    setAlreadySpun(true);
    saveGewinn(finalPrize);
    setMustStartSpinning(false);
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
        mustStartSpinning={mustStartSpinning}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderColor="#ddd"
        outerBorderWidth={6}
        innerRadius={15}
        radiusLineColor="#eee"
        radiusLineWidth={2}
        textDistance={65}
        fontSize={14}
        onStopSpinning={onStopSpinning}
        spinDuration={0.5 + Math.random() * 1} // Dauer in Sekunden, variiert für realistisches Drehen
      />

      <button
        className="spin-button"
        onClick={spin}
        disabled={mustStartSpinning || alreadySpun || emailPopup}
      >
        {mustStartSpinning
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
