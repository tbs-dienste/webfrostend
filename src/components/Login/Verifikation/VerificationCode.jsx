import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './VerificationCode.scss';

const VerificationCode = () => {
  const inputs = useRef([]);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerExpired, setTimerExpired] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerExpired(true);
      window.location.href = '/login';
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;

    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }

    inputs.current[index].value = value;
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputs.current[index - 1].focus();
    }
  };

  const verifyCode = async () => {
    const enteredCode = inputs.current.map(input => input.value).join('');
    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter');
      const data = response.data.data;
      const user = data.find(user => user.id === parseInt(userId));

      if (user && enteredCode === user.verificationcode) {
        window.location.href = '/kunden';
        setError('');
      } else {
        setAttempts(prevAttempts => {
          const newAttempts = prevAttempts + 1;
          if (newAttempts >= 3) {
            window.location.href = '/login';
          } else {
            setError(`Der eingegebene Code ist falsch. Du hast noch ${3 - newAttempts} ${newAttempts === 2 ? 'Versuch' : 'Versuche'} übrig.`);
          }
          return newAttempts;
        });
        inputs.current.forEach(input => (input.value = ''));
        inputs.current[0].focus();
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
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
        <div className="attempts-info">
          {attempts < 3 ? `Verbleibende Versuche: ${3 - attempts}` : 'Keine Versuche mehr übrig.'}
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
