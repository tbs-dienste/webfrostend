import React, { useRef, useState, useEffect } from 'react';
import './VerificationCode.scss';

const VerificationCode = () => {
  const inputs = useRef([]);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // Timer initialisieren
  const [timerExpired, setTimerExpired] = useState(false); // Flag für den Timer

  const codeToVerify = '111111'; // Der richtige Verifizierungscode

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerExpired(true);
      window.location.href = '/login'; // Weiterleitung zur Login-Seite
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return; // Nur Zahlen erlauben

    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }

    // Setze den Wert im aktuellen Input
    inputs.current[index].value = value;
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputs.current[index - 1].focus();
    }
  };

  const verifyCode = () => {
    const enteredCode = inputs.current.map(input => input.value).join('');
    if (enteredCode === codeToVerify) {
      window.location.href = '/kunden';
      setError('');
    } else {
      setError('Der eingegebene Code ist falsch. Bitte versuche es erneut.');
      inputs.current.forEach(input => (input.value = ''));
      inputs.current[0].focus();
    }
  };

  return (
    <div className="background-container">
      <div className="form-container">
        <h1>Verifizierung</h1>
        <p>Bitte gib deinen Verifizierungscode ein.</p>
        <div className="input-wrapper">
          {Array.from({ length: 6 }, (_, index) => (
            <input
              key={index}
              type="tel"
              maxLength="1"
              className="verification-code-input"
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <div className="countdown-timer">
          {timerExpired ? 'Die Zeit ist abgelaufen.' : `Verbleibende Zeit: ${timeLeft} Sekunden`}
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="verify-button" onClick={verifyCode}>
          Verifizieren
        </button>
      </div>
    </div>
  );
};

export default VerificationCode;
