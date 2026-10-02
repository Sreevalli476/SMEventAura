import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function AdminLogin({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid email or password.");
        return;
      }

      const loggedInUser = data.user;

      // Check whether the logged-in account is an ADMIN
      if (!loggedInUser || loggedInUser.role !== "ADMIN") {
        setMessage(
          "Access denied. Only administrators can log in here."
        );
        return;
      }

      // Save the admin user
      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // Update the user state in App.jsx
      if (onLogin) {
        onLogin(loggedInUser);
      }

      setMessage("Admin login successful!");

      setTimeout(() => {
        navigate("/admin");
      }, 700);
    } catch (error) {
      console.error("Admin login error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-intro">
          <div className="login-logo">
            SM <span>EventAura</span>
          </div>

          <p className="login-label">
            ✦ ADMIN PORTAL ✦
          </p>

          <h1>
            Admin
            <br />
            Login
          </h1>

          <p className="login-description">
            Welcome to the SM EventAura administration
            portal. Manage bookings, decorations,
            customers, and services from one place.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="login-card">
          <div className="login-heading">
            <h2>Admin Sign In</h2>

            <p>
              Sign in using your administrator account.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleAdminLogin}
          >
            {/* EMAIL */}
            <div className="login-form-group">
              <label htmlFor="admin-email">
                Admin Email Address
              </label>

              <input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="login-form-group">
              <label htmlFor="admin-password">
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </div>

            {/* MESSAGE */}
            {message && (
              <p className="login-message">
                {message}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Admin Sign In"}

              <span>✦</span>
            </button>

            {/* CUSTOMER LOGIN LINK */}
            <p className="signup-link">
              Are you a customer?{" "}

              <Link to="/login">
                Customer Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;