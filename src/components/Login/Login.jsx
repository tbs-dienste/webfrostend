
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowRight,
  FiLock,
  FiUser,
  FiShield
} from "react-icons/fi";

import "./Login.scss";

const Login = () => {
  const [benutzername, setBenutzername] = useState("");
  const [passwort, setPasswort] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/login",
        {
          benutzername,
          passwort
        }
      );

      const { token, userType } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      window.dispatchEvent(new Event("authChange"));

      navigate("/kunden");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Benutzername oder Passwort ist falsch."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <section className="login-brand">

        <div className="brand-content">

          <div className="brand-mark">
            TBS
          </div>

          <span className="brand-label">
            TBS SOLUTIONS
          </span>

          <h1>
            Digitale Struktur.
            <br />
            <span>Einfach. Persönlich.</span>
          </h1>

          <p>
            Willkommen im geschützten
            Verwaltungsbereich von TBS Solutions.
          </p>

          <div className="brand-line" />

          <div className="brand-security">
            <FiShield />
            <span>
              Sicherer interner Zugang
            </span>
          </div>

        </div>

        <div className="brand-footer">
          <span>© {new Date().getFullYear()} TBS Solutions</span>
          <span>Digital Business</span>
        </div>

      </section>


      <section className="login-area">

        <div className="login-box">

          <div className="login-header">

            <div className="login-icon">
              <FiLock />
            </div>

            <span className="login-overline">
              MITARBEITERBEREICH
            </span>

            <h2>
              Willkommen zurück
            </h2>

            <p>
              Melden Sie sich an, um auf
              Ihren Bereich zuzugreifen.
            </p>

          </div>


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="input-group">

              <label htmlFor="benutzername">
                Benutzername
              </label>

              <div className="input-wrapper">

                <FiUser />

                <input
                  id="benutzername"
                  type="text"
                  placeholder="Ihr Benutzername"
                  value={benutzername}
                  onChange={(e) =>
                    setBenutzername(e.target.value)
                  }
                  autoComplete="username"
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label htmlFor="passwort">
                Passwort
              </label>

              <div className="input-wrapper">

                <FiLock />

                <input
                  id="passwort"
                  type="password"
                  placeholder="Ihr Passwort"
                  value={passwort}
                  onChange={(e) =>
                    setPasswort(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

              </div>

            </div>


            {error && (
              <div className="login-error">
                <span />
                {error}
              </div>
            )}


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Anmeldung läuft..."
                  : "Anmelden"}
              </span>

              {!loading && (
                <FiArrowRight />
              )}

            </button>

          </form>


          <div className="login-security">

            <FiShield />

            <div>
              <strong>
                Geschützter Bereich
              </strong>

              <span>
                Ihre Verbindung wird sicher übertragen.
              </span>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Login;

