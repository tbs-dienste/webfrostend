import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VerificationCode.scss';

const VerificationCode = () => {
  const inputs = useRef([]);
  const [error, setError] = useState('');
  const [userCode, setUserCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Kein Token gefunden, zurück zum Login!');
      // Hier NICHT sofort navigieren, sondern Fehler anzeigen
      // Navigation erfolgt erst, wenn Benutzer selbst reagiert (z.B. Button)
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/me')
      .then(res => {
        if (!res.data.verificationcode) {
          setError('Kein Verifizierungscode gefunden. Bitte erneut anmelden.');
          localStorage.removeItem('token');
          return;
        }
        setUserCode(res.data.verificationcode);

        if (inputs.current[0]) inputs.current[0].focus();
      })
      .catch(() => {
        setError('Fehler beim Laden der Verifizierungsdaten.');
        localStorage.removeItem('token');
      });
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert('Zeit abgelaufen. Bitte erneut einloggen.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;

    inputs.current[index].value = value;

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyCode = () => {
    const enteredCode = inputs.current.map(i => i?.value || '').join('');
    if (enteredCode.length < 6) {
      setError('Bitte den vollständigen 6-stelligen Code eingeben.');
      return;
    }
    if (enteredCode === userCode) {
      alert('Verifizierung erfolgreich!');
      navigate('/kunden');
    } else {
      const tries = attempts + 1;
      setAttempts(tries);
      if (tries >= 3) {
        alert('Zu viele Fehlversuche. Bitte erneut anmelden.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(`Falscher Code. Noch ${3 - tries} Versuch(e).`);
        inputs.current.forEach(i => { if(i) i.value = ''; });
        if (inputs.current[0]) inputs.current[0].focus();
      }
    }
  };

  return (
    <div className="verification-container">
      <h2>Verifizierung erforderlich</h2>
      <p>Bitte geben Sie den 6-stelligen Code ein, den Sie per E-Mail erhalten haben.</p>

      {error && <div className="error-message">{error}</div>}

      <div className="code-inputs">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            ref={el => inputs.current[i] = el}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      <button onClick={verifyCode} className="verify-button">Code überprüfen</button>
      <p>Verbleibende Zeit: {timeLeft} Sekunden</p>
    </div>
  );
};

export default VerificationCode;
