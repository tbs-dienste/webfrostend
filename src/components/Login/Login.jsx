import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login = () => {
  const [benutzername, setBenutzername] = useState('');
  const [passwort, setPasswort] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/login',
        { benutzername, passwort }
      );

      const { token, userType } = response.data;

      // ✅ Wenn kein Fehler kommt → erfolgreich eingeloggt → weiter zu /kunden
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/kunden');

    } catch (err) {
      console.error('Login Fehler:', err);

      if (err.response) {
        if (err.response.status === 403) {
          // ❌ User ist NICHT verifiziert → zu /verification
          navigate('/verification');
          return;
        }
        if (err.response.status === 400) {
          // ⚠️ Falsche Zugangsdaten
          setError(err.response.data.error || 'Benutzername oder Passwort falsch.');
          return;
        }
      }

      // ⚠️ Alle anderen Fehler
      setError('Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="benutzername">Benutzername</label>
        <input
          type="text"
          id="benutzername"
          value={benutzername}
          onChange={(e) => setBenutzername(e.target.value)}
          required
        />

        <label htmlFor="passwort">Passwort</label>
        <input
          type="password"
          id="passwort"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
};

export default Login;
