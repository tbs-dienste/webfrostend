import React, { useState } from 'react';
import './Login.scss';
import { hash, genSalt, compare } from 'bcryptjs'; // Importiere die bcryptjs-Bibliothek für das Hashing

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Generiere ein zufälliges Salz
    const salt = await genSalt(10); // Die Zahl 10 gibt die Anzahl der Runden für das Salting an

    // Hash das eingegebene Passwort mit dem generierten Salz
    const hashedPassword = await hash(password, salt);

    // Hier sollten die gehashten Passwörter mit den gespeicherten gehashten Passwörtern verglichen werden
    // Statt direkten Vergleich verwenden wir hier zur Demonstration eine feste Zuordnung von Benutzerdaten und Passwort-Hashes
    const users = {
      'Gast': '$2a$10$LpVTwdp/.WyDoZR8RqIhwORV05y4AMGph9g0qrLZ0wr4cPByVZ8LO', // Beispielhaft gehashtes Passwort für 'Gast'
      'admin': '$2a$10$kzo8d3zFjKD1m5HcsPBVzOCGImHqRcF6eUbvfgYkgnWs11qHvJyri' // Beispielhaft gehashtes Passwort für 'admin'
    };

    if (users[username] && await compare(hashedPassword, users[username])) { // Vergleiche die Passwort-Hashes
      if (username === 'admin') {
        localStorage.setItem('isAdmin', true);
        window.location.href = '/anmeldungen';
      } else {
        window.location.href = '/anmeldung';
      }
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
