import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import axios from 'axios';

const Login = () => {
  const [benutzername, setBenutzername] = useState('');
  const [passwort, setPasswort] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/login',
        { benutzername, passwort }
      );

      const { token, userType } = res.data;

      // ✅ TOKEN SAUBER SPEICHERN
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      // ✅ TOKEN GLOBAL FÜR ALLE REQUESTS
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // ✅ WEITERLEITUNG
      navigate('/kunden');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Login fehlgeschlagen'
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Benutzername"
          value={benutzername}
          onChange={(e) => setBenutzername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
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
