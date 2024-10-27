import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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
  faPaperPlane,
  faBars as faMenu
} from '@fortawesome/free-solid-svg-icons';
import { FaApper, FaPaperPlane } from 'react-icons/fa';

function Navbar() {
  const currentPath = window.location.pathname;
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [benutzername, setBenutzername] = useState('');
  const [userType, setUserType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Neuer Zustand für Login-Status

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setBenutzername(decodedToken.benutzername);
        setUserType(decodedToken.userType);
        setIsAdmin(decodedToken.userType === 'admin');
        setIsLoggedIn(true); // Benutzer ist eingeloggt
      } catch (error) {
        console.error('Fehler beim Decodieren des Tokens:', error);
      }
    } else {
      setIsLoggedIn(false); // Benutzer ist nicht eingeloggt
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setBenutzername('');
    setIsAdmin(false);
    setIsLoggedIn(false); // Setze Login-Status auf false
    navigate('/login');
  };

  const toggleBurgerMenu = () => setBurgerMenuActive(prev => !prev);

  useEffect(() => {
    if (burgerMenuActive) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
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
            <NavItem to="/" text="Home" icon={faHome} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/dienstleistungen" text="Dienstleistungen" icon={faServicestack} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/kontakt" text="Kontakt" icon={faPhoneAlt} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/preisinformationen" text="Preisinformationen" icon={faDollarSign} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/faq" text="FAQ" icon={faQuestionCircle} currentPath={currentPath} onClick={toggleBurgerMenu} />

            {userType === 'admin' && (
              <>
                <NavItem to="/gutscheine-liste" text="Gutscheinliste" icon={faGift} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/mitarbeiter" text="Mitarbeiter" icon={faUsers} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/rechnungen" text="Rechnungen" icon={faPaperPlane} currentPath={currentPath} onClick={toggleBurgerMenu} />
              </>
            )}

            {userType === 'admin' || userType === 'mitarbeiter' ? (
              <NavItem to="/kunden" text="Kunden" icon={faUser} currentPath={currentPath} onClick={toggleBurgerMenu} />
            ) : null}

            {isLoggedIn ? (
              <button className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            ) : (
              <NavItem to="/login" text="Login" icon={faSignOutAlt} currentPath={currentPath} onClick={toggleBurgerMenu} />
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
