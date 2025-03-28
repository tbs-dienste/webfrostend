import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.scss";
import logo from "../../logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faInfoCircle,
  faChevronDown,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [burgerMenuActive, setBurgerMenuActive] = useState(false);
  const [userType, setUserType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          setUserType(decodedToken.userType);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Ungültiger Token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserType("");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className={`navbar ${burgerMenuActive ? "burger-menu-active" : ""}`}>
      <div className="navbar-container">
        <div className="logo-box">
          <Link to="/" onClick={() => setBurgerMenuActive(false)}>
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <div className="menu-icon" onClick={() => setBurgerMenuActive(!burgerMenuActive)}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        <ul className={`nav-items ${burgerMenuActive ? "active" : ""}`}>
          <NavItem to="/" text="Home" icon={faHome} setBurgerMenuActive={setBurgerMenuActive} />
          <NavItem to="/dienstleistungen" text="Dienstleistungen" icon={faCogs} setBurgerMenuActive={setBurgerMenuActive} />
          <NavItem to="/kontakt" text="Kontakt" icon={faPhoneAlt} setBurgerMenuActive={setBurgerMenuActive} />
          <NavItem to="/preisinformationen" text="Preisinformationen" icon={faDollarSign} setBurgerMenuActive={setBurgerMenuActive} />
          <NavItem to="/faq" text="FAQ" icon={faQuestionCircle} setBurgerMenuActive={setBurgerMenuActive} />
          <NavItem to="/bewertungen" text="Bewertungen" icon={faStar} setBurgerMenuActive={setBurgerMenuActive} />
          <NavItem to="/ueber-uns" text="Über Uns" icon={faInfoCircle} setBurgerMenuActive={setBurgerMenuActive} />
          <NavItem to="/stellen" text="Stellen" icon={faPerson} setBurgerMenuActive={setBurgerMenuActive} />


          {isLoggedIn && userType === "admin" && (
            <DropdownItem
              text="Admin"
              icon={faUser}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              setBurgerMenuActive={setBurgerMenuActive}
              options={[
                { to: "/mitarbeiter", text: "Mitarbeiter" },
                { to: "/download", text: "Download" },
                { to: "/kundenkarten", text: "Kundenkarten" },
                { to: "/kassenlogin", text: "Kasse" },
                { to: "/gutscheine-liste", text: "Gutscheine" },
                { to: "/rechnungen", text: "Rechnungen" },
                { to: "/statistiken", text: "Statistik" },
                { to: "/allbewerbungen", text: "Bewerbungen" },

              ]}
            />
          )}

          {isLoggedIn && userType === "mitarbeiter" && (
            <DropdownItem
              text="Abwesenheitsverwaltung"
              icon={faUser}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              setBurgerMenuActive={setBurgerMenuActive}
              options={[
                { to: "/createkrankmeldung", text: "Krankmeldung einreichen" },
                { to: "/antrag", text: "Antrag stellen" },
                { to: "/alleAntraege", text: "Meine Anträge" },
              ]}
            />
          )}

          {isLoggedIn && ['admin', 'mitarbeiter'].includes(userType) && (
            <>
              <NavItem to="/kunden" text="Kunden" icon={faUser} setBurgerMenuActive={setBurgerMenuActive} />
              <NavItem to="/profile" text="Profil" icon={faUser} setBurgerMenuActive={setBurgerMenuActive} />
            </>
          )}

          {!isLoggedIn ? (
            <NavItem to="/login" text="Login" icon={faSignInAlt} setBurgerMenuActive={setBurgerMenuActive} />
          ) : (
            <button className="logout-button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
}

function NavItem({ to, text, icon, setBurgerMenuActive }) {
  return (
    <li>
      <Link to={to} className="nav-link" onClick={() => setBurgerMenuActive(false)}>
        <FontAwesomeIcon icon={icon} className="icon" /> {text}
      </Link>
    </li>
  );
}

function DropdownItem({ text, icon, activeDropdown, setActiveDropdown, setBurgerMenuActive, options }) {
  const isActive = activeDropdown === text;
  return (
    <li className="dropdown">
      <div
        className="nav-link dropdown-toggle"
        onClick={() => setActiveDropdown(isActive ? null : text)}
      >
        <FontAwesomeIcon icon={icon} className="icon" /> {text} <FontAwesomeIcon icon={faChevronDown} />
      </div>
      {isActive && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li key={index}>
              <Link
                to={option.to}
                className="dropdown-item"
                onClick={() => {
                  setActiveDropdown(null);
                  setBurgerMenuActive(false);
                }}
              >
                {option.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default Navbar;
