import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.scss';
import logo from '../../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faHome,
  faCogs,
  faPhoneAlt,
  faDollarSign,
  faQuestionCircle,
  faStar,
  faBars,
  faSignInAlt,
  faUser,
  faDownload,
  faMoneyBill,
  faPaperPlane,
  faChartBar,
  faVirus,
  faCashRegister,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const currentPath = window.location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          setUserRole(decoded.userType);
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Token ungültig:', error);
        handleLogout();
      }
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole('');
    setLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  const handleKassenLogout = () => {
    localStorage.removeItem('token');
    setUserRole('');
    setLoggedIn(false);
    navigate('/kassenlogin');
    window.location.reload();
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  return (
    <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar__wrapper">

        {/* LOGO */}
        <div className="navbar__logo-container">
          <Link to="/" className="navbar__logo-link">
            <img src={logo} alt="TBS Solutions Logo" className="navbar__logo" />
          </Link>
        </div>

        {/* BURGER ICON */}
        <div className={`navbar__toggle-icon ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        {/* MENU */}
        <div className={`navbar__menu ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar__list">

            {/* IMMER SICHTBAR */}
            <NavItem to="/" text="Startseite" icon={faHome} currentPath={currentPath} onClick={toggleMenu} />
            <NavItem to="/ueber-uns" text="Über Uns" icon={faInfoCircle} currentPath={currentPath} onClick={toggleMenu} />
            <NavItem to="/bewertungen" text="Bewertungen" icon={faStar} currentPath={currentPath} />
            <NavItem to="/faq" text="FAQ" icon={faQuestionCircle} currentPath={currentPath} />
            <NavItem to="/dienstleistungen" text="Dienstleistungen" icon={faCogs} currentPath={currentPath} />
            <NavItem to="/kontakt" text="Kontakt" icon={faPhoneAlt} currentPath={currentPath} />
            <NavItem to="/preisinformationen" text="Preise" icon={faDollarSign} currentPath={currentPath} />

            {/* NUR WENN EINGELOGGT */}
            {loggedIn && (
              <>
                {/* Admin UND Mitarbeiter haben Kategorien */}
                <li className="navbar__category">Mein Bereich</li>

                {userRole === 'admin' && (
                  <>
                    <li className="navbar__category">Admin Panel</li>
                    <NavItem to="/mitarbeiter" text="Mitarbeiter" icon={faUser} currentPath={currentPath} />
                    <NavItem to="/kunden" text="Kunden" icon={faUser} currentPath={currentPath} />
                    <NavItem to="/gutscheine-liste" text="Gutscheine" icon={faMoneyBill} currentPath={currentPath} />
                    <NavItem to="/rechnungen" text="Rechnungen" icon={faPaperPlane} currentPath={currentPath} />
                    <NavItem to="/statistiken" text="Statistiken" icon={faChartBar} currentPath={currentPath} />
                    <NavItem to="/download" text="Downloads" icon={faDownload} currentPath={currentPath} />
                    <NavItem
                      to="/kassenlogin"
                      text="Kasse starten"
                      icon={faCashRegister}
                      currentPath={currentPath}
                      onClick={() => {
                        handleKassenLogout();
                        toggleMenu();
                      }}
                    />
                  </>
                )}

                {userRole === 'mitarbeiter' && (
                  <>
                    <li className="navbar__category">Mitarbeiter Portal</li>
                    <NavItem to="/antrag" text="Neuer Antrag" icon={faPaperPlane} currentPath={currentPath} />
                    <NavItem to="/alleAntraege" text="Alle Anträge" icon={faPaperPlane} currentPath={currentPath} />
                    <NavItem to="/createkrankmeldung" text="Krankmeldung" icon={faVirus} currentPath={currentPath} />
                  </>
                )}

                {/* Gemeinsame Links für beide */}
                <NavItem to="/profile" text="Mein Profil" icon={faUser} currentPath={currentPath} />
              </>
            )}

            {/* LOGIN / LOGOUT */}
            {!loggedIn ? (
              <NavItem to="/login" text="Einloggen" icon={faSignInAlt} currentPath={currentPath} />
            ) : (
              <button className="navbar__logout-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
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
    <li className="navbar__item">
      <Link
        to={to}
        className={`navbar__link ${currentPath === to ? 'active' : ''}`}
        onClick={onClick}
      >
        {icon && <FontAwesomeIcon icon={icon} className="navbar__icon" />}
        <span className="navbar__text">{text}</span>
      </Link>
    </li>
  );
}

export default Navbar;