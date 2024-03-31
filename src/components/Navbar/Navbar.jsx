import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { FaSignOutAlt } from 'react-icons/fa';

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
      <div className='container'>
        {
          /* 
           <div className='logo-container'>
          <img alt='logo' className='logo' src={logo} />
        </div>
          */
        }
       
        <div className={`menu-icon ${burgerMenuActive ? 'active' : ''}`} onClick={toggleBurgerMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`nav-elements ${burgerMenuActive ? 'active' : ''}`}>
          <ul>
            <NavItem to="/" text="Home" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/dienstleistungen" text="Dienstleistungen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kunden" text="Kunden" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kundeerfassen" text="Kunde Erfassen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/mitarbeiter" text="Mitarbeiter" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/mitarbeitererfassen" text="Mitarbeiter Erfassen" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kurse" text="Kurse" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/werbung" text="Werbung" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/login" text="Login" currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            {isAdmin ? (
              <>
 
              <p className='admin'>Admin</p>
              <button className="logout-button" onClick={handleLogout}>
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

function NavItem({ to, text, currentPath, onClick }) {
  return (
    <li>
      <Link to={to} className={currentPath === to ? 'active' : ''} onClick={onClick}>
        {text}
        {currentPath === to && <span className="active-indicator"></span>}
      </Link>
    </li>
  );
}

export default Navbar;
