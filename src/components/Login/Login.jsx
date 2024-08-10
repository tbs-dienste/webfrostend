import React, { useState } from 'react';
import './Login.scss';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const adminUsername = 'admin';
    const adminPassword = '123';

    if (username === adminUsername && password === adminPassword) {
      onLogin(true);
      window.location.href = "/verification";
    } else {
      alert('Falscher Benutzername oder Passwort.');
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
        <button type="submit" className="login-button">Einloggen</button>
      </form>
    </div>
  );
};

export default Login;
