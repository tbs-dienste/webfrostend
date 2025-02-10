import React from 'react';
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import './GSKarteAbfrage.scss'; // Importiere die SCSS-Datei
import logo from '../../logo.png';

const GSKarteAbfrage = () => {
  return (
    <div className="gskarte-abfrage">
      {/* Logo in schwarzer Box oben rechts */}
      <div className="logo-container">
        <img src={logo} alt="TBS Solutions Logo" className="logo" />
      </div>
      
      {/* Inhalte zentriert */}
      <div className="content">
        <h1 className="title">💳 Konto Stand abfragen</h1>
        <p className="subtitle">Bitte scannen Sie eine Karte</p>
        <p className="subtitle">Veuillez scanner une carte</p>
        <p className="subtitle">Si prega di scansionare una carta</p>
      </div>
      
      {/* Link-Leiste */}
      <div className="button-bar">
        <Link to="#" className="btn">🏠 Home</Link>
        {[...Array(8)].map((_, index) => (
          <span key={index} className="btn disabled" style={{ padding: '0 60px' }}>X</span>
        ))}
        <Link to="/kasse" className="btn btn-danger">
          <FaSignOutAlt className="icon" /> Exit
        </Link>
      </div>
    </div>
  );
};

export default GSKarteAbfrage;