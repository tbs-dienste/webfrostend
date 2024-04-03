import React, { useState, useEffect } from 'react';

const AlleGutscheine = () => {
  const [gutscheine, setGutscheine] = useState([]);

  useEffect(() => {
    // Daten aus dem Local Storage abrufen und in den State setzen
    const gutscheineFromLocalStorage = JSON.parse(localStorage.getItem('gutscheine')) || [];
    setGutscheine(gutscheineFromLocalStorage);
  }, []);

  return (
    <div className="alle-gutscheine">
      <h2>Alle verfügbaren Gutscheincodes:</h2>
      <ul>
        {gutscheine.map(gutschein => (
          <li key={gutschein.id}>
            <span>Gutscheincode: {gutschein.gutscheincode}</span>
            <span>Betrag: {gutschein.betrag} €</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlleGutscheine;
