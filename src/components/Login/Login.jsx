import React, { useState } from 'react';
import './Login.scss';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
  
    // Fest codierte Benutzerdaten für den Administratorzugriff
    const adminUsername = 'admin';
    const adminPassword = '123';
  
    // Überprüfen, ob Benutzername und Passwort übereinstimmen
    if (username === adminUsername && password === adminPassword) {
      // Wenn übereinstimmen, rufen Sie die Funktion onLogin mit isAdmin=true auf
      onLogin(username, true);
    } else {
      // Andernfalls geben Sie eine Fehlermeldung aus
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
