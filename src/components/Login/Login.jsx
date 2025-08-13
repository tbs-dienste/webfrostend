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
    
      // Token speichern, egal was passiert
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
    
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
      navigate('/kunden'); // normaler Login

    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
    
        // Falls 403, aber Token im Header / Body? -> speichern und weiterleiten
        if (status === 403) {
          // Versuch Token aus Fehlerantwort zu lesen
          const token = data.token || null;
          if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          navigate('/verification');
          return;
        }
    
        if (status === 400) {
          setError(data.error || 'Benutzername oder Passwort falsch.');
          return;
        }
      }
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
          autoComplete="username"
        />

        <label htmlFor="passwort">Passwort</label>
        <input
          type="password"
          id="passwort"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
};

export default Login;
