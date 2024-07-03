import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';

function Navbar({ isAdmin, onLogout }) {
  const currentPath = window.location.pathname;
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [warenkorbCount, setWarenkorbCount] = useState(0);

  useEffect(() => {
    const savedWarenkorb = JSON.parse(localStorage.getItem('warenkorb')) || [];
    setWarenkorbCount(savedWarenkorb.length);
  }, []);

  const toggleBurgerMenu = () => {
    setBurgerMenuActive(!burgerMenuActive);
  };

  return (
    <div className={`navbar ${burgerMenuActive ? 'burger-menu-active' : ''}`}>
      <div className='container'>
        <div className={`menu-icon ${burgerMenuActive ? 'active' : ''}`} onClick={toggleBurgerMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`nav-elements ${burgerMenuActive ? 'active' : ''}`}>
          <ul>
            <NavItem to="/" text="Home" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/dienstleistungen" text="Dienstleistungen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kundeerfassen" text="Kontakt" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/werbung" text="Werbung" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kundenbewertungen" text="Bewertungen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/faq" text="FAQ" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            {isAdmin ? (
              <>
                <NavItem to="/gutscheine-liste" text="Gutscheinliste" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                <NavItem to="/gutschein" text="Gutschein Erstellen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                <NavItem to="/kunden" text="Kunden" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                <NavItem to="/mitarbeiter" text="Mitarbeiter" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                <NavItem to="/mitarbeitererfassen" text="Mitarbeiter Erfassen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                <NavItem to="/kundenscanner" text="Kundenscanner" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                <NavItem to="/gutscheinscanner" text="Gutscheinscanner" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                <p className='admin'>Admin</p>
                <button className="logout-button" onClick={onLogout}>
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <NavItem to="/login" text="Login" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, text, icon, count, currentPath, onClick }) {
  return (
    <li>
      <Link to={to} className={currentPath === to ? 'active' : ''} onClick={onClick}>
        {to === "/warenkorb" ? (
          <span>
            {icon}
            {count > 0 && <span className="warenkorb-count">{count}</span>}
          </span>
        ) : (
          text
        )}
        {currentPath === to && <span className="active-indicator"></span>}
      </Link>
    </li>
  );
}

export default Navbar;
