// src/components/CreateBackendPaket.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './CreateBackendPaket.scss';

const CreateBackendPaket = () => {
  const [name, setName] = useState('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [preis, setPreis] = useState('');
  const [empfohlen, setEmpfohlen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete', {
        name,
        cpu,
        ram,
        preis,
        empfohlen: empfohlen ? 1 : 0
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Fehler beim Erstellen des Pakets.');
    }
  };

  return (
    <div className="create-backend-paket">
      <h1>Neues Backend-Paket erstellen</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>CPU:</label>
          <input type="text" value={cpu} onChange={(e) => setCpu(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>RAM:</label>
          <input type="text" value={ram} onChange={(e) => setRam(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Preis:</label>
          <input type="text" value={preis} onChange={(e) => setPreis(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" checked={empfohlen} onChange={(e) => setEmpfohlen(e.target.checked)} />
            Empfohlen
          </label>
        </div>
        <button type="submit">Paket erstellen</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateBackendPaket;
