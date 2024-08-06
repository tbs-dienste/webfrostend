import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';

function Navbar({ isAdmin, onLogout }) {
  const currentPath = window.location.pathname;
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [warenkorbCount, setWarenkorbCount] = useState(0);
  const [adminMenuActive, setAdminMenuActive] = useState(false);

  useEffect(() => {
    // Hier kannst du Warenkorb-Count initialisieren, falls nötig
  }, []);

  const toggleBurgerMenu = () => {
    setBurgerMenuActive(!burgerMenuActive);
  };

  const toggleAdminMenu = () => {
    setAdminMenuActive(!adminMenuActive);
  };

  return (
    <div className={`navbar ${burgerMenuActive ? 'burger-menu-active' : ''}`}>
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
            <NavItem to="/kundeerfassen" text="Kontakt" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/sign" text="Vertragunterschreiben" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kurse" text="Kurse" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/bewertungen" text="Bewertungen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/preisinformationen" text="Preisinformationen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/faq" text="FAQ" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/warenkorb" text="Warenkorb" icon={<FaShoppingCart />} count={warenkorbCount} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            {isAdmin ? (
              <>
                <li className="dropdown">
                  <button className={`dropdown-toggle ${adminMenuActive ? 'active' : ''}`} onClick={toggleAdminMenu}>
                    Admin
                  </button>
                  <div className={`dropdown-menu ${adminMenuActive ? 'show' : ''}`}>
                    <NavItem to="/gutscheine-liste" text="Gutscheinliste" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/gutschein" text="Gutschein Erstellen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/infos" text="Betriebsordnung" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />

                    <NavItem to="/kunden" text="Kunden" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/vertrag" text="Vertrag" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/mitarbeiter" text="Mitarbeiter" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/mitarbeitererfassen" text="Mitarbeiter Erfassen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/kundenscanner" text="Kundenscanner" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/gutscheinscanner" text="Gutscheinscanner" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                  </div>
                </li>
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
        {icon && <span className="icon">{icon}</span>}
        {text}
        {count > 0 && to === "/warenkorb" && <span className="warenkorb-count">{count}</span>}
        {currentPath === to && <span className="active-indicator"></span>}
      </Link>
    </li>
  );
}

export default Navbar;
