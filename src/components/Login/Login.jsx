// Login.jsx
import React, { useState } from 'react';
import './Login.scss';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'Gast' && password === '240824') {
      window.location.href = '/anmeldung';
    } else if (username === 'admin' && password === '123') {
      // Setze den Admin-Status in den lokalen Speicher
      localStorage.setItem('isAdmin', true);
      window.location.href = '/anmeldungen';
    } else {
      alert('Falscher Benutzername oder Passwort.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <label>
          Benutzername:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Passwort:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Einloggen</button>
      </form>
    </div>
  );
};

export default Login;
