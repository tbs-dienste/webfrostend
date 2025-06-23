import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AktionenListe.scss';
import { Plus, Info } from 'lucide-react';

const AktionenListe = () => {
  const [aktionen, setAktionen] = useState([]);

  useEffect(() => {
    const fetchAktionen = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/aktionen', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAktionen(res.data.data);
      } catch (err) {
        console.error('Fehler beim Laden der Aktionen:', err);
      }
    };

    fetchAktionen();
  }, []);

  return (
    <div className="aktionen-liste">
        <Link to={`/aktion-erstellen`} className="details-btn">
              <Plus size={16} /> Erstellen
            </Link>
      <h2>Aktuelle Aktionen</h2>
      <div className="aktionen-grid">
        {aktionen.map((aktion) => (
          <div className="aktion-card" key={aktion.id}>
            <h3>{aktion.name}</h3>
            <div className="rabatt">
          
              <span>{(aktion.rabatt * 100).toFixed(0)} %</span>
            </div>
            <Link to={`/aktionen/${aktion.id}`} className="details-btn">
              <Info size={16} /> Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AktionenListe;
