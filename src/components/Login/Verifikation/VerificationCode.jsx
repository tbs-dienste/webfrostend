import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VerificationCode.scss';

const VerificationCode = () => {
  const inputs = useRef([]);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputs.current.length !== 6) {
      inputs.current = Array(6).fill(null);
    }
    if (inputs.current[0]) inputs.current[0].focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert('⏰ Zeit abgelaufen. Bitte erneut einloggen.');
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
    if (value && index < 5) inputs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyCode = async () => {
    const enteredCode = inputs.current.map(i => i?.value || '').join('');
    if (enteredCode.length < 6) {
      setError('Bitte den vollständigen 6-stelligen Code eingeben.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Kein gültiger Token gefunden. Bitte erneut einloggen.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/login/verify',
        { code: enteredCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('✅ Verifizierung erfolgreich!');
      navigate('/kunden');
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        alert('❌ Zu viele Fehlversuche. Bitte erneut einloggen.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Verifizierung fehlgeschlagen.');
        inputs.current.forEach(input => {
          if (input) input.value = '';
        });
        if (inputs.current[0]) inputs.current[0].focus();
      }
    }
  };

  return (
    <div className="verification-container">
      <h2>Verifizierung erforderlich</h2>
      <p>Geben Sie den 6-stelligen Code ein, den Sie per E-Mail erhalten haben.</p>

      {error && <div className="error-message">{error}</div>}

      <div className="code-inputs">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            ref={el => inputs.current[i] = el}
            onChange={e => handleChange(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
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
