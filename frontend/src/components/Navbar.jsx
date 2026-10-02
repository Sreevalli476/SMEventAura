import { useState, useRef, useEffect } from "react";
import { Link, navigate } from "../lib/router";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const profileRef = useRef(null);
  const loginRef = useRef(null);

  const go = (id) => {
    setLoginOpen(false);
    setProfileOpen(false);

    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        loginRef.current &&
        !loginRef.current.contains(event.target)
      ) {
        setLoginOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="nav-inner">

        {/* ================= LOGO ================= */}
        <Link className="logo" to="/">
          <span className="logo-sm">SM</span>
          <span className="logo-event">EventAura</span>
        </Link>

        {/* ================= MAIN NAVIGATION ================= */}
        <nav className="main-nav">

          <Link
            to="/"
            className={
              window.location.pathname === "/"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </Link>

          <button
            type="button"
            className="nav-link nav-button"
            onClick={() => go("services")}
          >
            Services
          </button>

          <Link
            to="/gallery"
            className={
              window.location.pathname === "/gallery"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Gallery
          </Link>

          <button
            type="button"
            className="nav-link nav-button"
            onClick={() => go("about")}
          >
            About
          </button>

        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="nav-actions">

          {user ? (

            /* ================= LOGGED IN ================= */
            <div
              className="profile-container"
              ref={profileRef}
            >
              <button
                type="button"
                className="profile-button"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span className="profile-icon">👤</span>

                <span className="profile-name">
                  {user.name || "Account"}
                </span>

                <span className="profile-arrow">
                  {profileOpen ? "▲" : "▼"}
                </span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">

                  <div className="profile-header">

                    <div className="large-profile-icon">
                      👤
                    </div>

                    <div>
                      <h3>
                        {user.name || "User"}
                      </h3>

                      <p>
                        {user.email || "No email"}
                      </p>
                    </div>

                  </div>

                  <div className="profile-divider" />

                  {/* Dashboard */}
                  <Link
                    to={
                      user.role === "ADMIN"
                        ? "/admin/dashboard"
                        : "/dashboard"
                    }
                    className="profile-menu-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    📊 Dashboard
                  </Link>

                  {/* Gallery */}
                  <Link
                    to="/gallery"
                    className="profile-menu-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    🖼️ Gallery
                  </Link>

                  <div className="profile-info">
                    <span>👤 Name</span>
                    <strong>
                      {user.name || "Not available"}
                    </strong>
                  </div>

                  <div className="profile-info">
                    <span>✉ Email</span>
                    <strong>
                      {user.email || "Not available"}
                    </strong>
                  </div>

                  <div className="profile-info">
                    <span>🔑 Role</span>
                    <strong>
                      {user.role || "CUSTOMER"}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="profile-signout"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                    }}
                  >
                    ↪ Sign Out
                  </button>

                </div>
              )}
            </div>

          ) : (

            /* ================= LOGGED OUT ================= */
            <div
              className="login-selector"
              ref={loginRef}
            >

              <button
                type="button"
                className="signin-btn"
                onClick={() => setLoginOpen(!loginOpen)}
              >
                Sign In
                <span className="signin-arrow">
                  {loginOpen ? "▲" : "▼"}
                </span>
              </button>

              {loginOpen && (
                <div className="login-dropdown">

                  <Link
                    to="/login"
                    className="login-option"
                    onClick={() => setLoginOpen(false)}
                  >
                    <span>👤</span>
                    Customer Login
                  </Link>

                  <Link
                    to="/admin/login"
                    className="login-option"
                    onClick={() => setLoginOpen(false)}
                  >
                    <span>🔐</span>
                    Admin Login
                  </Link>

                </div>
              )}

              <Link
                className="signup-btn"
                to="/signup"
              >
                Sign Up
              </Link>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}