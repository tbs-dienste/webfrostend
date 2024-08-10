import React, { useState } from 'react';
import axios from 'axios';
import './Login.scss';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter');
      const data = response.data.data;

      const user = data.find(user => user.benutzername === username && user.passwort === password);

      if (user) {
        // Speichern der User ID im lokalen Speicher
        localStorage.setItem('userId', user.id);
        onLogin(true);
        window.location.href = "/verification";
      } else {
        setError('Falscher Benutzername oder Passwort.');
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1 className="title">Willkommen zurück</h1>
        <label>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            placeholder="Passwort"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">Einloggen</button>
      </form>
    </div>
  );
};

export default Login;
