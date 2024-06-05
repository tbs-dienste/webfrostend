import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlleGutscheine = () => {
  const [gutscheine, setGutscheine] = useState([]);

  useEffect(() => {
    // Daten von der API abrufen und in den State setzen
    const fetchGutscheine = async () => {
      try {
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/gutscheine');
        setGutscheine(response.data.data);
      } catch (error) {
        console.error(error);
        alert('Es gab ein Problem beim Abrufen der Gutscheine. Bitte versuchen Sie es später erneut.');
      }
    };

    fetchGutscheine();
  }, []);

  return (
    <div className="alle-gutscheine">
      <h2>Alle verfügbaren Gutscheincodes:</h2>
      <ul>
        {gutscheine.map(gutschein => (
          <li key={gutschein.id}>
            <span>Gutscheincode: {gutschein.gutscheincode}</span>
            <span>Betrag: {gutschein.betrag} CHF</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlleGutscheine;
