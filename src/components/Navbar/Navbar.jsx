import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // jwt-decode importieren
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
  faStar,
  faBars as faMenu,
  faSignInAlt,
  faUser,
  faDownload,
  faMoneyBill,
  faPaperPlane,
  faBarChart,
  faVirus,
  faBarcode,

} from '@fortawesome/free-solid-svg-icons';
import { FaSalesforce } from 'react-icons/fa';

function Navbar() {
  const currentPath = window.location.pathname;
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [userType, setUserType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token abgelaufen
          handleLogout();
        } else {
          setUserType(decodedToken.userType);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Ungültiger Token:', error);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserType('');
    setIsLoggedIn(false);
    navigate('/'); // Zur Login-Seite navigieren
    window.location.reload(); // Seite aktualisieren
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
      <div className="navbar-container">
        <div className="logo-box">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <div className={`menu-icon ${burgerMenuActive ? 'active' : ''}`} onClick={toggleBurgerMenu}>
          <FontAwesomeIcon icon={faMenu} />
        </div>

        <div className={`nav-items ${burgerMenuActive ? 'active' : ''}`}>
          <ul>
            {/* Immer sichtbare Elemente */}
            <NavItem to="/" text="Home" icon={faHome} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/dienstleistungen" text="Dienstleistungen" icon={faServicestack} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/kontakt" text="Kontakt" icon={faPhoneAlt} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/preisinformationen" text="Preisinformationen" icon={faDollarSign} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/faq" text="FAQ" icon={faQuestionCircle} currentPath={currentPath} onClick={toggleBurgerMenu} />
            <NavItem to="/bewertungen" text="Bewertungen" icon={faStar} currentPath={currentPath} onClick={toggleBurgerMenu} />

            {/* Admin-spezifische Elemente */}
            {isLoggedIn && userType === 'admin' && (
              <>
                <NavItem to="/mitarbeiter" text="Mitarbeiter" icon={faUser} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/download" text="Download" icon={faDownload} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/gutscheinscanner" text="Gutscheinescanner" icon={faBarcode} currentPath={currentPath} onClick={toggleBurgerMenu} />

                <NavItem to="/gutscheine-liste" text="Gutscheine" icon={faMoneyBill} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/rechnungen" text="Rechnungen" icon={faPaperPlane} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/statistiken" text="Statistik" icon={faBarChart} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/gutscheinbestellung" text="Gutscheinbestellung"  currentPath={currentPath} onClick={toggleBurgerMenu} />
              </>
            )}


            {isLoggedIn && userType === 'mitarbeiter' && (
              <>
                <NavItem to="/antrag" text="Antrag stellen" icon={faPaperPlane} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/alleAntraege" text="Alle Anträge" icon={faPaperPlane} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/createkrankmeldung" text="Krank Melden" icon={faVirus} currentPath={currentPath} onClick={toggleBurgerMenu} />

              </>
            )}
            {/* Admin- und Mitarbeiter-spezifische Elemente */}
            {isLoggedIn && ['admin', 'mitarbeiter'].includes(userType) && (
              <>
                <NavItem to="/kunden" text="Kunden" icon={faUser} currentPath={currentPath} onClick={toggleBurgerMenu} />
                <NavItem to="/profile" text="Profil" icon={faUser} currentPath={currentPath} onClick={toggleBurgerMenu} />

              </>
            )}

            {/* Login anzeigen, wenn nicht eingeloggt */}
            {!isLoggedIn && (
              <NavItem to="/login" text="Login" icon={faSignInAlt} currentPath={currentPath} onClick={toggleBurgerMenu} />
            )}

            {/* Logout anzeigen, wenn eingeloggt */}
            {isLoggedIn && (
              <button className="logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
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
