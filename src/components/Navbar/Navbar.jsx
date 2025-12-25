import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.scss";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
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

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">TBS Solutions</Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dienstleistungen">Dienstleistungen</Link></li>
          <li><Link to="/preisinformationen">Preise</Link></li>
          <li><Link to="/bewertungen">Bewertungen</Link></li>

          <li><Link to="/kontakt">Kontakt</Link></li>
          <li><Link to="/faq">FAQ</Link></li>

          {/* ================= ADMIN ================= */}
          {isLoggedIn && isAdmin && (
            <li
              className={`admin-wrapper ${adminOpen ? "active" : ""}`}
              onMouseEnter={() => setAdminOpen(true)}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <span
                className="admin-trigger"
                onClick={() => setAdminOpen(!adminOpen)}
              >
                Admin ▾
              </span>

              <div className="admin-mega">
                <div className="mega-col">
                  <h4>Verwaltung</h4>
                  <Link to="/mitarbeiter">Mitarbeiter</Link>
                  <Link to="/allbewerbungen">Bewerbungen</Link>
                  <Link to="/newsletter-subscribers">Newsletter</Link>
                </div>

                <div className="mega-col">
                  <h4>Inventur</h4>
                  <Link to="/inventur">Inventur</Link>
                  <Link to="/products">Produkte</Link>
                  <Link to="/aktionen">Aktionen</Link>
                </div>

                <div className="mega-col">
                  <h4>Verkauf</h4>
                  <Link to="/kassenlogin">Kasse</Link>
                  <Link to="/kundenkarten">Kundenkarten</Link>
                  <Link to="/gutscheine-liste">Gutscheine</Link>
                </div>

                <div className="mega-col">
                  <h4>Abrechnung</h4>
                  <Link to="/rechnungen">Rechnungen</Link>
                  <Link to="/statistiken">Statistik</Link>
                </div>
              </div>
            </li>
          )}
          {/* ========================================== */}

          {isLoggedIn && (
            <>
              <li><Link to="/kunden">Kunden</Link></li>
              <li><Link to="/profile">Profil</Link></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
