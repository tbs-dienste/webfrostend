import React, { useState } from 'react';
import axios from 'axios';
import './Login.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // POST-Anfrage zum Backend senden
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/login', {
        benutzername: username,
        passwort: password,
      });

      // Erfolgreiches Login
      const { token, isAdmin } = response.data; // Stelle sicher, dass die Antwort diese Struktur hat
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', isAdmin); // Speichere die Admin-Rolle
      // Hier kannst du eine Redirect-Logik hinzufügen, z.B. zu einer geschützten Route
      window.location.href = '/'; // Redirect zur Startseite
    } catch (err) {
      console.error('Login-Fehler:', err);
      setError('Benutzername oder Passwort ist falsch.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Einloggen</button>
      </form>
    </div>
  );
};

export default Login;
