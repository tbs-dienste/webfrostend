import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { FaSignOutAlt } from 'react-icons/fa';

function Navbar({ isAdmin, onLogout }) {
  const currentPath = window.location.pathname;
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [adminMenuActive, setAdminMenuActive] = useState(false);

  const toggleBurgerMenu = () => setBurgerMenuActive(prev => !prev);
  const toggleAdminMenu = () => setAdminMenuActive(prev => !prev);

  return (
    <nav className={`navbar ${burgerMenuActive ? 'burger-menu-active' : ''}`}>
      <div className='container'>
        <div className='logo'>
          <Link to="/">TBs Solutions</Link>
        </div>
        <div className={`menu-icon ${burgerMenuActive ? 'active' : ''}`} onClick={toggleBurgerMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className={`nav-elements ${burgerMenuActive ? 'active' : ''}`}>
          <ul>
            <NavItem to="/" text="Home" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/dienstleistungen" text="Dienstleistungen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kontakt" text="Kontakt" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/sign" text="Vertrag unterschreiben" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kundenbewertungen" text="Bewertungen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/preisinformationen" text="Preisinformationen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/faq" text="FAQ" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />

            {isAdmin && (
              <>
                <li className="dropdown">
                  <button className={`dropdown-toggle ${adminMenuActive ? 'active' : ''}`} onClick={toggleAdminMenu}>
                    Admin
                  </button>
                  <div className={`dropdown-menu ${adminMenuActive ? 'show' : ''}`}>
                    <NavItem to="/gutscheine-liste" text="Gutscheinliste" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/kunden" text="Kunden" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/mitarbeiter" text="Mitarbeiter" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/kontoangaben" text="Kontoangaben" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/kundenscanner" text="Kundenscanner" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/gutscheinscanner" text="Gutscheinscanner" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                  </div>
                </li>
                <button className="logout-button" onClick={onLogout}>
                  <FaSignOutAlt />
                </button>
              </>
            )}
            
            {!isAdmin && (
              <NavItem to="/login" text="Login" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            )}
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, text, icon, currentPath, onClick }) {
  return (
    <li>
      <Link to={to} className={`nav-link ${currentPath === to ? 'active' : ''}`} onClick={onClick}>
        {icon && <span className="icon">{icon}</span>}
        {text}
        {to === "/warenkorb" && <span className="warenkorb-count">3</span>} {/* Example count */}
      </Link>
    </li>
  );
}

export default Navbar;
