import React, { useState } from 'react';
import './Sidecar.scss';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidecar-container ${isOpen ? 'open' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>
        <div className="sidebar-content">
          <h3>Menü</h3>
          <ul>
            <li>Dashboard</li>
            <li>Drucker</li>
            <li>Transaktionen</li>
            <li>Berichte</li>
            <li>Benutzereinstellungen</li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      {/* Hauptinhalt */}
      <div className="main-content">
        <button className="open-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="content-area">
          <h1>Willkommen zum Dashboard</h1>
          <p>Hier kannst du deine wichtigsten Informationen und Einstellungen verwalten.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
