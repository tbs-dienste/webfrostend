import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from './logo.png';

function Navbar() {
  const currentPath = window.location.pathname;
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);

  const toggleBurgerMenu = () => {
    setBurgerMenuActive(!burgerMenuActive);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  return (
    <div className={`navbar ${burgerMenuActive ? 'burger-menu-active' : ''}`}>
      <div className='logo-container'>
        <img alt='logo' className='logo' src={logo} />
      </div>

      <div className={`links ${burgerMenuActive ? 'burger-menu-active' : ''}`}>
        <Link
          to="/"
          className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
          onClick={() => setBurgerMenuActive(false)}
        >
          Home
        </Link>
        <Link
          to="/dienstleistungen"
          className={`nav-link ${currentPath === '/dienstleistungen' ? 'active' : ''}`}
          onClick={() => setBurgerMenuActive(false)}
        >
          Dienstleistungen
        </Link>

        <Link
          to="/kunden"
          className={`nav-link ${currentPath === '/kunden' ? 'active' : ''}`}
          onClick={() => setBurgerMenuActive(false)}
        >
          Kunden
        </Link>

        

        <Link
          to="/kundeerfassen"
          className={`nav-link ${currentPath === '/kundeerfassen' ? 'active' : ''}`}
          onClick={() => setBurgerMenuActive(false)}
        >
          Kunde Erfassen
        </Link>

        <Link
          to="/mitarbeiter"
          className={`nav-link ${currentPath === '/mitarbeiter' ? 'active' : ''}`}
          onClick={() => setBurgerMenuActive(false)}
        >
          Mitarbeiter 
        </Link>

        <Link
          to="/mitarbeitererfassen"
          className={`nav-link ${currentPath === '/mitarbeitererfassen' ? 'active' : ''}`}
          onClick={() => setBurgerMenuActive(false)}
        >
          Mitarbeiter Erfassen
        </Link>

        <Link
          to="/werbung"
          className={`nav-link ${currentPath === '/werbung' ? 'active' : ''}`}
          onClick={() => setBurgerMenuActive(false)}
        >
          Werbung
        </Link>
        
        {isAdmin ? (
          <>
            <Link
              to="/anmeldungen"
              className={`nav-link ${currentPath === '/anmeldungen' ? 'active' : ''}`}
              onClick={() => setBurgerMenuActive(false)}
            >
              Anmeldungen
            </Link>
            <p className='admin'>Admin</p>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`nav-link ${currentPath === '/login' ? 'active' : ''}`}
            onClick={() => setBurgerMenuActive(false)}
          >
            Login
          </Link>
        )}
        {/* Füge hier weitere Links hinzu, falls nötig */}
      </div>

      <div className={`burger-menu ${burgerMenuActive ? 'active' : ''}`} onClick={toggleBurgerMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Navbar;
