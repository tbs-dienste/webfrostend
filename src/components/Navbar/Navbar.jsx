import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import logo from '../../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faHome, 
  faCogs as faServicestack, 
  faPhoneAlt, 
  faDollarSign, 
  faQuestionCircle, 
  faGift, 
  faUser, 
  faUsers, 
  faBarcode, 
  faBars as faMenu 
} from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const currentPath = window.location.pathname;
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [adminMenuActive, setAdminMenuActive] = useState(false);
  
  const navigate = useNavigate(); // Hook zum Navigieren

  // Rolle des Benutzers aus localStorage abrufen
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Prüfen, ob der Benutzer Admin ist

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin'); // Optional: Entferne den Admin-Status
    navigate('/login'); // Weiterleitung zur Login-Seite nach dem Logout
  };

  const toggleBurgerMenu = () => setBurgerMenuActive(prev => !prev);
  const toggleAdminMenu = () => setAdminMenuActive(prev => !prev);

  useEffect(() => {
    if (burgerMenuActive) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll'); // Cleanup
  }, [burgerMenuActive]);

  return (
    <nav className={`navbar ${burgerMenuActive ? 'burger-menu-active' : ''}`}>
      <div className='container'>
        <div className='logobox'>
          <Link to="/"><img src={logo} alt="Logo" className='logo' /></Link>
        </div>
        <div className={`menu-icon ${burgerMenuActive ? 'active' : ''}`} onClick={toggleBurgerMenu}>
          <FontAwesomeIcon icon={faMenu} />
        </div>
        <div className={`nav-elements ${burgerMenuActive ? 'active' : ''}`}>
          <ul>
            <NavItem to="/" text="Home" icon={faHome} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/dienstleistungen" text="Dienstleistungen" icon={faServicestack} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/kontakt" text="Kontakt" icon={faPhoneAlt} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />            
            <NavItem to="/preisinformationen" text="Preisinformationen" icon={faDollarSign} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            <NavItem to="/faq" text="FAQ" icon={faQuestionCircle} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
            
            {isAdmin && (
              <>
                <li className="dropdown">
                  <button className={`dropdown-toggle ${adminMenuActive ? 'active' : ''}`} onClick={toggleAdminMenu}>
                    Admin
                  </button>
                  <div className={`dropdown-menu ${adminMenuActive ? 'show' : ''}`}>
                    <NavItem to="/gutscheine-liste" text="Gutscheinliste" icon={faGift} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/kunden" text="Kunden" icon={faUser} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/mitarbeiter" text="Mitarbeiter" icon={faUsers} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                    <NavItem to="/kundenscanner" text="Kundenscanner" icon={faBarcode} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
                  </div>
                </li>
                <button className="logout-button" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </>
            )}

            {!isAdmin && (
              <NavItem to="/login" text="Login" icon={faSignOutAlt} currentPath={currentPath} onClick={() => setBurgerMenuActive(false)} />
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
        {icon && <span className="icon"><FontAwesomeIcon icon={icon} /></span>}
        {text}
      </Link>
    </li>
  );
}

export default Navbar;
