import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.scss";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        handleLogout();
      } else {
        setIsLoggedIn(true);
        setIsAdmin(decoded.userType === "admin");
      }
    } catch {
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
    window.location.reload();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAdminOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          TBS Solutions
        </Link>

        {/* ===== BURGER ===== */}
        <button
          className={`burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* ===== LINKS ===== */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/dienstleistungen" onClick={closeMenu}>Dienstleistungen</Link></li>
          <li><Link to="/preisinformationen" onClick={closeMenu}>Preise</Link></li>
          <li><Link to="/bewertungen" onClick={closeMenu}>Bewertungen</Link></li>
          <li><Link to="/kontakt" onClick={closeMenu}>Kontakt</Link></li>
          <li><Link to="/faq" onClick={closeMenu}>FAQ</Link></li>

          {/* ===== ADMIN ===== */}
          {isLoggedIn && isAdmin && (
            <li className={`admin-wrapper ${adminOpen ? "active" : ""}`}>
              <span
                className="admin-trigger"
                onClick={() => setAdminOpen(!adminOpen)}
              >
                Admin ▾
              </span>

              <div className="admin-mega">
                <div className="mega-col">
                  <h4>Verwaltung</h4>
                  <Link to="/mitarbeiter" onClick={closeMenu}>Mitarbeiter</Link>
                  <Link to="/allbewerbungen" onClick={closeMenu}>Bewerbungen</Link>
                  <Link to="/newsletter-subscribers" onClick={closeMenu}>Newsletter</Link>
                </div>

                <div className="mega-col">
                  <h4>Inventur</h4>
                  <Link to="/inventur" onClick={closeMenu}>Inventur</Link>
                  <Link to="/products" onClick={closeMenu}>Produkte</Link>
                  <Link to="/aktionen" onClick={closeMenu}>Aktionen</Link>
                </div>

                <div className="mega-col">
                  <h4>Verkauf</h4>
                  <Link to="/kassenlogin" onClick={closeMenu}>Kasse</Link>
                  <Link to="/kundenkarten" onClick={closeMenu}>Kundenkarten</Link>
                  <Link to="/gutscheine-liste" onClick={closeMenu}>Gutscheine</Link>
                </div>

                <div className="mega-col">
                  <h4>Abrechnung</h4>
                  <Link to="/rechnungen" onClick={closeMenu}>Rechnungen</Link>
                  <Link to="/statistiken" onClick={closeMenu}>Statistik</Link>
                </div>
              </div>
            </li>
          )}

          {isLoggedIn && (
            <>
              <li><Link to="/kunden" onClick={closeMenu}>Kunden</Link></li>
              <li><Link to="/profile" onClick={closeMenu}>Profil</Link></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
